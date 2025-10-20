import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// ⚠️ ENDPOINT TEMPORAIRE POUR TESTER - À SUPPRIMER EN PRODUCTION
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();

    // Mettre à jour les métadonnées de l'utilisateur
    await client.users.updateUser(userId, {
      publicMetadata: {
        plan: 'STARTER', // ou PRO, PREMIUM selon votre test
        subscriptionStatus: 'trialing',
        subscriptionId: 'sub_test_123',
        customerId: 'cus_test_123',
        currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Abonnement mis à jour (mode test)' 
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
