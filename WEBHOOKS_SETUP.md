# Configuration des Webhooks Stripe - Guide complet

## ✅ Ce qui a été fait

- ✅ API route `/api/stripe/webhook` créée
- ✅ Gestion de tous les événements Stripe importants
- ✅ Système de helpers pour vérifier les abonnements (`lib/subscription.ts`)
- ✅ Page Dashboard pour voir son abonnement
- ✅ Mise à jour automatique des metadata Clerk

---

## 🔧 Configuration manuelle requise

### **Étape 1 : Tester les webhooks en local (DÉVELOPPEMENT)**

Pour tester les webhooks sur votre machine locale, vous devez utiliser **Stripe CLI**.

#### 1.1 Installer Stripe CLI

**Windows (avec Scoop) :**
```powershell
scoop install stripe
```

**Ou télécharger depuis :** https://stripe.com/docs/stripe-cli

#### 1.2 Connecter Stripe CLI

```bash
stripe login
```
Cela ouvrira votre navigateur pour vous authentifier.

#### 1.3 Récupérer le webhook secret pour le développement

```bash
stripe listen --forward-to localhost:3008/api/stripe/webhook
```

Cette commande va :
- Afficher un **webhook signing secret** (commence par `whsec_...`)
- Transférer tous les événements Stripe vers votre localhost

#### 1.4 Copier le webhook secret dans .env.local

Copiez le secret affiché (format : `whsec_xxxxx`) et ajoutez-le dans votre `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_LOCAL
```

#### 1.5 Tester un paiement

1. Gardez `stripe listen` en cours d'exécution dans un terminal
2. Dans un autre terminal, lancez votre app : `npm run dev`
3. Allez sur `/pricing` et testez un abonnement
4. Utilisez une **carte de test Stripe** : `4242 4242 4242 4242`
5. Observez les logs dans le terminal `stripe listen`

---

### **Étape 2 : Configurer les webhooks pour la PRODUCTION**

Une fois que vous déployez votre application (sur Vercel, Railway, etc.), vous devez configurer les webhooks de production.

#### 2.1 Obtenir l'URL de production

Exemple : `https://alternaboost.vercel.app`

#### 2.2 Créer le webhook endpoint dans Stripe Dashboard

1. Allez dans **Stripe Dashboard** : https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. Entrez l'URL : `https://VOTRE-DOMAINE.com/api/stripe/webhook`
4. Sélectionnez les événements à écouter :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Cliquez sur **"Add endpoint"**

#### 2.3 Récupérer le signing secret

Une fois l'endpoint créé :
1. Cliquez sur l'endpoint
2. Révélez le **Signing secret** (commence par `whsec_...`)
3. Copiez-le

#### 2.4 Ajouter le secret dans vos variables d'environnement de production

**Sur Vercel :**
1. Allez dans votre projet → Settings → Environment Variables
2. Ajoutez :
   - Nom : `STRIPE_WEBHOOK_SECRET`
   - Valeur : `whsec_VOTRE_SECRET_PRODUCTION`
   - Environnement : **Production**

**Sur d'autres plateformes :**
Ajoutez la variable `STRIPE_WEBHOOK_SECRET` dans la configuration de votre hébergeur.

---

## 🧪 Tester les webhooks

### Test en développement (avec Stripe CLI)

```bash
# Terminal 1 : Stripe listen
stripe listen --forward-to localhost:3008/api/stripe/webhook

# Terminal 2 : Lancer l'app
npm run dev

# Terminal 3 : Déclencher un événement test
stripe trigger checkout.session.completed
```

### Cartes de test Stripe

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 0002` | Paiement refusé |
| `4000 0000 0000 9995` | Paiement échoué |

- **Date d'expiration** : N'importe quelle date future (ex: 12/34)
- **CVC** : N'importe quel 3 chiffres (ex: 123)

---

## 🔍 Vérifier que les webhooks fonctionnent

### Logs à surveiller

Dans votre terminal (avec Stripe CLI actif), vous devriez voir :

```
✅ Webhook reçu: checkout.session.completed
🎉 Checkout completed: cs_test_xxxxx
✅ User metadata updated: user_xxxxx
📧 Email de bienvenue à envoyer à: user_xxxxx
```

### Dans Clerk Dashboard

1. Allez sur https://dashboard.clerk.com
2. Ouvrez votre utilisateur de test
3. Vérifiez les **Public metadata** :
   - `plan`: "STARTER", "PRO", ou "PREMIUM"
   - `subscriptionStatus`: "active" ou "trialing"
   - `stripeCustomerId`: commence par `cus_`
   - `stripeSubscriptionId`: commence par `sub_`

### Dans Stripe Dashboard

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur votre endpoint
3. Consultez les **Recent events**
4. Vérifiez que les événements sont en **"Succeeded"** (vert)

---

## 🐛 Problèmes courants

### Erreur : "Webhook signature verification failed"

❌ **Cause** : Le `STRIPE_WEBHOOK_SECRET` n'est pas bon

✅ **Solution** :
- En dev : Relancez `stripe listen` et copiez le nouveau secret
- En prod : Vérifiez que vous avez copié le bon secret depuis Stripe Dashboard

### Erreur : "Missing stripe-signature header"

❌ **Cause** : La requête ne vient pas de Stripe

✅ **Solution** : Ne testez jamais les webhooks directement dans le navigateur. Utilisez Stripe CLI ou Stripe Dashboard.

### Les metadata Clerk ne se mettent pas à jour

❌ **Cause** : Les IDs ne sont pas bien passés

✅ **Solution** : Vérifiez que dans `/api/stripe/create-checkout-session`, vous passez bien `clerkUserId` dans les `metadata`.

---

## 📊 Flux complet d'un abonnement

```
1. Utilisateur clique "Essayer Pro" sur /pricing
   ↓
2. Appel API : POST /api/stripe/create-checkout-session
   ↓
3. Redirection vers Stripe Checkout
   ↓
4. Utilisateur entre sa carte (4242...)
   ↓
5. Paiement réussi → Stripe envoie webhook
   ↓
6. POST /api/stripe/webhook reçoit l'événement
   ↓
7. Mise à jour des metadata Clerk (plan = "PRO")
   ↓
8. Redirection vers /dashboard?success=true
   ↓
9. L'utilisateur voit son nouveau plan dans le Dashboard
```

---

## 🚀 Commandes utiles

```bash
# Voir les webhooks en temps réel
stripe listen --forward-to localhost:3008/api/stripe/webhook

# Déclencher un événement de test
stripe trigger checkout.session.completed

# Voir les logs Stripe
stripe logs tail

# Tester la connexion
stripe config --list
```

---

## ✅ Checklist finale

Avant de passer en production :

- [ ] Webhook endpoint créé dans Stripe Dashboard (production)
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté dans les variables d'environnement de production
- [ ] Tests effectués avec Stripe CLI en local
- [ ] Webhooks fonctionnent (vérifiés dans Clerk metadata)
- [ ] Cartes de test validées (paiement réussi + échec)
- [ ] Les événements apparaissent dans Stripe Dashboard → Webhooks
- [ ] Le plan s'affiche correctement dans `/dashboard`

---

**Besoin d'aide ?** Les webhooks sont cruciaux. Testez bien en dev avant de déployer !
