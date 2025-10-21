import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application-schema";
import type { StatusHistory } from "@/types/application";

// GET - Récupérer une candidature spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const application = await db.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que la candidature appartient bien à l'utilisateur
    if (application.userId !== userId) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Erreur lors de la récupération de la candidature:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une candidature
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validation des données
    const validatedData = applicationSchema.parse(body);

    // Vérifier que la candidature existe et appartient à l'utilisateur
    const existingApplication = await db.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }

    if (existingApplication.userId !== userId) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    // Gérer l'historique des statuts
    let updatedHistory = (existingApplication.statusHistory as StatusHistory[] | null) || [];
    
    // Si le statut a changé, ajouter une entrée dans l'historique
    if (existingApplication.status !== validatedData.status) {
      const newHistoryEntry: StatusHistory = {
        status: validatedData.status,
        date: new Date().toISOString(),
        note: `Changement de statut: ${existingApplication.status} → ${validatedData.status}`,
      };
      updatedHistory = [...updatedHistory, newHistoryEntry];
    }

    // Mettre à jour la candidature
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
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
        statusHistory: updatedHistory as any,
        salary: validatedData.salary || null,
        location: validatedData.location || null,
        contractType: validatedData.contractType || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de la candidature:", error);

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

// DELETE - Supprimer une candidature
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier que la candidature existe et appartient à l'utilisateur
    const existingApplication = await db.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }

    if (existingApplication.userId !== userId) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    // Supprimer la candidature
    await db.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Candidature supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la candidature:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
