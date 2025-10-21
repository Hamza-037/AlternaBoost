# 🚀 Configuration Supabase pour AlternaBoost

Ce guide vous explique comment configurer Supabase pour votre projet AlternaBoost.

---

## 📋 Prérequis

- ✅ Compte Supabase créé ([supabase.com](https://supabase.com))
- ✅ Projet Supabase créé
- ✅ Node.js et npm installés

---

## 🔧 ÉTAPE 1 : Obtenir les URLs de connexion

### 1. Allez sur votre projet Supabase

1. Connectez-vous sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** (⚙️) > **Database**

### 2. Copiez les URLs de connexion

Vous allez avoir besoin de **2 URLs différentes** :

#### A. DATABASE_URL (Connection Pooling)

Descendez jusqu'à la section **Connection Pooling**.

Format :
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important :** 
- Port : **6543** (avec PgBouncer)
- Ajoutez `?pgbouncer=true` à la fin

#### B. DIRECT_URL (Direct Connection)

Dans la section **Connection String** en haut.

Format :
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Important :**
- Port : **5432** (connexion directe)
- Pas de paramètre pgbouncer

### 3. Trouvez votre mot de passe

Si vous avez perdu le mot de passe :
1. Allez dans **Settings** > **Database**
2. Section **Database password**
3. Cliquez sur **Reset database password**
4. ⚠️ **ATTENTION** : Sauvegardez le nouveau mot de passe immédiatement !

---

## 🔐 ÉTAPE 2 : Configurer les variables d'environnement

### 1. Créez le fichier `.env` à la racine du projet

```bash
# À la racine du projet AlternaBoost
touch .env
```

### 2. Copiez le contenu de `.env.example`

```bash
cp .env.example .env
```

### 3. Remplacez les valeurs Supabase

Ouvrez `.env` et modifiez :

```env
# ============================================
# SUPABASE DATABASE
# ============================================
DATABASE_URL="postgresql://postgres.[VOTRE-PROJECT-REF]:[VOTRE-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[VOTRE-PROJECT-REF]:[VOTRE-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Exemple concret :**
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MonMotDePasse123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:MonMotDePasse123!@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

---

## 📦 ÉTAPE 3 : Installer les dépendances

```bash
npm install
```

Cela va installer :
- `@prisma/client` - Client Prisma pour interagir avec la DB
- `prisma` - CLI Prisma
- `tsx` - Pour exécuter le script de seed

---

## 🗄️ ÉTAPE 4 : Initialiser la base de données

### 1. Générer le client Prisma

```bash
npm run db:generate
```

**Résultat attendu :**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### 2. Pousser le schéma vers Supabase

```bash
npm run db:push
```

**Résultat attendu :**
```
Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### 3. Vérifier dans Supabase

1. Allez sur Supabase Dashboard
2. Cliquez sur **Table Editor** (📊) dans la sidebar
3. Vous devriez voir toutes les tables créées :
   - ✅ User
   - ✅ CV
   - ✅ Letter
   - ✅ UsageHistory
   - ✅ WebhookEvent
   - ✅ DailyStats

---

## 🌱 ÉTAPE 5 : Ajouter des données de test (Optionnel)

Pour tester l'application avec des données :

```bash
npm run db:seed
```

**Résultat attendu :**
```
🌱 Début du seed de la base de données...
👤 Création des utilisateurs de test...
✅ Utilisateurs créés: free@test.com, pro@test.com
📄 Création de CVs de test...
✅ CVs créés: ...
✉️ Création de lettres de motivation...
✅ Lettre créée: ...
📊 Création de l'historique d'usage...
✅ Historique créé
📈 Création des statistiques...
✅ Statistiques créées

✨ Seed terminé avec succès!

📝 Résumé:
  - 2 utilisateurs de test créés
  - 2 CVs exemples créés
  - 1 lettre de motivation créée
  - Historique d'usage généré
  - Statistiques quotidiennes initialisées

🔐 Comptes de test:
  - FREE: free@test.com (clerkUserId: user_test_free_123)
  - PRO: pro@test.com (clerkUserId: user_test_pro_456)
```

---

## 🔍 ÉTAPE 6 : Explorer la base de données

### Option 1 : Prisma Studio (Recommandé)

```bash
npm run db:studio
```

Ouvrez votre navigateur sur http://localhost:5555

Vous pouvez :
- ✅ Voir toutes vos tables
- ✅ Ajouter/Modifier/Supprimer des données
- ✅ Exécuter des requêtes

### Option 2 : Supabase Table Editor

1. Allez sur Supabase Dashboard
2. Cliquez sur **Table Editor**
3. Explorez vos tables

---

## ✅ VÉRIFICATION FINALE

### Tester la connexion depuis le code

Créez un fichier de test :

```typescript
// test-db.ts
import { db } from './lib/db';

async function testConnection() {
  try {
    const users = await db.user.findMany();
    console.log('✅ Connexion réussie !');
    console.log(`📊 Nombre d'utilisateurs : ${users.length}`);
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await db.$disconnect();
  }
}

testConnection();
```

Exécutez :
```bash
npx tsx test-db.ts
```

---

## 🎯 PROCHAINES ÉTAPES

Maintenant que votre base de données est configurée :

1. ✅ **Migrer les API routes** pour utiliser Prisma au lieu de sessionStorage
2. ✅ **Implémenter le tracking d'usage** réel
3. ✅ **Créer les API pour sauvegarder les CVs/lettres**
4. ✅ **Mettre à jour le dashboard** pour afficher les vraies données

Consultez `AUDIT_DETAILLE_2025.md` section **Priorité 1** pour la suite !

---

## 🆘 DÉPANNAGE

### Erreur "password authentication failed"

❌ **Problème :** Mot de passe incorrect

✅ **Solution :**
1. Retournez sur Supabase Dashboard > Settings > Database
2. Réinitialisez le mot de passe
3. Mettez à jour `.env` avec le nouveau mot de passe

### Erreur "Can't reach database server"

❌ **Problème :** URL incorrecte ou réseau

✅ **Solution :**
1. Vérifiez que vous avez bien copié **les 2 URLs**
2. Vérifiez que le port 6543 et 5432 sont corrects
3. Vérifiez votre connexion Internet

### Erreur lors de `db:push`

❌ **Problème :** Schéma invalide

✅ **Solution :**
```bash
# Réinitialiser Prisma
rm -rf node_modules/.prisma
npm run db:generate
npm run db:push
```

### Tables non visibles dans Supabase

❌ **Problème :** Push non effectué

✅ **Solution :**
```bash
npm run db:push -- --force-reset
```

⚠️ **ATTENTION** : `--force-reset` supprime toutes les données !

---

## 📞 BESOIN D'AIDE ?

- 📖 [Documentation Prisma](https://www.prisma.io/docs)
- 📖 [Documentation Supabase](https://supabase.com/docs)
- 💬 [Discord AlternaBoost](#)

---

**Dernière mise à jour :** 21 octobre 2025


