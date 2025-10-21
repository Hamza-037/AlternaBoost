import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application-schema";
import { nanoid } from "nanoid";

// GET - Récupérer toutes les candidatures de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer toutes les candidatures de l'utilisateur
    const applications = await db.application.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        appliedDate: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle candidature
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validation des données
    const validatedData = applicationSchema.parse(body);

    // Initialiser l'historique avec le statut initial
    const initialHistory = [{
      status: validatedData.status,
      date: new Date().toISOString(),
      note: "Candidature créée",
    }];

    // Créer la candidature
    const application = await db.application.create({
      data: {
        id: nanoid(),
        userId: userId,
        companyName: validatedData.companyName,
        position: validatedData.position,
        status: validatedData.status,
        appliedDate: new Date(validatedData.appliedDate),
        lastContactDate: validatedData.lastContactDate 
          ? new Date(validatedData.lastContactDate) 
          : null,
        contactPerson: validatedData.contactPerson || null,
        notes: validatedData.notes || null,
        jobUrl: validatedData.jobUrl || null,
        nextFollowUp: validatedData.nextFollowUp 
          ? new Date(validatedData.nextFollowUp) 
          : null,
        statusHistory: initialHistory as any,
        salary: validatedData.salary || null,
        location: validatedData.location || null,
        contractType: validatedData.contractType || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création de la candidature:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
