<!-- 67055794-826b-47a1-a030-642228663e4a 8e974f03-7841-4034-b4de-4ffc9993f40d -->
# Roadmap Lancement Beta - AlternaBoost

## Vue d'ensemble

Préparer AlternaBoost pour un lancement bêta fonctionnel avec vrais utilisateurs. Priorité sur les fonctionnalités essentielles, la stabilité, et la conformité légale basique.

---

## PHASE 1 - CRITIQUE (Bloquants pour lancement) - 2-3 jours

### 1.1 Configuration Stripe Production (PRIORITE ABSOLUE)

**Problème actuel :** Les Price IDs Stripe ne sont pas configurés, les paiements ne fonctionnent pas.

**Actions :**

- Créer 3 produits dans Stripe Dashboard (Starter, Pro, Premium)
- Pour chaque produit : créer prix mensuel + annuel avec essai 7 jours
- Copier les Price IDs dans `.env` :
  - `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
  - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
  - `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID`
- Configurer webhook Stripe en dev : `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Copier `STRIPE_WEBHOOK_SECRET` dans `.env.local`
- Tester un paiement complet en mode test

**Fichiers concernés :** `.env`, Stripe Dashboard

**Temps estimé :** 2h

---

### 1.2 Application des Limites par Plan (CRITIQUE)

**Problème actuel :** Les limites sont définies mais pas appliquées. Users FREE peuvent créer illimité de CVs/lettres.

**Actions :**

**a) Ajouter vérification dans `/api/generate-cv-data/route.ts` :**

```typescript
// Après validation des données (ligne 31)
const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
}

// Vérifier les limites via l'API usage
const usageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/usage`, {
  headers: { Cookie: request.headers.get('cookie') || '' }
});
const usage = await usageResponse.json();

if (!usage.usage.cvs.unlimited && usage.usage.cvs.remaining <= 0) {
  return NextResponse.json({
    error: 'Limite atteinte',
    message: `Vous avez atteint votre limite de ${usage.usage.cvs.limit} CV par mois. Passez au plan supérieur.`,
    upgradeUrl: '/pricing'
  }, { status: 403 });
}
```

**b) Même logique dans `/api/generate-letter-data/route.ts`**

**c) Ajouter popup d'upgrade dans le frontend :**

- Créer `components/upgrade/UpgradeModal.tsx`
- Afficher quand erreur 403 reçue
- Bouton CTA vers `/pricing`

**Fichiers concernés :**

- `app/api/generate-cv-data/route.ts`
- `app/api/generate-letter-data/route.ts`
- `components/upgrade/UpgradeModal.tsx` (nouveau)

**Temps estimé :** 3h

---

### 1.3 Synchronisation Stripe → Supabase

**Problème actuel :** Abonnements stockés uniquement dans Clerk metadata, pas dans Supabase.

**Actions :**

**Modifier `/app/api/stripe/webhook/route.ts` :**

Dans `handleCheckoutSessionCompleted` (après ligne 126) :

```typescript
// Après mise à jour Clerk
// Synchroniser avec Supabase
const { db } = await import('@/lib/db');
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
    clerkUserId: userId,
    email: session.customer_email || '',
    plan: planType,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscriptionId,
    stripePriceId: subscription.items.data[0]?.price.id,
    subscriptionStatus: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  }
});
```

Répéter pour `handleSubscriptionUpdated` et `handleSubscriptionDeleted`.

**Fichiers concernés :** `app/api/stripe/webhook/route.ts`

**Temps estimé :** 1h30

---

### 1.4 Pages Légales Basiques (RGPD obligatoire)

**Actions :**

**a) Créer `app/legal/mentions/page.tsx` :**

```typescript
export default function MentionsPage() {
  return (
    <>
      <HeaderV2 />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1>Mentions Légales</h1>
        <h2>Éditeur du site</h2>
        <p>AlternaBoost<br/>
        [Votre adresse]<br/>
        Email : contact@alternaboost.com</p>
        
        <h2>Hébergement</h2>
        <p>Vercel Inc.<br/>
        340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
        
        <h2>Directeur de publication</h2>
        <p>[Votre nom]</p>
      </div>
      <Footer />
    </>
  );
}
```

**b) Créer `app/legal/privacy/page.tsx` :**

Template basique couvrant :

- Collecte de données (email, CVs créés)
- Utilisation OpenAI (anonymisé)
- Cookies (Clerk auth)
- Droits RGPD (accès, suppression)
- Contact DPO

**c) Créer `app/legal/terms/page.tsx` :**

Template CGU couvrant :

- Service fourni (génération IA)
- Propriété intellectuelle
- Limitations de responsabilité
- Résiliation
- Loi applicable

**Fichiers concernés :**

- `app/legal/mentions/page.tsx` (nouveau)
- `app/legal/privacy/page.tsx` (nouveau)
- `app/legal/terms/page.tsx` (nouveau)

**Temps estimé :** 2h (avec templates pré-remplis)

---

### 1.5 Test Complet Module Candidatures

**Actions :**

- Accéder à `/dashboard/applications`
- Créer 3 candidatures test
- Modifier une candidature
- Supprimer une candidature
- Tester la recherche
- Vérifier que tout se sauvegarde dans Supabase

**Si erreurs de connexion DB :**

- Vérifier `.env` : port 5432 pour `DIRECT_URL`
- Tester connexion : `npx prisma studio`

**Temps estimé :** 30min

---

## PHASE 2 - HAUTE PRIORITE (MVP complet) - 3-4 jours

### 2.1 Pages "Mes Documents" (CRUD)

**Problème actuel :** Users ne peuvent pas voir/gérer leurs CVs et lettres créés.

**Actions :**

**a) Page Mes CVs (`app/my-cvs/page.tsx`) :**

- Fetch depuis `/api/user/cvs`
- Afficher en cards avec : titre, date, entreprise ciblée, template
- Actions : Voir (preview), Modifier (edit), Télécharger (PDF), Supprimer
- Design cohérent avec `/dashboard/applications`
- Empty state si aucun CV

**b) Page Mes Lettres (`app/my-letters/page.tsx`) :**

- Même structure que Mes CVs
- Fetch depuis `/api/user/letters`

**APIs déjà existantes :**

- `GET /api/user/cvs` ✓
- `GET /api/user/letters` ✓

**Fichiers concernés :**

- `app/my-cvs/page.tsx` (nouveau)
- `app/my-letters/page.tsx` (nouveau)

**Temps estimé :** 4h

---

### 2.2 Édition de Documents Existants

**Problème actuel :** Impossible de modifier un CV/lettre après création.

**Actions :**

**a) Pages d'édition (`app/edit-cv/[id]/page.tsx` et `app/edit-letter/[id]/page.tsx`) :**

- Fetch document via `/api/cv/[id]` ou `/api/letter/[id]`
- Pré-remplir le formulaire avec données existantes
- Bouton "Sauvegarder les modifications" → PUT request
- Redirection vers "Mes CVs/Lettres" après sauvegarde

**APIs déjà existantes :**

- `GET /api/cv/[id]` ✓
- `PUT /api/cv/[id]` ✓
- `GET /api/letter/[id]` (à vérifier)
- `PUT /api/letter/[id]` (à vérifier)

**Si APIs lettres manquantes, créer `app/api/letter/[id]/route.ts` :**

```typescript
export async function GET(req, { params }) {
  const { userId } = await auth();
  const { id } = params;
  
  const letter = await db.letter.findFirst({
    where: { id, userId: (await db.user.findUnique({ where: { clerkUserId: userId }}))?.id }
  });
  
  return NextResponse.json(letter);
}

export async function PUT(req, { params }) {
  // Logique similaire à cv/[id]
}
```

**Fichiers concernés :**

- `app/edit-cv/[id]/page.tsx` (existe déjà, à compléter)
- `app/edit-letter/[id]/page.tsx` (existe déjà, à compléter)
- `app/api/letter/[id]/route.ts` (nouveau si manquant)

**Temps estimé :** 4h

---

### 2.3 Page "Mon Abonnement" (Gestion)

**Problème actuel :** Users ne peuvent pas gérer leur abonnement.

**Actions :**

**a) Créer `app/dashboard/subscription/page.tsx` :**

- Afficher plan actuel, statut, date de renouvellement
- Bouton "Gérer mon abonnement" → ouvre Customer Portal Stripe
- Afficher les limites d'usage actuelles (CVs, lettres)
- Historique des factures (via Stripe)

**b) Créer `app/api/stripe/portal/route.ts` :**

```typescript
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { stripeCustomerId: true }
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
  });

  return NextResponse.json({ url: session.url });
}
```

**c) Activer Customer Portal dans Stripe Dashboard :**

- Settings → Billing → Customer Portal
- Activer : annulation, changement de carte, téléchargement factures

**Fichiers concernés :**

- `app/dashboard/subscription/page.tsx` (nouveau)
- `app/api/stripe/portal/route.ts` (nouveau)

**Temps estimé :** 3h

---

### 2.4 Amélioration Page Exemples

**Problème actuel :** 30 exemples fictifs, peu crédibles.

**Actions :**

- Réduire à 8-10 exemples réels et variés
- Secteurs : Tech, Marketing, Commerce, Design, Finance, RH
- Ajouter vrais screenshots de CVs (anonymisés)
- Filtres par secteur et niveau (junior/confirmé/senior)

**Fichiers concernés :** `app/exemples/page.tsx`

**Temps estimé :** 2h

---

## PHASE 3 - STABILITE & POLISH (Pré-lancement) - 2 jours

### 3.1 Tests de Bout en Bout

**Scénarios à tester :**

1. **Parcours Inscription → Création CV → Téléchargement**
2. **Parcours Gratuit → Limite atteinte → Upgrade → Paiement → Illimité**
3. **Création lettre → Sauvegarde → Modification → Suppression**
4. **Ajout candidature → Modification statut → Suppression**
5. **Annulation d'abonnement → Retour au plan FREE**

**Checklist :**

- [ ] Tous les formulaires soumettent correctement
- [ ] PDFs se génèrent sans erreur
- [ ] Limites par plan appliquées
- [ ] Webhooks Stripe reçus et traités
- [ ] DB synchronisée partout
- [ ] Pas d'erreurs console

**Temps estimé :** 3h

---

### 3.2 Gestion d'Erreurs & UX

**Actions :**

**a) Messages d'erreur utilisateur :**

- Remplacer erreurs techniques par messages clairs
- Exemples :
  - "Erreur OpenAI" → "Génération temporairement indisponible, réessayez"
  - "403" → "Limite atteinte, passez au plan supérieur"
  - "500" → "Erreur serveur, notre équipe a été notifiée"

**b) Loading states partout :**

- Spinners sur boutons pendant génération
- Skeletons pendant chargement de listes
- Progress bars pour génération CV

**c) Toasts de confirmation :**

- "CV créé avec succès !"
- "Abonnement activé"
- "Candidature supprimée"

**Fichiers concernés :** Tous les composants avec fetch/submit

**Temps estimé :** 2h

---

### 3.3 SEO Basique

**Actions :**

**a) Mettre à jour `app/layout.tsx` avec metadata :**

```typescript
export const metadata: Metadata = {
  title: 'AlternaBoost - Générateur de CV et Lettres IA pour Alternance',
  description: 'Créez des CVs et lettres de motivation optimisés par IA. Templates pro, génération instantanée, export PDF. Gratuit pour commencer.',
  keywords: ['cv', 'lettre motivation', 'alternance', 'ia', 'générateur cv'],
  openGraph: {
    title: 'AlternaBoost - CV IA pour Alternance',
    description: 'Générateur de CV propulsé par IA',
    images: ['/og-image.png'],
  }
};
```

**b) Créer `public/robots.txt` :**

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api
Sitemap: https://alternaboost.com/sitemap.xml
```

**c) Créer `app/sitemap.ts` :**

```typescript
export default function sitemap() {
  return [
    { url: 'https://alternaboost.com', lastModified: new Date() },
    { url: 'https://alternaboost.com/pricing', lastModified: new Date() },
    { url: 'https://alternaboost.com/exemples', lastModified: new Date() },
  ];
}
```

**Fichiers concernés :**

- `app/layout.tsx`
- `public/robots.txt` (nouveau)
- `app/sitemap.ts` (nouveau)

**Temps estimé :** 1h

---

### 3.4 Analytics & Monitoring

**Actions :**

**a) Ajouter Google Analytics (optionnel mais recommandé) :**

- Créer compte GA4
- Ajouter `NEXT_PUBLIC_GA_ID` dans `.env`
- Installer `@next/third-parties/google`

**b) Monitoring d'erreurs avec Sentry (recommandé) :**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**c) Logger les événements importants :**

- CV créé (plan, template)
- Lettre créée
- Upgrade vers plan payant
- Annulation d'abonnement

**Temps estimé :** 2h

---

## PHASE 4 - DEPLOIEMENT (J-1 avant lancement) - 1 jour

### 4.1 Configuration Vercel Production

**Actions :**

**a) Variables d'environnement sur Vercel :**

```
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://alternaboost.com
```

**b) Configurer webhook Stripe production :**

- Stripe Dashboard → Webhooks
- Ajouter endpoint : `https://alternaboost.com/api/stripe/webhook`
- Sélectionner événements (checkout.session.completed, etc.)
- Copier webhook secret → Vercel env vars

**c) Configurer domaine personnalisé sur Vercel**

**d) Activer Stripe en mode Live (désactiver Test mode)**

**Temps estimé :** 2h

---

### 4.2 Tests en Production

**Checklist :**

- [ ] Site accessible sur domaine principal
- [ ] Inscription/connexion Clerk fonctionne
- [ ] Génération CV fonctionne (OpenAI connecté)
- [ ] Paiement Stripe fonctionne (TEST avec carte test d'abord)
- [ ] Webhooks reçus (vérifier logs Stripe)
- [ ] DB synchronisée
- [ ] Aucune erreur dans Vercel logs

**Temps estimé :** 2h

---

### 4.3 Backup & Sécurité

**Actions :**

**a) Backup Supabase :**

- Activer backups automatiques (Supabase Dashboard → Database → Backups)
- Daily backups recommandé

**b) Rate limiting en production :**

- Vérifier que rate limits sont actifs
- Considérer Redis si traffic élevé (Upstash gratuit)

**c) HTTPS & CORS :**

- Vérifier que tout est en HTTPS
- Pas d'erreurs CORS

**Temps estimé :** 1h

---

## PHASE 5 - AMELIORATIONS POST-LANCEMENT (Nice-to-have)

### 5.1 Module Candidatures Avancé

- Filtres par statut (dropdown)
- Tri par colonnes (date, entreprise, statut)
- Export CSV
- Statistiques : % par statut, temps moyen de réponse
- Rappels/relances (notifications email)

**Temps estimé :** 6h

---

### 5.2 Dashboard Analytics

- Graphique utilisation mensuelle (CVs, lettres)
- Timeline des documents créés
- Suggestions personnalisées selon activité
- Activité récente (dernières actions)

**Temps estimé :** 4h

---

### 5.3 Templates Personnalisables

- Galerie visuelle de templates (preview)
- Sélecteur de couleurs
- Choix de police
- Preview en temps réel

**Temps estimé :** 8h

---

### 5.4 Emails Transactionnels

Installer Resend : `npm install resend`

Emails à créer :

- Bienvenue après inscription
- Confirmation d'abonnement
- Facture mensuelle
- Alerte limite atteinte
- Fin d'essai gratuit (J-1)
- Confirmation d'annulation

**Temps estimé :** 6h

---

### 5.5 Fonctionnalités Bonus

- Duplication de CV/lettre (bouton "Dupliquer")
- Export DOCX (en plus du PDF) pour plans PRO+
- Partage public (lien partageable du CV)
- Versionning (historique des modifications)
- Import CV existant (PDF → formulaire pré-rempli)

**Temps estimé :** 12h

---

## RECAPITULATIF PAR PRIORITE

### CRITIQUE (Bloquant) - 2-3 jours

1. Configuration Stripe (2h)
2. Application limites par plan (3h)
3. Sync Stripe → Supabase (1h30)
4. Pages légales basiques (2h)
5. Test module candidatures (30min)

### HAUTE (MVP) - 3-4 jours

6. Pages "Mes Documents" (4h)
7. Edition documents (4h)
8. Page "Mon Abonnement" (3h)
9. Amélioration Exemples (2h)

### STABILITE (Pré-lancement) - 2 jours

10. Tests de bout en bout (3h)
11. Gestion d'erreurs & UX (2h)
12. SEO basique (1h)
13. Analytics & Monitoring (2h)

### DEPLOIEMENT (J-1) - 1 jour

14. Config Vercel production (2h)
15. Tests production (2h)
16. Backup & sécurité (1h)

### POST-LANCEMENT (Améliorations)

17. Candidatures avancées (6h)
18. Dashboard analytics (4h)
19. Templates personnalisables (8h)
20. Emails transactionnels (6h)
21. Fonctionnalités bonus (12h)

---

## ESTIMATION TOTALE

- **Phase 1 (Critique)** : 9h → 2 jours
- **Phase 2 (Haute)** : 13h → 2 jours
- **Phase 3 (Stabilité)** : 8h → 1 jour
- **Phase 4 (Déploiement)** : 5h → 1 jour

**TOTAL POUR LANCEMENT BETA : 35h → 6-7 jours de travail**

**Post-lancement (amélioration continue) : 36h supplémentaires**

---

## CHECKLIST FINALE AVANT LANCEMENT

### Fonctionnel

- [ ] Inscription/Connexion Clerk
- [ ] Création CV avec génération IA
- [ ] Création lettre avec génération IA
- [ ] Export PDF des deux
- [ ] Sauvegarde en DB
- [ ] Liste "Mes CVs" et "Mes Lettres"
- [ ] Modification de documents existants
- [ ] Module candidatures CRUD complet
- [ ] Paiements Stripe (3 plans)
- [ ] Webhooks Stripe fonctionnels
- [ ] Limites par plan appliquées
- [ ] Page Mon Abonnement
- [ ] Customer Portal Stripe

### Légal & Sécurité

- [ ] Mentions légales
- [ ] Politique de confidentialité (RGPD)
- [ ] CGU/CGV
- [ ] HTTPS partout
- [ ] Rate limiting actif
- [ ] Pas de clés API exposées

### UX & Design

- [ ] Responsive mobile/tablet/desktop
- [ ] Messages d'erreur clairs
- [ ] Loading states partout
- [ ] Toasts de confirmation
- [ ] Navigation cohérente
- [ ] Design unifié

### Performance & Monitoring

- [ ] Temps de réponse API < 3s
- [ ] PDFs générés < 5s
- [ ] Pas d'erreurs console
- [ ] Analytics installé
- [ ] Monitoring erreurs (Sentry)
- [ ] Logs Vercel surveillés

### SEO & Marketing

- [ ] Metadata complètes
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] OG images
- [ ] Page pricing claire
- [ ] Page exemples attractive

---

## LANCEMENT BETA

Une fois toutes les phases 1-4 complétées :

1. Annoncer sur réseaux sociaux (LinkedIn, Twitter)
2. Inviter 10-20 beta testeurs (étudiants en alternance)
3. Collecter feedback via formulaire
4. Itérer sur problèmes critiques
5. Lancement public après 2-3 semaines de beta

**Objectif beta : Valider product-market fit et corriger bugs avant scaling**

### To-dos

- [ ] Créer le composant TemplateSelector pour CV avec galerie visuelle de templates
- [ ] Créer le composant TemplateSelector pour lettres
- [ ] Créer le layout Split-Screen (CVEditorLayout) avec colonnes formulaire/preview
- [ ] Créer le composant CVPreviewLive avec rendu temps réel et debounce
- [ ] Créer le composant LetterPreviewLive
- [ ] Créer les APIs GET/PUT pour /api/cv/[id]
- [ ] Créer les APIs GET/PUT pour /api/letter/[id]
- [ ] Créer la page /my-cvs avec liste de tous les CVs (cards, actions)
- [ ] Créer la page /my-letters avec liste de toutes les lettres
- [ ] Créer la page /edit-cv/[id] pour modifier un CV existant
- [ ] Créer la page /edit-letter/[id] pour modifier une lettre existante
- [ ] Intégrer la sélection de templates dans CVFormSteps et LetterFormSteps
- [ ] Ajouter liens 'Mes CVs' et 'Mes Lettres' dans le Dashboard
- [ ] Améliorer UX : loading states, animations, validation temps réel
- [ ] Fonctionnalités bonus : duplication, export formats, partage public (optionnel)