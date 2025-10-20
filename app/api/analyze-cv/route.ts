import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import type { GeneratedCV } from "@/types/cv";

export interface CVAnalysis {
  score: number; // Score global sur 100
  strengths: string[]; // Points forts
  improvements: string[]; // Axes d'amélioration
  suggestions: string[]; // Suggestions concrètes
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration du serveur manquante : OPENAI_API_KEY n'est pas définie" },
        { status: 500 }
      );
    }

    const cvData: GeneratedCV = await request.json();

    // Construction du prompt pour l'analyse
    const analysisPrompt = `Tu es un expert en recrutement et en rédaction de CV. Analyse le CV suivant et donne un retour détaillé.

**Informations du CV :**
- Nom : ${cvData.prenom} ${cvData.nom}
- Formation : ${cvData.formation} (${cvData.ecole}, ${cvData.anneeFormation})
- Objectif : ${cvData.objectifAmeliore || cvData.objectif}
- Expériences : ${cvData.experiencesAmeliorees.length} expériences
${cvData.experiencesAmeliorees.map((exp, i) => `  ${i + 1}. ${exp.poste} chez ${exp.entreprise} (${exp.periode})`).join('\n')}
- Compétences : ${Array.isArray(cvData.competencesAmeliorees) ? cvData.competencesAmeliorees.join(', ') : cvData.competences}

**Ta mission :**
1. **Score global** : Note ce CV sur 100 en fonction de :
   - Clarté et structure (20%)
   - Pertinence des expériences (30%)
   - Qualité des descriptions (25%)
   - Compétences et objectif (25%)

2. **Points forts** : Identifie 3-4 points forts du CV

3. **Axes d'amélioration** : Identifie 2-3 points à améliorer

4. **Suggestions concrètes** : Donne 3-4 suggestions actionnables pour améliorer ce CV

**Format de réponse (STRICTEMENT EN JSON) :**
{
  "score": <nombre entre 0 et 100>,
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "improvements": ["amélioration 1", "amélioration 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Réponds UNIQUEMENT en JSON valide, sans texte supplémentaire.`;

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en recrutement et en rédaction de CV. Tu donnes des analyses constructives et professionnelles.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Pas de réponse de l'IA");
    }

    // Parser la réponse JSON
    let analysis: CVAnalysis;
    try {
      analysis = JSON.parse(responseContent);
    } catch {
      console.error("Erreur de parsing JSON:", responseContent);
      throw new Error("Réponse de l'IA mal formatée");
    }

    // Validation des données
    if (
      typeof analysis.score !== "number" ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.improvements) ||
      !Array.isArray(analysis.suggestions)
    ) {
      throw new Error("Format d'analyse invalide");
    }

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'analyse du CV:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur inattendue est survenue" }, { status: 500 });
  }
}

