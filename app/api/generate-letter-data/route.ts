import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import type { LetterFormData, GeneratedLetter } from "@/types/letter";

/**
 * API endpoint pour générer uniquement les données de la lettre (JSON)
 * sans créer le PDF. Utilisé pour la prévisualisation.
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration du serveur manquante : OPENAI_API_KEY n'est pas définie" },
        { status: 500 }
      );
    }

    const formData: LetterFormData = await request.json();

    const ton = formData.tonSouhaite ?? "professionnel et chaleureux";
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
          content: `Vous êtes un assistant expert en rédaction de lettres de motivation professionnelles.
Produisez un texte en EXACTEMENT trois paragraphes séparés par un double saut de ligne.

Règles strictes :
1. Trois paragraphes seulement.
2. Ton ${ton}, sans clichés, phrases courtes.
3. Paragraphes : introduction accrocheuse, démonstration de valeur, conclusion avec disponibilité.
4. N'ajoutez pas de formule d'appel ni de formule de politesse (déjà gérées ailleurs).
5. Si des mots-clés ou un résumé d'offre sont fournis, intégrez-les naturellement.
6. L'argumentaire doit relier motivations, atouts et besoins de l'entreprise.`,
        },
        {
          role: "user",
          content: `Générez le corps d'une lettre de motivation pour :
- Poste visé : ${formData.posteVise}
- Entreprise : ${formData.entreprise}
- Nom du candidat : ${formData.prenom} ${formData.nom}
${contexteSupplementaire ? `${contexteSupplementaire}\n` : ""}- Motivations : ${formData.motivations}
- Atouts : ${formData.atouts}
- Disponibilité : ${formData.disponibilite}

Répondez uniquement par le corps de la lettre (3 paragraphes).`,
        },
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    const contenuGenere = completion.choices[0].message?.content ?? "";

    const generatedLetter: GeneratedLetter = {
      ...formData,
      contenuGenere,
      dateGeneration: new Date().toISOString(),
    };

    return NextResponse.json(generatedLetter, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la génération des données de la lettre:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la génération de la lettre" },
      { status: 500 }
    );
  }
}
