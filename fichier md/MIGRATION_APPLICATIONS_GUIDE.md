# 🔧 Guide de Migration - Système de Candidatures

## ⚠️ IMPORTANT : Migration Base de Données Requise

Le nouveau système de candidatures nécessite l'ajout de nouvelles colonnes à la table `Application` dans Supabase.

---

## 📋 Étapes à Suivre

### 1️⃣ Ouvrir Supabase SQL Editor

1. Allez sur [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet **AlternaBoost**
3. Cliquez sur **SQL Editor** dans le menu de gauche

---

### 2️⃣ Exécuter le Script de Migration

Copiez et collez le contenu du fichier suivant dans l'éditeur SQL :

```
prisma/migrations/003_enhance_applications_table_SAFE.sql
```

**OU** copiez directement ce script :

```sql
-- Migration SAFE pour améliorer la table Application
DO $$ 
BEGIN
    -- jobUrl
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='jobUrl') THEN
        ALTER TABLE "Application" ADD COLUMN "jobUrl" TEXT;
    END IF;

    -- nextFollowUp
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='nextFollowUp') THEN
        ALTER TABLE "Application" ADD COLUMN "nextFollowUp" TIMESTAMP(3);
    END IF;

    -- statusHistory
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='statusHistory') THEN
        ALTER TABLE "Application" ADD COLUMN "statusHistory" JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- salary
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='salary') THEN
        ALTER TABLE "Application" ADD COLUMN "salary" TEXT;
    END IF;

    -- location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='location') THEN
        ALTER TABLE "Application" ADD COLUMN "location" TEXT;
    END IF;

    -- contractType
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='contractType') THEN
        ALTER TABLE "Application" ADD COLUMN "contractType" TEXT;
    END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS "Application_nextFollowUp_idx" ON "Application"("nextFollowUp");
CREATE INDEX IF NOT EXISTS "Application_status_idx" ON "Application"("status");
```

---

### 3️⃣ Cliquer sur "Run"

Cliquez sur le bouton **Run** (ou appuyez sur `Ctrl+Enter`)

---

### 4️⃣ Vérifier le Succès

Vous devriez voir dans les messages :
- ✅ `Colonne jobUrl ajoutée`
- ✅ `Colonne nextFollowUp ajoutée`
- ✅ `Colonne statusHistory ajoutée`
- ✅ `Colonne salary ajoutée`
- ✅ `Colonne location ajoutée`
- ✅ `Colonne contractType ajoutée`
- ✅ `Migration terminée avec succès !`

---

## 🔍 Vérification (Optionnel)

Pour vérifier que tout est bon, exécutez cette requête :

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Application'
ORDER BY ordinal_position;
```

Vous devriez voir toutes les colonnes, y compris les nouvelles.

---

## ✅ C'est Terminé !

Une fois la migration exécutée, rechargez votre application :

1. **Rechargez la page** dans le navigateur (Ctrl + R)
2. **Testez** l'ajout d'une candidature
3. Tous les nouveaux champs devraient fonctionner ! 🎉

---

## ❌ En Cas d'Erreur

Si vous voyez des erreurs, vérifiez :

1. **Connexion Supabase** : La base est-elle accessible ?
2. **Permissions** : Avez-vous les droits d'administration ?
3. **Nom de table** : La table `Application` existe-t-elle ?

Si le problème persiste, contactez le support ou regardez les logs de Supabase.

---

## 🆕 Nouvelles Fonctionnalités Disponibles

Après la migration, vous aurez accès à :

- 🔗 **Lien vers l'offre** (jobUrl)
- ⏰ **Date de relance** (nextFollowUp) avec alertes
- 📊 **Historique des statuts** (statusHistory)
- 💰 **Salaire** (salary)
- 📍 **Localisation** (location)
- 📄 **Type de contrat** (contractType)

Profitez du nouveau tableau de bord ! 🚀

