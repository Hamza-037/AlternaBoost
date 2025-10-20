import { NextRequest, NextResponse } from "next/server";
import { ameliorerContenuCV } from "@/lib/openai";
import { cvFormSchema } from "@/lib/validations/cv-schema";
import type { GeneratedCV } from "@/types/cv";

export async function POST(request: NextRequest) {
  try {
    // Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration du serveur manquante : OPENAI_API_KEY n'est pas définie" },
        { status: 500 }
      );
    }

    // Parse et valide les données du formulaire
    const body = await request.json();
    const validatedData = cvFormSchema.parse(body);

    // Appel à OpenAI pour améliorer le contenu
    const ameliorations = await ameliorerContenuCV({
      objectif: validatedData.objectif,
      experiences: validatedData.experiences.map(exp => ({
        poste: exp.poste,
        entreprise: exp.entreprise,
        description: exp.description,
      })),
      competences: validatedData.competences,
      entrepriseCiblee: validatedData.entrepriseCiblee,
    });

    // Prépare les données complètes pour le CV
    const cvData: GeneratedCV = {
      ...validatedData,
      objectifAmeliore: ameliorations.objectifAmeliore,
      experiencesAmeliorees: ameliorations.experiencesAmeliorees,
      competencesAmeliorees: ameliorations.competencesAmeliorees,
    };

    // Retourne les données JSON
    return NextResponse.json(cvData, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la génération des données du CV:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la génération du CV" },
      { status: 500 }
    );
  }
}

