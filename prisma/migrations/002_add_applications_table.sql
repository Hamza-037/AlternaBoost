-- Migration: Add applications table for job tracking
-- Date: 2025-10-21

CREATE TABLE IF NOT EXISTS "Application" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'en_attente',
  "appliedDate" TIMESTAMP(3) NOT NULL,
  "lastContactDate" TIMESTAMP(3),
  "contactPerson" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on userId for faster queries
CREATE INDEX IF NOT EXISTS "Application_userId_idx" ON "Application"("userId");

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS "Application_status_idx" ON "Application"("status");

-- Create index on appliedDate for sorting
CREATE INDEX IF NOT EXISTS "Application_appliedDate_idx" ON "Application"("appliedDate" DESC);

