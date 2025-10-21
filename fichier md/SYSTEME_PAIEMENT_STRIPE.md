# 💳 Système de Paiement Stripe - État et À Faire

## ✅ CE QUI EST DÉJÀ FAIT

### 🔧 Configuration de base

#### 1. **Intégration Stripe** (100% ✅)
- ✅ SDK Stripe installé et configuré (`lib/stripe.ts`)
- ✅ API Version : `2025-09-30.clover`
- ✅ Variables d'environnement configurées
- ✅ Type-safe avec TypeScript

#### 2. **Plans de pricing définis** (100% ✅)

**FREE (Gratuit)**
- Prix : 0€/mois
- 3 CVs/mois, 1 lettre/mois
- 2 templates de base
- IA basique

**STARTER**
- Prix : 5,99€/mois (57,49€/an)
- 15 CVs/mois, 5 lettres/mois
- 4 templates premium
- Analyse CV basique
- **7 jours d'essai gratuit** ✅

**PRO** (Populaire)
- Prix : 10,99€/mois (105,50€/an)
- CVs et lettres **illimités**
- Tous les templates
- Export PDF + DOCX
- Analyse complète + Score ATS
- Import CV automatique
- **7 jours d'essai gratuit** ✅

**PREMIUM**
- Prix : 17,99€/mois (172,70€/an)
- Tout du Pro +
- Accès anticipé aux nouveautés
- Templates personnalisés
- Consultation 1-1 mensuelle
- API access
- **7 jours d'essai gratuit** ✅

---

### 🛠️ APIs Stripe Fonctionnelles

#### 1. **Checkout Session** (100% ✅)
**Fichier :** `app/api/stripe/create-checkout-session/route.ts`

✅ Fonctionnalités :
- Authentification Clerk
- Création/Récupération du customer Stripe
- Session de checkout avec :
  - Mode subscription
  - 7 jours d'essai gratuit automatique
  - Codes promo activés (`allow_promotion_codes: true`)
  - Collection d'adresse de facturation
  - Métadonnées (userId, planType)
- URLs de redirection (success/cancel)

**Flux :**
```
User clique "S'abonner" 
  → Vérification auth Clerk
  → Création customer Stripe
  → Création session checkout
  → Redirection vers Stripe Checkout
  → Paiement
  → Redirection vers /checkout/success
```

#### 2. **Webhooks Stripe** (100% ✅)
**Fichier :** `app/api/stripe/webhook/route.ts`

✅ Événements gérés :
- `checkout.session.completed` - Paiement initial réussi
- `customer.subscription.updated` - Mise à jour abonnement
- `customer.subscription.deleted` - Annulation
- `invoice.payment_succeeded` - Paiement récurrent réussi
- `invoice.payment_failed` - Échec de paiement

✅ Actions automatiques :
- Mise à jour des metadata Clerk
- Changement de plan utilisateur
- Logs détaillés
- Gestion des erreurs

#### 3. **Pages de confirmation** (100% ✅)
- ✅ `app/checkout/success/page.tsx` - Page après paiement réussi
- ✅ `app/checkout/cancel/page.tsx` - Page si annulation

#### 4. **Page Pricing** (100% ✅)
**Fichier :** `app/pricing/page.tsx`

✅ Fonctionnalités :
- Affichage des 4 plans
- Switch Mensuel/Annuel
- Économie de 20% sur l'annuel
- Prix TTC affichés
- Badge "POPULAIRE" sur Pro
- Bouton "S'abonner" fonctionnel
- Vérification auth avant paiement
- Toast notifications
- Loading states

---

## ⚠️ CE QUI MANQUE / À FAIRE

### 🔴 **CRITIQUE - À faire IMMÉDIATEMENT**

#### 1. **Configurer les Price IDs Stripe** ⚠️ BLOQUANT

**Problème actuel :**
Les variables d'environnement pour les Price IDs ne sont pas configurées :
```env
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=
```

**Actions requises :**

**Étape 1 : Créer les produits dans Stripe Dashboard**
1. Aller sur https://dashboard.stripe.com/products
2. Créer 3 produits :
   - **Starter** : 5,99€/mois
   - **Pro** : 10,99€/mois
   - **Premium** : 17,99€/mois

**Étape 2 : Créer les prix (mensuel + annuel)**
Pour chaque produit, créer 2 prix :
- **Mensuel** : 5,99€, 10,99€, 17,99€
- **Annuel** : 57,49€, 105,50€, 172,70€

**Étape 3 : Configurer l'essai gratuit**
- Cocher "Ajouter un essai gratuit"
- Durée : **7 jours**
- Sur tous les plans payants

**Étape 4 : Copier les Price IDs**
Format : `price_xxxxxxxxxxxxx`

**Étape 5 : Mettre à jour `.env`**
```env
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxxxSTARTERxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxPROxxxx
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_xxxxPREMIUMxxxx
```

---

#### 2. **Configurer le Webhook Stripe** ⚠️ BLOQUANT

**Problème actuel :**
Le webhook n'est pas configuré dans Stripe Dashboard.

**Actions requises :**

**Étape 1 : Mode développement (local)**
```bash
# Installer Stripe CLI
npm install -g stripe

# Se connecter
stripe login

# Lancer le webhook en local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
→ Copier le `webhook signing secret` (commence par `whsec_`)

**Étape 2 : Ajouter à `.env.local`**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

**Étape 3 : Mode production (après déploiement)**
1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer "Ajouter un endpoint"
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Événements à sélectionner :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copier le `webhook signing secret`
6. Ajouter à `.env` sur Vercel

---

#### 3. **Synchronisation Base de Données** ⚠️ IMPORTANTE

**Problème actuel :**
Les abonnements sont stockés uniquement dans Clerk metadata, pas dans la base de données Supabase.

**Actions requises :**

**Modifier le webhook** pour sauvegarder dans Supabase :
```typescript
// Dans app/api/stripe/webhook/route.ts
import { db } from '@/lib/db';

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // ... code existant pour Clerk ...

  // AJOUTER : Sauvegarder dans Supabase
  await db.user.upsert({
    where: { clerkUserId: userId },
    update: {
      plan: planType,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscription.items.data[0]?.price.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      // ... créer si n'existe pas
    },
  });
}
```

---

### 🟡 **IMPORTANT - Phase 2**

#### 4. **Gestion d'abonnement utilisateur** (0% ❌)

**Pages manquantes :**

**a) Page "Mon abonnement"**
- Fichier : `app/dashboard/subscription/page.tsx`
- Contenu :
  - Plan actuel
  - Date de renouvellement
  - Méthode de paiement
  - Historique des factures
  - Bouton "Changer de plan"
  - Bouton "Annuler l'abonnement"

**b) API de gestion**
- `app/api/stripe/portal/route.ts` - Redirection vers Customer Portal Stripe
- `app/api/stripe/change-plan/route.ts` - Changement de plan
- `app/api/stripe/cancel/route.ts` - Annulation

**Code exemple :**
```typescript
// app/api/stripe/portal/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Récupérer le customer Stripe
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'No subscription' }, { status: 404 });
  }

  // Créer une session Customer Portal
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

#### 5. **Emails transactionnels** (0% ❌)

**À implémenter :**
- ✅ Webhook logs incluent déjà les TODOs
- ❌ Service email non configuré

**Options :**
1. **Resend** (recommandé pour Next.js)
2. **SendGrid**
3. **AWS SES**

**Emails à envoyer :**
- 📧 Bienvenue après souscription
- 📧 Confirmation d'annulation
- 📧 Échec de paiement
- 📧 Fin d'essai gratuit (J-1)
- 📧 Renouvellement réussi
- 📧 Factures

**Code exemple avec Resend :**
```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, planName: string) {
  await resend.emails.send({
    from: 'AlternaBoost <noreply@alternaboost.com>',
    to: email,
    subject: `Bienvenue sur AlternaBoost ${planName} !`,
    html: `<h1>Merci de votre confiance !</h1>...`,
  });
}
```

---

#### 6. **Limites par plan (Enforcement)** (50% ⚠️)

**Actuellement :**
- ✅ Limites définies dans `lib/stripe.ts`
- ❌ Pas de vérification dans les APIs

**À faire :**
Vérifier les limites dans chaque API :

```typescript
// app/api/generate-cv/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  
  // AJOUTER : Vérifier les limites
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const plan = PRICING_PLANS[user.plan];
  
  if (plan.limits.cvs !== -1 && user.cvsCreatedThisMonth >= plan.limits.cvs) {
    return NextResponse.json(
      { error: 'Limite mensuelle atteinte. Passez au plan supérieur !' },
      { status: 403 }
    );
  }

  // ... continuer la génération
}
```

**APIs à protéger :**
- ❌ `/api/generate-cv`
- ❌ `/api/generate-letter`
- ❌ `/api/analyze-cv` (si plan n'a pas l'analyse)
- ❌ Export DOCX (réservé PRO+)

---

#### 7. **Customer Portal Stripe** (0% ❌)

**Activer dans Stripe Dashboard :**
1. Aller sur https://dashboard.stripe.com/settings/billing/portal
2. Activer le Customer Portal
3. Configurer :
   - ✅ Annulation d'abonnement
   - ✅ Mise à jour méthode de paiement
   - ✅ Voir factures
   - ✅ Changer de plan (upgrade/downgrade)

**Intégrer dans le Dashboard :**
```typescript
// components/dashboard/ManageSubscriptionButton.tsx
export function ManageSubscriptionButton() {
  const handleManage = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <Button onClick={handleManage}>
      Gérer mon abonnement
    </Button>
  );
}
```

---

### 🟢 **NICE-TO-HAVE - Phase 3**

#### 8. **Statistiques de paiement** (0% ❌)

**Dashboard admin :**
- MRR (Monthly Recurring Revenue)
- Taux de conversion
- Churn rate
- Plans les plus populaires
- Graphiques d'évolution

#### 9. **Codes promo personnalisés** (50% ⚠️)
- ✅ Déjà activé dans checkout (`allow_promotion_codes: true`)
- ❌ Interface pour créer des codes
- Créer dans Stripe Dashboard manuellement

**Exemples de codes :**
- `STUDENT20` : -20% pendant 3 mois
- `LAUNCH50` : -50% le premier mois
- `ANNUAL20` : -20% sur plan annuel

#### 10. **Facturation et comptabilité** (0% ❌)
- Export des factures en CSV
- Réconciliation comptable
- TVA européenne (si international)

#### 11. **Upsell/Cross-sell** (0% ❌)
- Popup "Passez au Pro" quand limite atteinte
- Comparateur de plans dans le Dashboard
- Notifications "Économisez avec l'annuel"

#### 12. **Analytics de conversion** (0% ❌)
- Tracking des clics sur "S'abonner"
- Taux d'abandon du checkout
- A/B testing des prix

---

## 📋 CHECKLIST AVANT MISE EN PRODUCTION

### Phase 1 : Configuration de base ⚠️
- [ ] Créer les produits dans Stripe Dashboard
- [ ] Créer les prix (mensuel + annuel)
- [ ] Copier les Price IDs dans `.env`
- [ ] Configurer le webhook (dev + prod)
- [ ] Tester un paiement en mode test
- [ ] Vérifier que le webhook reçoit les événements

### Phase 2 : Synchronisation DB
- [ ] Modifier le webhook pour sauvegarder dans Supabase
- [ ] Tester la création d'abonnement → DB
- [ ] Tester l'annulation → DB
- [ ] Tester l'échec de paiement → DB

### Phase 3 : Pages utilisateur
- [ ] Créer la page "Mon abonnement"
- [ ] Activer le Customer Portal Stripe
- [ ] Ajouter bouton "Gérer" dans le Dashboard
- [ ] Tester le changement de plan
- [ ] Tester l'annulation

### Phase 4 : Limites et enforcement
- [ ] Vérifier limites dans `/api/generate-cv`
- [ ] Vérifier limites dans `/api/generate-letter`
- [ ] Bloquer features premium si FREE
- [ ] Afficher popups d'upgrade

### Phase 5 : Emails
- [ ] Configurer Resend
- [ ] Email de bienvenue
- [ ] Email d'annulation
- [ ] Email échec de paiement
- [ ] Tester tous les emails

### Phase 6 : Tests de bout en bout
- [ ] Inscription → Essai 7j → Paiement → Annulation
- [ ] Changement de plan (upgrade)
- [ ] Changement de plan (downgrade)
- [ ] Renouvellement automatique
- [ ] Échec de paiement

---

## 🎯 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

### Semaine 1 : Configuration de base (CRITIQUE)
**Jour 1-2 :**
1. Créer produits et prix dans Stripe Dashboard (1h)
2. Configurer webhook en dev (30min)
3. Tester un paiement test (30min)

**Jour 3-4 :**
4. Modifier webhook pour sauvegarder dans Supabase (2h)
5. Tester synchronisation complète (1h)

**Jour 5 :**
6. Ajouter vérification des limites dans les APIs (3h)
7. Tests complets (2h)

### Semaine 2 : Interface utilisateur
8. Page "Mon abonnement" (4h)
9. Customer Portal (2h)
10. Emails transactionnels (4h)

### Semaine 3 : Optimisations
11. Analytics de paiement (4h)
12. Upsell/Cross-sell (4h)
13. Tests utilisateurs réels (4h)

---

## 💰 COÛTS STRIPE

**Frais Stripe France :**
- **1,4% + 0,25€** par transaction européenne
- Pas de frais mensuels
- Paiements récurrents : mêmes frais

**Exemple :**
- Abonnement Pro à 10,99€
- Frais : (10,99 × 1,4%) + 0,25€ = **0,40€**
- Vous recevez : **10,59€**

---

## 🔗 RESSOURCES UTILES

**Documentation Stripe :**
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Trial Periods](https://stripe.com/docs/billing/subscriptions/trials)

**Outils :**
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

---

## ✅ RÉSUMÉ POUR VOUS

### ✅ **Déjà fait (80%)** :
- Intégration Stripe complète
- APIs checkout et webhooks
- Page pricing fonctionnelle
- 4 plans configurés
- Essai gratuit 7 jours
- Codes promo activés
- Gestion événements Stripe

### ⚠️ **À faire immédiatement (BLOQUANT)** :
1. **Créer les produits/prix dans Stripe Dashboard** (1h)
2. **Configurer le webhook** (30min)
3. **Tester un paiement** (30min)

### 🔜 **À faire ensuite** :
4. Synchronisation avec Supabase (2h)
5. Page "Mon abonnement" (4h)
6. Vérification des limites (3h)
7. Emails transactionnels (4h)

**TEMPS TOTAL ESTIMÉ : 15-20 heures**

---

**Question : Voulez-vous que je vous guide pas à pas pour créer les produits dans Stripe Dashboard maintenant ?** 🚀

