import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // 2. Trouver l'utilisateur
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // 3. Récupérer les paramètres de pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 4. Récupérer les CVs avec pagination
    const [cvs, total] = await Promise.all([
      db.cV.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          template: true,
          targetCompany: true,
          targetPosition: true,
          status: true,
          viewCount: true,
          downloadCount: true,
          createdAt: true,
          updatedAt: true,
          // Ne pas inclure 'data' qui est trop lourd
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.cV.count({
        where: { userId: user.id },
      }),
    ]);

    // 5. Retourner les résultats
    return NextResponse.json({
      cvs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });

  } catch (error) {
    console.error('Erreur get-cvs:', error);
    return handleApiError(error);
  }
}

