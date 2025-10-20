import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { generateLetterPDF } from "@/lib/pdf/generate-letter-pdf";
import type { LetterFormData, GeneratedLetter } from "@/types/letter";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration du serveur manquante : OPENAI_API_KEY n'est pas définie" },
        { status: 500 }
      );
    }

    const formData: LetterFormData = await request.json();

    // Construction du prompt pour générer la lettre
    const letterPrompt = `Tu es un expert en rédaction de lettres de motivation professionnelles.

**Informations du candidat :**
- Nom : ${formData.prenom} ${formData.nom}
- Poste visé : ${formData.posteVise}
- Entreprise : ${formData.entreprise}
${formData.destinataire ? `- Destinataire : ${formData.destinataire}` : ""}

**Motivations exprimées :**
${formData.motivations}

**Atouts du candidat :**
${formData.atouts}

**Disponibilité :**
${formData.disponibilite}

**Ta mission :**
Rédige une lettre de motivation professionnelle et percutante de 3 paragraphes :

1. **Paragraphe d'introduction** (2-3 phrases) :
   - Présentation et contexte de la candidature
   - Mention du poste et de l'entreprise
   - Accroche qui capte l'attention

2. **Paragraphe de développement** (4-5 phrases) :
   - Développement des motivations
   - Mise en avant des atouts et compétences
   - Lien entre le profil et les besoins de l'entreprise
   - Exemples concrets si possible

3. **Paragraphe de conclusion** (2-3 phrases) :
   - Réaffirmation de l'intérêt pour le poste
   - Mention de la disponibilité
   - Ouverture vers un entretien

**Style :**
- Ton professionnel mais personnel
- Phrases courtes et impactantes
- Éviter les clichés ("Je me permets de...", "Titulaire d'un diplôme...")
- Être direct et concret

Réponds UNIQUEMENT avec le corps de la lettre (sans la formule de politesse finale, elle sera ajoutée automatiquement). Sépare les paragraphes par un double saut de ligne.`;

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en rédaction de lettres de motivation. Tu écris de manière professionnelle, percutante et personnalisée.",
        },
        {
          role: "user",
          content: letterPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const contenuGenere = completion.choices[0]?.message?.content;

    if (!contenuGenere) {
      throw new Error("Pas de contenu généré par l'IA");
    }

    // Créer l'objet GeneratedLetter
    const generatedLetter: GeneratedLetter = {
      ...formData,
      contenuGenere,
      dateGeneration: new Date().toISOString(),
    };

    // Générer le PDF
    const pdfBuffer = await generateLetterPDF(generatedLetter);

    // Retourner le PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Lettre_Motivation_${formData.prenom}_${formData.nom}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la lettre:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue" },
      { status: 500 }
    );
  }
}

