-- Migration pour améliorer la table Application
-- À exécuter dans Supabase SQL Editor

-- Ajouter les nouvelles colonnes
ALTER TABLE "Application" 
ADD COLUMN IF NOT EXISTS "jobUrl" TEXT,
ADD COLUMN IF NOT EXISTS "nextFollowUp" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "statusHistory" JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "salary" TEXT,
ADD COLUMN IF NOT EXISTS "location" TEXT,
ADD COLUMN IF NOT EXISTS "contractType" TEXT;

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

