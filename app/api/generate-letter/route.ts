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

    const ton = formData.tonSouhaite ?? "professionnel et impactant";
    const contexteSupplementaire = [
      formData.secteurActivite ? `- Secteur : ${formData.secteurActivite}` : null,
      formData.descriptionPoste ? `- Résumé de l'offre : ${formData.descriptionPoste}` : null,
      formData.motsClesCibles ? `- Mots-clés à intégrer : ${formData.motsClesCibles}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Vous êtes un expert en rédaction de lettres de motivation modernes.
Adoptez un ton ${ton}, équilibré entre personnalisation et professionnalisme.
Rédigez exactement trois paragraphes séparés par des doubles sauts de ligne.
Ne générez ni formule d'appel ni formule de politesse finale.`,
        },
        {
          role: "user",
          content: `Rédige le corps d'une lettre de motivation pour :
- Poste visé : ${formData.posteVise}
- Entreprise : ${formData.entreprise}
- Candidat : ${formData.prenom} ${formData.nom}
${contexteSupplementaire ? `${contexteSupplementaire}\n` : ""}- Motivations : ${formData.motivations}
- Atouts : ${formData.atouts}
- Disponibilité : ${formData.disponibilite}

Paragraphe 1 : accroche + contexte.
Paragraphe 2 : démontrer l'adéquation (compétences, mots-clés, réalisations).
Paragraphe 3 : réaffirmer l'intérêt + disponibilité.

Réponds uniquement avec ces trois paragraphes.`,
        },
      ],
      temperature: 0.65,
      max_tokens: 900,
    });

    const contenuGenere = completion.choices[0]?.message?.content;

    if (!contenuGenere) {
      throw new Error("Pas de contenu généré par l'IA");
    }

    const generatedLetter: GeneratedLetter = {
      ...formData,
      contenuGenere,
      dateGeneration: new Date().toISOString(),
    };

    const pdfBuffer = await generateLetterPDF(generatedLetter);

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
