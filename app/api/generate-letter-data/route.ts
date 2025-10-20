import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import type { LetterFormData, GeneratedLetter } from "@/types/letter";

/**
 * API endpoint pour générer uniquement les données de la lettre (JSON)
 * sans créer le PDF. Utilisé pour la prévisualisation.
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration du serveur manquante : OPENAI_API_KEY n'est pas définie" },
        { status: 500 }
      );
    }

    const formData: LetterFormData = await request.json();

    // Appel à OpenAI pour générer le contenu de la lettre
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Vous êtes un assistant expert en rédaction de lettres de motivation professionnelles.
Générez une lettre de motivation structurée en exactement 3 paragraphes distincts.

**Règles strictes :**
1. Exactement 3 paragraphes, séparés par des sauts de ligne
2. Ton professionnel mais personnel, éviter les clichés
3. Premier paragraphe : Introduction et contexte
4. Deuxième paragraphe : Motivations et adéquation avec l'entreprise
5. Troisième paragraphe : Disponibilité et ouverture à l'entretien
6. Ne pas inclure "Madame, Monsieur" au début ni la formule de politesse finale (c'est déjà dans le template)
7. Utiliser des phrases courtes et percutantes
8. Inclure les atouts personnels de manière naturelle`,
        },
        {
          role: "user",
          content: `Génère une lettre de motivation pour :
- Poste visé : ${formData.posteVise}
- Entreprise : ${formData.entreprise}
- Nom du candidat : ${formData.prenom} ${formData.nom}
- Motivations : ${formData.motivations}
- Atouts : ${formData.atouts}
- Disponibilité : ${formData.disponibilite}

Génère uniquement le corps de la lettre (3 paragraphes).`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const contenuGenere = completion.choices[0].message?.content || "";

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

