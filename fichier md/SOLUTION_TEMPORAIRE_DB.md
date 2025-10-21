# Solution Temporaire - Problème de Connexion DB

## Problème identifié

La connexion à Supabase échoue avec l'erreur :
```
Can't reach database server at `aws-1-us-east-1.pooler.supabase.com:6543`
```

## Cause

Votre projet Supabase n'est pas compatible IPv4, ce qui empêche Prisma de se connecter en direct.

## Solutions possibles

### Option 1 : Utiliser Supavisor (Transaction mode) ✅ RECOMMANDÉ

Dans votre `.env`, changez le port de 6543 à 5432 pour le `DIRECT_URL` :

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxx:password@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

**Note :** Remplacez `xxx` et `password` par vos vraies valeurs.

### Option 2 : Créer les tables manuellement via SQL Editor

1. Allez sur Supabase → SQL Editor
2. Créez les tables en exécutant le SQL de `prisma/migrations/002_add_applications_table.sql`
3. Les APIs fonctionneront ensuite

### Option 3 : Tester l'interface sans DB (Mode démo)

L'interface des candidatures est déjà prête et fonctionne visuellement.
La page `/dashboard/applications` affichera un état vide élégant en attendant la connexion DB.

## Pour tester l'interface maintenant

1. Allez sur http://localhost:3000/dashboard
2. Cliquez sur "Mes Candidatures" (badge NOUVEAU en vert)
3. Vous verrez l'interface complète avec le message "Commencez à suivre vos candidatures"
4. Cliquez sur "Nouvelle candidature" pour voir le formulaire

L'interface est entièrement fonctionnelle visuellement, seule la persistance des données nécessite la connexion DB.

## Prochaine étape

Essayez l'Option 1 en modifiant votre `.env` avec le port 5432 pour `DIRECT_URL`.

