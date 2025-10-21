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
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // 3. Si l'utilisateur n'existe pas, le créer
    if (!user) {
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

    // 4. Vérifier si reset mensuel nécessaire
    if (new Date() > user.usageResetDate) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          cvsCreatedThisMonth: 0,
          lettersCreatedThisMonth: 0,
          usageResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    }

    // 5. Définir les limites par plan
    const planLimits: Record<string, { cvs: number; letters: number }> = {
      FREE: { cvs: 3, letters: 1 },
      STARTER: { cvs: 15, letters: 5 },
      PRO: { cvs: -1, letters: -1 },
      PREMIUM: { cvs: -1, letters: -1 },
    };

    const limits = planLimits[user.plan] || planLimits.FREE;

    // 6. Retourner l'usage
    return NextResponse.json({
      plan: user.plan,
      usage: {
        cvs: {
          current: user.cvsCreatedThisMonth,
          limit: limits.cvs,
          remaining: limits.cvs === -1 ? -1 : Math.max(0, limits.cvs - user.cvsCreatedThisMonth),
          unlimited: limits.cvs === -1,
        },
        letters: {
          current: user.lettersCreatedThisMonth,
          limit: limits.letters,
          remaining: limits.letters === -1 ? -1 : Math.max(0, limits.letters - user.lettersCreatedThisMonth),
          unlimited: limits.letters === -1,
        },
      },
      resetDate: user.usageResetDate,
    });

  } catch (error) {
    console.error('Erreur get-usage:', error);
    return handleApiError(error);
  }
}

