import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
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

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    const subscription = session.subscription as any;
    if (!subscription) {
      return NextResponse.json({ error: 'Abonnement introuvable' }, { status: 404 });
    }

    const planType = session.metadata?.planType || 'STARTER';
    const client = await clerkClient();

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
      },
    });
  } catch (error: any) {
    console.error('Erreur sync:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
