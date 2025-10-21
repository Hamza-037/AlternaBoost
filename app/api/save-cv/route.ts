import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/errors';
import { z } from 'zod';

// Schéma de validation pour les données du CV
const saveCVSchema = z.object({
  data: z.any(), // Données du CV (JSON)
  template: z.string().default('modern'),
  title: z.string().optional(),
  targetCompany: z.string().optional(),
  targetPosition: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // 2. Parser et valider les données
    const body = await request.json();
    const validatedData = saveCVSchema.parse(body);

    // 3. Vérifier si l'utilisateur existe dans notre DB
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // 4. Si l'utilisateur n'existe pas, le créer
    if (!user) {
      // Récupérer les infos depuis Clerk
      const { clerkClient } = await import('@clerk/nextjs/server');
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          plan: (clerkUser.publicMetadata.plan as string) || 'FREE',
          usageResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    }

    // 5. Vérifier les limites d'usage
    const planLimits: Record<string, number> = {
      FREE: 3,
      STARTER: 15,
      PRO: -1, // illimité
      PREMIUM: -1,
    };

    const limit = planLimits[user.plan] || 3;

    // Vérifier si reset mensuel nécessaire
    if (new Date() > user.usageResetDate) {
      await db.user.update({
        where: { id: user.id },
        data: {
          cvsCreatedThisMonth: 0,
          lettersCreatedThisMonth: 0,
          usageResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
      user.cvsCreatedThisMonth = 0;
    }

    // Vérifier la limite
    if (limit !== -1 && user.cvsCreatedThisMonth >= limit) {
      return NextResponse.json(
        {
          error: 'Limite mensuelle atteinte',
          message: `Vous avez atteint votre limite de ${limit} CV par mois. Passez à un plan supérieur pour créer plus de CVs.`,
          current: user.cvsCreatedThisMonth,
          limit: limit,
        },
        { status: 429 }
      );
    }

    // 6. Sauvegarder le CV
    const cv = await db.cV.create({
      data: {
        userId: user.id,
        data: validatedData.data,
        template: validatedData.template,
        title: validatedData.title,
        targetCompany: validatedData.targetCompany,
        targetPosition: validatedData.targetPosition,
        pdfUrl: validatedData.pdfUrl,
        status: 'completed',
      },
    });

    // 7. Incrémenter le compteur d'usage
    await db.user.update({
      where: { id: user.id },
      data: {
        cvsCreatedThisMonth: { increment: 1 },
      },
    });

    // 8. Enregistrer dans l'historique
    await db.usageHistory.create({
      data: {
        userId: user.id,
        action: 'cv_created',
        resourceType: 'cv',
        resourceId: cv.id,
        metadata: {
          template: validatedData.template,
          targetCompany: validatedData.targetCompany,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    // 9. Retourner le CV créé
    return NextResponse.json({
      success: true,
      cv: {
        id: cv.id,
        createdAt: cv.createdAt,
      },
      usage: {
        current: user.cvsCreatedThisMonth + 1,
        limit: limit,
        remaining: limit === -1 ? -1 : limit - (user.cvsCreatedThisMonth + 1),
      },
    });

  } catch (error) {
    console.error('Erreur save-cv:', error);
    return handleApiError(error);
  }
}

