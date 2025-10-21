import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/errors';

// GET /api/letter/[id] - Récupérer une lettre spécifique
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

    // Récupérer la lettre
    const letter = await db.letter.findUnique({
      where: { id },
    });

    if (!letter) {
      return NextResponse.json(
        { error: 'Lettre non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la lettre appartient à l'utilisateur
    if (letter.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Incrémenter le compteur de vues
    await db.letter.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    return NextResponse.json(letter);

  } catch (error) {
    console.error('Erreur get-letter:', error);
    return handleApiError(error);
  }
}

// PUT /api/letter/[id] - Mettre à jour une lettre
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

    // Vérifier que la lettre existe et appartient à l'utilisateur
    const existingLetter = await db.letter.findUnique({
      where: { id },
    });

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Lettre non trouvée' },
        { status: 404 }
      );
    }

    if (existingLetter.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Mettre à jour la lettre
    const updatedLetter = await db.letter.update({
      where: { id },
      data: {
        data: body.data || existingLetter.data,
        generatedContent: body.generatedContent || existingLetter.generatedContent,
        title: body.title !== undefined ? body.title : existingLetter.title,
        targetCompany: body.targetCompany !== undefined ? body.targetCompany : existingLetter.targetCompany,
        targetPosition: body.targetPosition !== undefined ? body.targetPosition : existingLetter.targetPosition,
        pdfUrl: body.pdfUrl !== undefined ? body.pdfUrl : existingLetter.pdfUrl,
        status: body.status || existingLetter.status,
      },
    });

    // Enregistrer dans l'historique
    await db.usageHistory.create({
      data: {
        userId: user.id,
        action: 'letter_updated',
        resourceType: 'letter',
        resourceId: id,
        metadata: {
          targetCompany: updatedLetter.targetCompany,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      letter: updatedLetter,
    });

  } catch (error) {
    console.error('Erreur update-letter:', error);
    return handleApiError(error);
  }
}

// DELETE /api/letter/[id] - Supprimer une lettre
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

    // Vérifier que la lettre existe et appartient à l'utilisateur
    const existingLetter = await db.letter.findUnique({
      where: { id },
    });

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Lettre non trouvée' },
        { status: 404 }
      );
    }

    if (existingLetter.userId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Supprimer la lettre
    await db.letter.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lettre supprimée avec succès',
    });

  } catch (error) {
    console.error('Erreur delete-letter:', error);
    return handleApiError(error);
  }
}

