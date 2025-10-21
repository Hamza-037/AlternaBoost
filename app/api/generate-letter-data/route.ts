import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { openai } from "@/lib/openai";
import { logger } from "@/lib/errors";
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

    // 1. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // 2. Vérifier les limites d'usage (avec fallback si DB non disponible)
    let shouldCheckLimits = true;
    let usageLimits = {
      cvs: { unlimited: false, limit: 3, current: 0, remaining: 3 },
      letters: { unlimited: false, limit: 1, current: 0, remaining: 1 }
    };

    try {
      const usageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/usage`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      });

      if (usageResponse.ok) {
        const usage = await usageResponse.json();
        if (usage && usage.usage) {
          usageLimits = usage.usage;
        } else {
          logger.warn("Format de réponse d'usage invalide, utilisation des limites par défaut", { userId });
          shouldCheckLimits = false; // Ne pas bloquer si format invalide
        }
      } else {
        logger.error("Erreur lors de la récupération de l'usage", { userId, status: usageResponse.status });
        shouldCheckLimits = false; // Ne pas bloquer si erreur API
      }
    } catch (error) {
      logger.error("Exception lors de la vérification de l'usage", { userId, error });
      shouldCheckLimits = false; // Ne pas bloquer si exception
    }

    // Vérifier si l'utilisateur a atteint sa limite (seulement si on a pu récupérer les données)
    if (shouldCheckLimits && !usageLimits.letters.unlimited && usageLimits.letters.remaining <= 0) {
      return NextResponse.json({
        error: 'Limite atteinte',
        message: `Vous avez atteint votre limite de ${usageLimits.letters.limit} lettre(s) par mois. Passez au plan supérieur pour créer plus de lettres.`,
        upgradeUrl: '/pricing',
        current: usageLimits.letters.current,
        limit: usageLimits.letters.limit,
      }, { status: 403 });
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

    // Sauvegarder automatiquement en DB si utilisateur authentifié
    const { userId } = await auth();
    let letterId: string | undefined;
    
    if (userId) {
      try {
        // Appeler l'API save-letter
        const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/save-letter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            data: formData,
            generatedContent: contenuGenere,
            title: `Lettre ${formData.entreprise}`,
            targetCompany: formData.entreprise,
            targetPosition: formData.posteVise,
          }),
        });

        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          letterId = saveResult.letter?.id;
          logger.info("Lettre sauvegardée en DB", { letterId, userId });
        }
      } catch (saveError) {
        // Ne pas bloquer si la sauvegarde échoue
        logger.error("Erreur sauvegarde lettre", { error: saveError, userId });
      }
    }

    return NextResponse.json({
      ...generatedLetter,
      id: letterId, // ID de la lettre sauvegardée
    }, { status: 200 });
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
