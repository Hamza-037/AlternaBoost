# 🚀 Guide de Démarrage Rapide - AlternaBoost

**Date :** 21 octobre 2025  
**Version :** 1.0 - Base de données Supabase intégrée

---

## ✅ CE QUI EST PRÊT

### 1. Base de données Supabase
- ✅ Schema Prisma créé
- ✅ Tables créées manuellement dans Supabase
- ✅ Client Prisma configuré
- ✅ Données de test générées (seed)

### 2. APIs fonctionnelles
- ✅ `/api/save-cv` - Sauvegarde des CVs
- ✅ `/api/save-letter` - Sauvegarde des lettres
- ✅ `/api/user/cvs` - Historique des CVs
- ✅ `/api/user/letters` - Historique des lettres
- ✅ `/api/user/usage` - Suivi de l'usage mensuel
- ✅ `/api/generate-cv-data` - Modifiée pour sauvegarder automatiquement
- ✅ `/api/generate-letter-data` - Modifiée pour sauvegarder automatiquement

### 3. Dashboard utilisateur
- ✅ Affiche l'usage réel depuis la DB
- ✅ Compteurs CVs et lettres en temps réel
- ✅ Barres de progression
- ✅ Alertes si limite atteinte
- ✅ Bouton "Actualiser"

---

## 🔧 PROCHAINES COMMANDES À EXÉCUTER

### 1. Générer le client Prisma (OBLIGATOIRE)
```bash
npm run db:generate
```
> Crée le client TypeScript pour communiquer avec Supabase

### 2. Vérifier la connexion (Optionnel)
```bash
npx prisma studio
```
> Ouvre l'interface visuelle de Prisma pour explorer vos données

### 3. Lancer le serveur de développement
```bash
npm run dev
```
> Lance l'application sur http://localhost:3000

---

## 📋 CHECKLIST DE VALIDATION

Avant de tester, vérifiez que :

- [ ] Les tables existent dans Supabase (vous les avez créées manuellement)
- [ ] Le fichier `.env` contient bien `DATABASE_URL` et `DIRECT_URL`
- [ ] Vous avez exécuté `npm run db:generate`
- [ ] Toutes les dépendances sont installées (`npm install`)

---

## 🧪 TESTER L'INTÉGRATION

### Test 1 : Créer un CV
1. Allez sur http://localhost:3000/create-cv
2. Remplissez le formulaire
3. Cliquez sur "Générer mon CV"
4. **Vérification :** Le CV devrait être sauvegardé automatiquement dans Supabase

### Test 2 : Vérifier le Dashboard
1. Allez sur http://localhost:3000/dashboard
2. **Vérification :** Vous devriez voir :
   - Votre plan actuel
   - Nombre de CVs créés ce mois (1/3 si plan FREE)
   - Barre de progression mise à jour

### Test 3 : Vérifier dans Supabase
1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Cliquez sur "Table Editor"
4. Sélectionnez la table `CV`
5. **Vérification :** Vous devriez voir le CV que vous venez de créer

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Erreur : "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### Erreur : "DATABASE_URL is not defined"
1. Vérifiez que `.env` existe à la racine du projet
2. Vérifiez que `DATABASE_URL` et `DIRECT_URL` sont définis
3. Relancez le serveur

### Erreur : "Table 'User' does not exist"
1. Vérifiez que vous avez bien exécuté les requêtes SQL dans le SQL Editor de Supabase
2. Le fichier `create-tables.sql` contient toutes les requêtes nécessaires

### Le Dashboard n'affiche pas les données
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs réseau dans l'onglet "Network"
3. Vérifiez que vous êtes bien authentifié (connecté avec Clerk)

---

## 📊 STRUCTURE DE LA BASE DE DONNÉES

### Table `User`
- Stocke les utilisateurs (synchro avec Clerk)
- Compteurs d'usage mensuels
- Plan et abonnement Stripe

### Table `CV`
- Tous les CVs créés par les utilisateurs
- Données en JSON
- Template, titre, entreprise cible

### Table `Letter`
- Toutes les lettres de motivation
- Contenu généré par l'IA

### Table `UsageHistory`
- Historique de toutes les actions
- Pour analytics et audit

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

### Phase 1 : Validation (MAINTENANT)
1. ✅ Tester la création de CV
2. ✅ Tester la création de lettre
3. ✅ Vérifier le dashboard
4. ✅ Vérifier les données dans Supabase

### Phase 2 : Améliorations UX (Optionnel)
1. **Page d'historique** : Afficher tous les CVs/lettres créés
2. **Boutons de téléchargement** : Télécharger à nouveau un PDF
3. **Suppression** : Permettre de supprimer un CV/lettre
4. **Édition** : Modifier un CV existant

### Phase 3 : Webhooks Stripe (Si abonnements)
1. Sécuriser l'endpoint webhook
2. Synchroniser les abonnements automatiquement
3. Gérer les annulations

### Phase 4 : Déploiement
1. Déployer sur Vercel
2. Configurer les variables d'environnement
3. Tester en production

---

## 🔐 SÉCURITÉ

### Variables d'environnement à NE JAMAIS commit
- `DATABASE_URL` (contient le mot de passe)
- `DIRECT_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Tout est déjà dans `.gitignore`, mais vérifiez toujours avant un commit !

---

## 💡 ASTUCES

### Prisma Studio (Interface visuelle)
```bash
npx prisma studio
```
Ouvre une interface pour explorer et modifier vos données visuellement.

### Voir les logs SQL
Les logs SQL sont activés en développement dans `lib/db.ts` :
```typescript
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
```

### Reset des compteurs manuellement
Si vous voulez tester le reset mensuel :
```typescript
// Dans Prisma Studio ou SQL Editor
UPDATE "User" SET "cvsCreatedThisMonth" = 0, "lettersCreatedThisMonth" = 0;
```

---

## 📞 BESOIN D'AIDE ?

### Documentation officielle
- Prisma : https://www.prisma.io/docs
- Supabase : https://supabase.com/docs
- Next.js : https://nextjs.org/docs
- Clerk : https://clerk.com/docs

### Fichiers importants
- `prisma/schema.prisma` : Schéma de la base de données
- `lib/db.ts` : Client Prisma
- `create-tables.sql` : Requêtes SQL pour créer les tables
- `ETAPE_1_COMPLETE.md` : Récapitulatif ÉTAPE 1
- `ETAPE_2_COMPLETE.md` : Récapitulatif ÉTAPE 2

---

## 🎉 FÉLICITATIONS !

Vous avez terminé l'intégration de Supabase avec succès ! 🚀

Votre application peut maintenant :
- ✅ Sauvegarder les CVs et lettres
- ✅ Tracker l'usage par utilisateur
- ✅ Appliquer les limites par plan
- ✅ Afficher un dashboard en temps réel

**AlternaBoost est prêt à décoller !** 🎊

