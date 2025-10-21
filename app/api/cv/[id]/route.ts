import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/errors';

// GET /api/cv/[id] - Récupérer un CV spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Trouver l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer le CV
    const cv = await db.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le CV appartient à l'utilisateur
    if (cv.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Incrémenter le compteur de vues
    await db.cV.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
    });

    return NextResponse.json(cv);

  } catch (error) {
    console.error('Erreur get-cv:', error);
    return handleApiError(error);
  }
}

// PUT /api/cv/[id] - Mettre à jour un CV
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Trouver l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le CV existe et appartient à l'utilisateur
    const existingCV = await db.cV.findUnique({
      where: { id },
    });

    if (!existingCV) {
      return NextResponse.json(
        { error: 'CV non trouvé' },
        { status: 404 }
      );
    }

    if (existingCV.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Mettre à jour le CV
    const updatedCV = await db.cV.update({
      where: { id },
      data: {
        data: body.data || existingCV.data,
        template: body.template || existingCV.template,
        title: body.title !== undefined ? body.title : existingCV.title,
        targetCompany: body.targetCompany !== undefined ? body.targetCompany : existingCV.targetCompany,
        targetPosition: body.targetPosition !== undefined ? body.targetPosition : existingCV.targetPosition,
        pdfUrl: body.pdfUrl !== undefined ? body.pdfUrl : existingCV.pdfUrl,
        status: body.status || existingCV.status,
      },
    });

    // Enregistrer dans l'historique
    await db.usageHistory.create({
      data: {
        userId: user.id,
        action: 'cv_updated',
        resourceType: 'cv',
        resourceId: id,
        metadata: {
          template: updatedCV.template,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      cv: updatedCV,
    });

  } catch (error) {
    console.error('Erreur update-cv:', error);
    return handleApiError(error);
  }
}

// DELETE /api/cv/[id] - Supprimer un CV
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Trouver l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le CV existe et appartient à l'utilisateur
    const existingCV = await db.cV.findUnique({
      where: { id },
    });

    if (!existingCV) {
      return NextResponse.json(
        { error: 'CV non trouvé' },
        { status: 404 }
      );
    }

    if (existingCV.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Supprimer le CV (CASCADE supprimera aussi les entrées dans UsageHistory)
    await db.cV.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'CV supprimé avec succès',
    });

  } catch (error) {
    console.error('Erreur delete-cv:', error);
    return handleApiError(error);
  }
}

