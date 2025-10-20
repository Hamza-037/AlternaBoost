import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { applyRateLimit } from "@/lib/rate-limiter";
import { handleApiError, ValidationError } from "@/lib/errors";
import type { CVAnalysisResponse, CVAnalysisResult } from "@/types/cv-extraction";
import type { CVFormValues } from "@/lib/validations/cv-schema";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "127.0.0.1";
    await applyRateLimit(clientIp, {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 5,
    });

    // 2. Récupérer les données du CV
    const cvData: CVFormValues = await request.json();

    // 3. Validation basique
    if (!cvData.nom || !cvData.prenom) {
      throw new ValidationError("Le nom et le prénom sont requis pour l'analyse");
    }

    // 4. Analyser le CV avec OpenAI
    const analysis = await analyzeCVQuality(cvData);

    // 5. Retourner l'analyse
    const response: CVAnalysisResponse = {
      success: true,
      analysis,
      message: "Analyse du CV terminée"
    };

    return NextResponse.json(response);

  } catch (error) {
    return handleApiError(error);
  }
}

async function analyzeCVQuality(cvData: CVFormValues): Promise<CVAnalysisResult> {
  // Préparer les données pour l'analyse
  const experiencesText = cvData.experiences
    .map((exp, i) => `${i + 1}. ${exp.poste} chez ${exp.entreprise} (${exp.periode})\n   ${exp.description}`)
    .join("\n\n");

  const prompt = `Tu es un expert en recrutement et en analyse de CV professionnels. 
Analyse ce CV et fournis un scoring détaillé avec des recommandations concrètes.

INFORMATIONS DU CV :
Nom : ${cvData.prenom} ${cvData.nom}
Email : ${cvData.email}
Téléphone : ${cvData.telephone}

Formation : ${cvData.formation} à ${cvData.ecole} (${cvData.anneeFormation})

Expériences :
${experiencesText}

Compétences : ${cvData.competences}

Objectif : ${cvData.objectif}

Entreprise ciblée : ${cvData.entrepriseCiblee}

INSTRUCTIONS D'ANALYSE :

1. SCORING (notes sur 100) :
   - Contenu : Qualité des expériences, présence de réalisations concrètes, verbes d'action
   - Structure : Clarté, organisation logique, facilité de lecture
   - Compétences : Pertinence, diversité, alignement avec l'objectif
   - ATS : Compatibilité avec les systèmes de recrutement automatisés (mots-clés, format)
   - Impact : Utilisation de chiffres, quantification des résultats, impact mesurable

2. POINTS FORTS :
   - Identifie 3-5 éléments qui rendent ce CV attractif
   - Sois spécifique et mentionne des exemples précis du CV

3. POINTS FAIBLES :
   - Identifie 3-5 éléments à améliorer
   - Sois constructif et précis

4. RECOMMANDATIONS :
   - Fournis 5-8 recommandations concrètes avec exemples
   - Classe-les par priorité (haute/moyenne/basse)
   - Catégorise-les (contenu/structure/competences/ats/impact)
   - Pour chaque recommandation, donne un exemple concret d'amélioration

5. MOTS-CLÉS MANQUANTS :
   - Liste 5-10 mots-clés pertinents qui pourraient être ajoutés pour ${cvData.entrepriseCiblee}
   - Basé sur l'industrie et le poste visé

6. TAUX DE RÉUSSITE :
   - Estime les chances de succès pour des postes junior (0-100%)
   - Estime les chances de succès pour des postes confirmés (0-100%)

Réponds UNIQUEMENT avec un JSON valide de cette structure exacte :
{
  "scoreGlobal": number (moyenne des 5 scores),
  "scores": {
    "contenu": number,
    "structure": number,
    "competences": number,
    "ats": number,
    "impact": number
  },
  "pointsForts": ["string", "string", "string"],
  "pointsFaibles": ["string", "string", "string"],
  "recommandations": [
    {
      "priorite": "haute" | "moyenne" | "basse",
      "categorie": "contenu" | "structure" | "competences" | "ats" | "impact",
      "titre": "string",
      "description": "string",
      "exemple": "string optionnel"
    }
  ],
  "motsClésManquants": ["string", "string"],
  "tauxReussite": {
    "junior": number,
    "confirme": number
  }
}

Sois précis, constructif et professionnel dans ton analyse.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Tu es un expert en recrutement avec 15 ans d'expérience. Tu analyses des CV et fournis des feedbacks constructifs et actionnables. Tu réponds uniquement en JSON valide."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  });

  const result = completion.choices[0].message.content;
  if (!result) {
    throw new Error("Aucune réponse reçue de l'API OpenAI");
  }

  const analysis: CVAnalysisResult = JSON.parse(result);

  // Validation et normalisation des scores
  if (analysis.scoreGlobal < 0 || analysis.scoreGlobal > 100) {
    analysis.scoreGlobal = Math.max(0, Math.min(100, analysis.scoreGlobal));
  }

  return analysis;
}
