import { NextRequest, NextResponse } from "next/server";
import { generateCVPDF } from "@/lib/pdf/generate-pdf";
import { ameliorerContenuCV } from "@/lib/openai";
import { cvFormSchema } from "@/lib/validations/cv-schema";
import type { GeneratedCV } from "@/types/cv";
import { applyRateLimit, getClientIp, rateLimitConfigs } from "@/lib/rate-limiter";
import { 
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

    // 3. Parse et valide les données du formulaire
    const body = await request.json();
    const validatedData = cvFormSchema.parse(body);

    // 4. Appel à OpenAI pour améliorer le contenu
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

    // 5. Prépare les données complètes pour le CV
    const cvData: GeneratedCV = {
      ...validatedData,
      objectifAmeliore: ameliorations.objectifAmeliore,
      experiencesAmeliorees: ameliorations.experiencesAmeliorees,
      competencesAmeliorees: ameliorations.competencesAmeliorees,
      pitchPersonnalise: ameliorations.pitchPersonnalise,
      recommandationsIA: ameliorations.recommandationsIA,
    };

    // 6. Génère le PDF avec toutes les options de personnalisation
    const template = cvData.template || cvData.style?.template || "modern";
    const profileImageUrl = cvData.profileImageUrl;
    const style = cvData.style;
    const customSections = cvData.sectionsPersonnalisees || [];
    
    logger.info("Génération du PDF", { 
      ip: clientIp, 
      template,
      entreprise: validatedData.entrepriseCiblee 
    });
    
    const pdfBuffer = await generateCVPDF(
      cvData,
      template as "modern" | "premium" | "creative" | "minimal",
      profileImageUrl,
      style,
      customSections
    );

    // 7. Logger le succès
    logger.info("PDF généré avec succès", { ip: clientIp });

    // 8. Retourne le PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CV_${validatedData.prenom}_${validatedData.nom}.pdf"`,
      },
    });
  } catch (error) {
    // Gestion centralisée des erreurs
    return handleApiError(error);
  }
}
