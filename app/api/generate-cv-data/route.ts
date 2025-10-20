import { NextRequest, NextResponse } from "next/server";
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

    // 3. Parser et valider les données du formulaire
    const body = await request.json();
    const validatedData = cvFormSchema.parse(body);

    // 4. Logger l'appel API
    logger.info("Génération de CV demandée", {
      ip: clientIp,
      entrepriseCiblee: validatedData.entrepriseCiblee,
    });

    // 5. Appel à OpenAI pour améliorer le contenu
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

    // 6. Préparer les données complètes pour le CV
    const cvData: GeneratedCV = {
      ...validatedData,
      objectifAmeliore: ameliorations.objectifAmeliore,
      experiencesAmeliorees: ameliorations.experiencesAmeliorees,
      competencesAmeliorees: ameliorations.competencesAmeliorees,
      pitchPersonnalise: ameliorations.pitchPersonnalise,
      recommandationsIA: ameliorations.recommandationsIA,
    };

    // 7. Logger le succès
    logger.info("CV généré avec succès", { ip: clientIp });

    // 8. Retourner les données JSON
    return NextResponse.json(cvData, { status: 200 });
  } catch (error) {
    // Gestion centralisée des erreurs
    return handleApiError(error);
  }
}


