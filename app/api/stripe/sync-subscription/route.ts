import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    // Récupérer la souscription
    const subscription = session.subscription as any;

    if (!subscription) {
      return NextResponse.json({ error: 'Abonnement introuvable' }, { status: 404 });
    }

    // Mettre à jour les métadonnées Clerk
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();

    const planType = session.metadata?.planType || 'STARTER';

    await client.users.updateUser(userId, {
      publicMetadata: {
        plan: planType,
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        plan: planType,
        status: subscription.status,
        trialEnd: subscription.trial_end,
        currentPeriodEnd: subscription.current_period_end,
      },
    });
  } catch (error) {
    console.error('Erreur récupération session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session' },
      { status: 500 }
    );
  }
}
