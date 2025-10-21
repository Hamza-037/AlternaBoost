import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { ameliorerContenuCV } from "@/lib/openai";
import { cvFormSchema } from "@/lib/validations/cv-schema";
import type { GeneratedCV } from "@/types/cv";
import { applyRateLimit, getClientIp, rateLimitConfigs } from "@/lib/rate-limiter";
import { 
  ValidationError, 
  OpenAIError, 
  handleApiError, 
  logger,
  ErrorMessages 
} from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      throw new OpenAIError(ErrorMessages.OPENAI.API_KEY_MISSING);
    }

    // 2. Appliquer le rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitResponse = await applyRateLimit(clientIp, rateLimitConfigs.openai);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 3. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // 4. Vérifier les limites d'usage
    const usageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/usage`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!usageResponse.ok) {
      logger.error("Erreur lors de la récupération de l'usage", { userId });
    }

    const usage = await usageResponse.json();

    // Vérifier si l'utilisateur a atteint sa limite
    if (!usage.usage.cvs.unlimited && usage.usage.cvs.remaining <= 0) {
      return NextResponse.json({
        error: 'Limite atteinte',
        message: `Vous avez atteint votre limite de ${usage.usage.cvs.limit} CV par mois. Passez au plan supérieur pour créer plus de CVs.`,
        upgradeUrl: '/pricing',
        current: usage.usage.cvs.current,
        limit: usage.usage.cvs.limit,
      }, { status: 403 });
    }

    // 5. Parser et valider les données du formulaire
    const body = await request.json();
    const validatedData = cvFormSchema.parse(body);

    // 6. Logger l'appel API
    logger.info("Génération de CV demandée", {
      ip: clientIp,
      userId,
      entrepriseCiblee: validatedData.entrepriseCiblee,
    });

    // 7. Appel à OpenAI pour améliorer le contenu
    const ameliorations = await ameliorerContenuCV({
      objectif: validatedData.objectif,
      experiences: validatedData.experiences.map(exp => ({
        poste: exp.poste,
        entreprise: exp.entreprise,
        description: exp.description,
      })),
      competences: validatedData.competences,
      entrepriseCiblee: validatedData.entrepriseCiblee,
      posteCible: validatedData.posteCible,
      descriptionPoste: validatedData.descriptionPoste,
      missionsPrioritaires: validatedData.missionsPrioritaires,
      motsClesCibles: validatedData.motsClesCibles,
      tonSouhaite: validatedData.tonSouhaite,
    });

    // 8. Préparer les données complètes pour le CV
    const cvData: GeneratedCV = {
      ...validatedData,
      objectifAmeliore: ameliorations.objectifAmeliore,
      experiencesAmeliorees: ameliorations.experiencesAmeliorees,
      competencesAmeliorees: ameliorations.competencesAmeliorees,
      pitchPersonnalise: ameliorations.pitchPersonnalise,
      recommandationsIA: ameliorations.recommandationsIA,
    };

    // 9. Sauvegarder automatiquement en DB
    let cvId: string | undefined;
    
    if (userId) {
      try {
        // Appeler l'API save-cv (désactivé si DB non configurée)
        // TODO: Réactiver quand Supabase est configuré
        // const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/save-cv`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Cookie': request.headers.get('cookie') || '',
        //   },
        //   body: JSON.stringify({
        //     data: cvData,
        //     template: cvData.template || 'modern',
        //     title: `CV ${validatedData.prenom} ${validatedData.nom}`,
        //     targetCompany: validatedData.entrepriseCiblee,
        //     targetPosition: validatedData.posteCible,
        //   }),
        // });

        // if (saveResponse.ok) {
        //   const saveResult = await saveResponse.json();
        //   cvId = saveResult.cv?.id;
        //   logger.info("CV sauvegardé en DB", { cvId, userId });
        // }
        
        logger.info("Sauvegarde DB désactivée (DB non configurée)", { userId });
      } catch (saveError) {
        // Ne pas bloquer si la sauvegarde échoue
        logger.error("Erreur sauvegarde CV", { error: saveError, userId });
      }
    }

    // 8. Logger le succès
    logger.info("CV généré avec succès", { ip: clientIp });

    // 9. Retourner les données JSON avec l'ID si sauvegardé
    return NextResponse.json({
      ...cvData,
      id: cvId, // ID du CV sauvegardé en DB
    }, { status: 200 });
  } catch (error) {
    // Gestion centralisée des erreurs
    return handleApiError(error);
  }
}


