import { auth, clerkClient } from '@clerk/nextjs/server';
import { PlanType } from '@/types/subscription';
import { PRICING_PLANS } from './stripe';

export async function getUserSubscription() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata;

    return {
      userId,
      plan: (metadata.plan as PlanType) || 'FREE',
      subscriptionStatus: metadata.subscriptionStatus as string,
      stripeCustomerId: metadata.stripeCustomerId as string,
      stripeSubscriptionId: metadata.stripeSubscriptionId as string,
      stripePriceId: metadata.stripePriceId as string,
      currentPeriodEnd: metadata.currentPeriodEnd 
        ? new Date(metadata.currentPeriodEnd as string)
        : null,
      cancelAtPeriodEnd: metadata.cancelAtPeriodEnd as boolean,
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

export async function checkFeatureAccess(feature: keyof typeof PRICING_PLANS.FREE.limits) {
  const subscription = await getUserSubscription();

  if (!subscription) {
    return false;
  }

  const plan = PRICING_PLANS[subscription.plan];
  const limits = plan.limits;

  return limits[feature] !== false;
}

export async function checkUsageLimit(limitType: 'cvs' | 'letters') {
  const subscription = await getUserSubscription();

  if (!subscription) {
    return { allowed: false, current: 0, limit: 0 };
  }

  const plan = PRICING_PLANS[subscription.plan];
  const limit = limitType === 'cvs' ? plan.limits.cvs : plan.limits.letters;

  // -1 = illimité
  if (limit === -1) {
    return { allowed: true, current: 0, limit: -1, unlimited: true };
  }

  // TODO: Récupérer l'usage actuel depuis la DB ou Clerk metadata
  // Pour l'instant, on suppose que c'est autorisé
  const currentUsage = 0;

  return {
    allowed: currentUsage < limit,
    current: currentUsage,
    limit,
    unlimited: false,
  };
}

export function isPlanActive(subscription: Awaited<ReturnType<typeof getUserSubscription>>) {
  if (!subscription) return false;
  
  if (subscription.plan === 'FREE') return true;
  
  const activeStatuses = ['active', 'trialing'];
  return activeStatuses.includes(subscription.subscriptionStatus);
}

export function getPlanName(plan: PlanType): string {
  return PRICING_PLANS[plan].name;
}

export function getPlanFeatures(plan: PlanType) {
  return PRICING_PLANS[plan].features;
}

export function getPlanLimits(plan: PlanType) {
  return PRICING_PLANS[plan].limits;
}
