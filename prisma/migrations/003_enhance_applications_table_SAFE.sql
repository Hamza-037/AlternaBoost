-- Migration SAFE pour améliorer la table Application
-- À exécuter dans Supabase SQL Editor
-- Cette version utilise IF NOT EXISTS partout pour éviter les erreurs

-- Ajouter les nouvelles colonnes de manière sécurisée
DO $$ 
BEGIN
    -- jobUrl
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='jobUrl') THEN
        ALTER TABLE "Application" ADD COLUMN "jobUrl" TEXT;
        RAISE NOTICE 'Colonne jobUrl ajoutée';
    END IF;

    -- nextFollowUp
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='nextFollowUp') THEN
        ALTER TABLE "Application" ADD COLUMN "nextFollowUp" TIMESTAMP(3);
        RAISE NOTICE 'Colonne nextFollowUp ajoutée';
    END IF;

    -- statusHistory
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='statusHistory') THEN
        ALTER TABLE "Application" ADD COLUMN "statusHistory" JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Colonne statusHistory ajoutée';
    END IF;

    -- salary
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='salary') THEN
        ALTER TABLE "Application" ADD COLUMN "salary" TEXT;
        RAISE NOTICE 'Colonne salary ajoutée';
    END IF;

    -- location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='location') THEN
        ALTER TABLE "Application" ADD COLUMN "location" TEXT;
        RAISE NOTICE 'Colonne location ajoutée';
    END IF;

    -- contractType
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='Application' AND column_name='contractType') THEN
        ALTER TABLE "Application" ADD COLUMN "contractType" TEXT;
        RAISE NOTICE 'Colonne contractType ajoutée';
    END IF;
END $$;

-- Ajouter des commentaires pour documenter
COMMENT ON COLUMN "Application"."jobUrl" IS 'URL de l''offre d''emploi originale';
COMMENT ON COLUMN "Application"."nextFollowUp" IS 'Date de relance ou prochain entretien';
COMMENT ON COLUMN "Application"."statusHistory" IS 'Historique des changements de statut';
COMMENT ON COLUMN "Application"."salary" IS 'Salaire proposé ou souhaité';
COMMENT ON COLUMN "Application"."location" IS 'Lieu du poste';
COMMENT ON COLUMN "Application"."contractType" IS 'Type de contrat (CDI, CDD, Stage, etc.)';

-- Créer un index sur nextFollowUp pour les relances à venir
CREATE INDEX IF NOT EXISTS "Application_nextFollowUp_idx" ON "Application"("nextFollowUp");

-- Créer un index sur status pour les filtres
CREATE INDEX IF NOT EXISTS "Application_status_idx" ON "Application"("status");

-- Afficher un message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration terminée avec succès !';
    RAISE NOTICE 'Vérifiez les colonnes ajoutées ci-dessus.';
END $$;

