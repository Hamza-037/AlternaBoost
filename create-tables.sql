-- ============================================
-- SCRIPT SQL POUR CRÉER LES TABLES ALTERNABOOST
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Supprimer les tables si elles existent déjà (optionnel)
DROP TABLE IF EXISTS "DailyStats" CASCADE;
DROP TABLE IF EXISTS "WebhookEvent" CASCADE;
DROP TABLE IF EXISTS "UsageHistory" CASCADE;
DROP TABLE IF EXISTS "Letter" CASCADE;
DROP TABLE IF EXISTS "CV" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ============================================
-- TABLE USER
-- ============================================
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "subscriptionStatus" TEXT DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialEndsAt" TIMESTAMP(3),
    "cvsCreatedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "lettersCreatedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "usageResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredTemplate" TEXT DEFAULT 'modern',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'fr',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmailsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE CV
-- ============================================
CREATE TABLE "CV" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'modern',
    "title" TEXT,
    "pdfUrl" TEXT,
    "pdfSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "targetCompany" TEXT,
    "targetPosition" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE LETTER
-- ============================================
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedContent" TEXT NOT NULL,
    "title" TEXT,
    "pdfUrl" TEXT,
    "pdfSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "targetCompany" TEXT,
    "targetPosition" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE USAGE HISTORY
-- ============================================
CREATE TABLE "UsageHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageHistory_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE WEBHOOK EVENT
-- ============================================
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE DAILY STATS
-- ============================================
CREATE TABLE "DailyStats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "cvsCreated" INTEGER NOT NULL DEFAULT 0,
    "lettersCreated" INTEGER NOT NULL DEFAULT 0,
    "newSubscriptions" INTEGER NOT NULL DEFAULT 0,
    "canceledSubscriptions" INTEGER NOT NULL DEFAULT 0,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- CONTRAINTES UNIQUE
-- ============================================
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
CREATE UNIQUE INDEX "DailyStats_date_key" ON "DailyStats"("date");

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================
-- Index User
CREATE INDEX "User_clerkUserId_idx" ON "User"("clerkUserId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_plan_subscriptionStatus_idx" ON "User"("plan", "subscriptionStatus");
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- Index CV
CREATE INDEX "CV_userId_createdAt_idx" ON "CV"("userId", "createdAt" DESC);
CREATE INDEX "CV_template_idx" ON "CV"("template");
CREATE INDEX "CV_status_idx" ON "CV"("status");

-- Index Letter
CREATE INDEX "Letter_userId_createdAt_idx" ON "Letter"("userId", "createdAt" DESC);
CREATE INDEX "Letter_status_idx" ON "Letter"("status");

-- Index UsageHistory
CREATE INDEX "UsageHistory_userId_createdAt_idx" ON "UsageHistory"("userId", "createdAt" DESC);
CREATE INDEX "UsageHistory_action_idx" ON "UsageHistory"("action");
CREATE INDEX "UsageHistory_resourceType_idx" ON "UsageHistory"("resourceType");

-- Index WebhookEvent
CREATE INDEX "WebhookEvent_source_eventType_idx" ON "WebhookEvent"("source", "eventType");
CREATE INDEX "WebhookEvent_processed_idx" ON "WebhookEvent"("processed");
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt" DESC);

-- Index DailyStats
CREATE INDEX "DailyStats_date_idx" ON "DailyStats"("date" DESC);

-- ============================================
-- FOREIGN KEYS (Relations)
-- ============================================
ALTER TABLE "CV" ADD CONSTRAINT "CV_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Letter" ADD CONSTRAINT "Letter_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UsageHistory" ADD CONSTRAINT "UsageHistory_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- TRIGGER POUR UPDATED_AT AUTOMATIQUE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_updated_at BEFORE UPDATE ON "CV"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_letter_updated_at BEFORE UPDATE ON "Letter"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dailystats_updated_at BEFORE UPDATE ON "DailyStats"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MESSAGE DE SUCCÈS
-- ============================================
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Toutes les tables ont été créées avec succès !';
    RAISE NOTICE '📊 Tables créées : User, CV, Letter, UsageHistory, WebhookEvent, DailyStats';
    RAISE NOTICE '🔗 Foreign keys et index ajoutés';
    RAISE NOTICE '⚡ Triggers pour updatedAt configurés';
END $$;

