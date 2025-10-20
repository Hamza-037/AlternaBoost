import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Désactiver le parsing automatique du body pour les webhooks
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('✅ Webhook reçu:', event.type);

  try {
    switch (event.type) {
      // 🎉 Paiement réussi - Activer l'abonnement
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      // 🔄 Abonnement mis à jour
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      // ❌ Abonnement annulé
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      // 💰 Paiement récurrent réussi
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      // ⚠️ Échec de paiement
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erreur traitement webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// 🎉 Gérer la completion du checkout
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🎉 Checkout completed:', session.id);

  const { clerkClient } = await import('@clerk/nextjs/server');
  const client = await clerkClient();

  const userId = session.metadata?.clerkUserId;
  const planType = session.metadata?.planType;

  if (!userId || !planType) {
    console.error('❌ Missing userId or planType in metadata');
    return;
  }

  // Récupérer la subscription
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Mettre à jour les metadata de l'utilisateur Clerk
  try {
    const periodEnd = 'current_period_end' in subscription && typeof subscription.current_period_end === 'number'
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: subscription.items.data[0]?.price.id,
        plan: planType,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: periodEnd,
      },
    });

    console.log('✅ User metadata updated:', userId);
  } catch (error) {
    console.error('❌ Error updating user metadata:', error);
  }

  // TODO: Envoyer un email de bienvenue
  console.log('📧 Email de bienvenue à envoyer à:', userId);
}

// 🔄 Gérer la mise à jour d'abonnement
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id);

  const { clerkClient } = await import('@clerk/nextjs/server');
  const client = await clerkClient();

  const userId = subscription.metadata?.clerkUserId;

  if (!userId) {
    console.error('❌ Missing userId in subscription metadata');
    return;
  }

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        subscriptionStatus: subscription.status,
        currentPeriodEnd: 'current_period_end' in subscription && typeof subscription.current_period_end === 'number'
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
        cancelAtPeriodEnd: 'cancel_at_period_end' in subscription ? subscription.cancel_at_period_end : false,
      },
    });

    console.log('✅ Subscription updated in Clerk:', userId);
  } catch (error) {
    console.error('❌ Error updating subscription:', error);
  }
}

// ❌ Gérer l'annulation d'abonnement
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  const { clerkClient } = await import('@clerk/nextjs/server');
  const client = await clerkClient();

  const userId = subscription.metadata?.clerkUserId;

  if (!userId) {
    console.error('❌ Missing userId in subscription metadata');
    return;
  }

  try {
    // Réinitialiser au plan gratuit
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: 'FREE',
        subscriptionStatus: 'canceled',
        stripeSubscriptionId: null,
        stripePriceId: null,
      },
    });

    console.log('✅ User downgraded to FREE plan:', userId);
  } catch (error) {
    console.error('❌ Error downgrading user:', error);
  }

  // TODO: Envoyer un email de confirmation d'annulation
  console.log('📧 Email d\'annulation à envoyer à:', userId);
}

// 💰 Gérer le paiement récurrent réussi
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id);

  // Pas besoin de mettre à jour si c'est déjà fait par subscription.updated
  // Juste logger pour le suivi
  console.log('✅ Paiement récurrent réussi pour:', invoice.customer);
}

// ⚠️ Gérer l'échec de paiement
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.error('⚠️ Invoice payment failed:', invoice.id);

  const { clerkClient } = await import('@clerk/nextjs/server');
  const client = await clerkClient();

  // Récupérer la subscription pour obtenir le userId
  const subscriptionId = 'subscription' in invoice ? invoice.subscription : null;
  
  if (subscriptionId && typeof subscriptionId === 'string') {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.clerkUserId;

    if (userId) {
      try {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            subscriptionStatus: 'past_due',
          },
        });

        console.log('⚠️ User marked as past_due:', userId);
      } catch (error) {
        console.error('❌ Error marking user as past_due:', error);
      }

      // TODO: Envoyer un email d'alerte de paiement échoué
      console.log('📧 Email d\'alerte à envoyer à:', userId);
    }
  }
}
