import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Plans de pricing
export const PRICING_PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    priceId: null,
    features: [
      '3 CV par mois',
      '2 templates de base',
      'Export PDF standard',
      'Génération IA basique',
      '1 lettre de motivation/mois',
    ],
    limits: {
      cvs: 3,
      letters: 1,
      templates: ['modern', 'minimal'],
      analysis: false,
      import: false,
    },
  },
  STARTER: {
    name: 'Starter',
    price: 5.99,
    priceMonthly: 5.99,
    priceYearly: 57.49, // -20%
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    features: [
      '15 CV par mois',
      '4 templates premium',
      'Export PDF haute qualité',
      'IA optimisée',
      '5 lettres de motivation/mois',
      'Analyse CV basique',
      '7 jours d\'essai gratuit',
    ],
    limits: {
      cvs: 15,
      letters: 5,
      templates: ['modern', 'minimal', 'creative', 'premium'],
      analysis: true,
      import: false,
    },
    trial: 7, // jours
  },
  PRO: {
    name: 'Pro',
    price: 10.99,
    priceMonthly: 10.99,
    priceYearly: 105.50, // -20%
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    popular: true,
    features: [
      'CV illimités',
      'Lettres illimitées',
      'Tous les templates',
      'Export PDF + DOCX',
      'Analyse CV complète + Score ATS',
      'Import CV automatique',
      'Support prioritaire',
      'Sans publicité',
      '7 jours d\'essai gratuit',
    ],
    limits: {
      cvs: -1, // illimité
      letters: -1, // illimité
      templates: ['modern', 'minimal', 'creative', 'premium'],
      analysis: true,
      import: true,
    },
    trial: 7,
  },
  PREMIUM: {
    name: 'Premium',
    price: 17.99,
    priceMonthly: 17.99,
    priceYearly: 172.70, // -20%
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Tout du Plan Pro',
      'Accès anticipé aux nouveautés',
      'Templates personnalisés',
      'Consultation 1-1 mensuelle',
      'API access',
      'Sans logo AlternaBoost',
      '7 jours d\'essai gratuit',
    ],
    limits: {
      cvs: -1,
      letters: -1,
      templates: ['modern', 'minimal', 'creative', 'premium'],
      analysis: true,
      import: true,
      whiteLabel: true,
      api: true,
    },
    trial: 7,
  },
} as const;

export type PlanType = keyof typeof PRICING_PLANS;
