export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete';

export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';

export interface UserSubscription {
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  plan: PlanType;
  status: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
}

export interface UsageLimits {
  cvsCreatedThisMonth: number;
  lettersCreatedThisMonth: number;
  analysisUsedThisMonth: number;
  lastResetDate: Date;
}

export interface CheckoutSessionData {
  userId: string;
  email: string;
  priceId: string;
  planType: PlanType;
}
