import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { getBaseUrlFromRequest } from '@/lib/get-base-url';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { priceId, planType } = await req.json();

    if (!priceId || !planType) {
      return NextResponse.json(
        { error: 'Prix ID ou type de plan manquant' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur Clerk pour avoir l'email
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user.emailAddresses[0]?.emailAddress) {
      return NextResponse.json(
        { error: 'Email utilisateur introuvable' },
        { status: 400 }
      );
    }

    const email = user.emailAddresses[0].emailAddress;

    // Créer ou récupérer le customer Stripe
    let customerId: string;

    // Vérifier si le customer existe déjà
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // Créer un nouveau customer
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          clerkUserId: userId,
        },
      });
      customerId = customer.id;
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7, // 7 jours d'essai gratuit
        metadata: {
          clerkUserId: userId,
          planType: planType,
        },
      },
      success_url: `${getBaseUrlFromRequest(req)}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrlFromRequest(req)}/checkout/cancel`,
      metadata: {
        clerkUserId: userId,
        planType: planType,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur création checkout session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
