-- Add contentJson to Page and LandingPage
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "contentJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "LandingPage" ADD COLUMN IF NOT EXISTS "contentJson" TEXT NOT NULL DEFAULT '[]';

-- Email autoresponder tables
CREATE TABLE IF NOT EXISTS "EmailSequence" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmailSequence_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmailSequence_code_key" ON "EmailSequence"("code");

CREATE TABLE IF NOT EXISTS "EmailStep" (
  "id" TEXT NOT NULL,
  "sequenceId" TEXT NOT NULL,
  "dayOffset" INTEGER NOT NULL,
  "subject" TEXT NOT NULL,
  "bodyHtml" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmailStep_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EmailStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "EmailSequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "EmailStep_sequenceId_sortOrder_idx" ON "EmailStep"("sequenceId","sortOrder");

CREATE TABLE IF NOT EXISTS "EmailSubscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "firstName" TEXT,
  "sequenceId" TEXT NOT NULL,
  "currentStep" INTEGER NOT NULL DEFAULT 0,
  "optedInAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "nextSendAt" TIMESTAMPTZ NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmailSubscriber_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EmailSubscriber_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "EmailSequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmailSubscriber_email_key" ON "EmailSubscriber"("email");
CREATE INDEX IF NOT EXISTS "EmailSubscriber_sequenceId_status_nextSendAt_idx" ON "EmailSubscriber"("sequenceId","status","nextSendAt");

CREATE TABLE IF NOT EXISTS "EmailSendLog" (
  "id" TEXT NOT NULL,
  "subscriberId" TEXT NOT NULL,
  "stepId" TEXT,
  "toEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "provider" TEXT NOT NULL DEFAULT 'smtp',
  "error" TEXT,
  "sentAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmailSendLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EmailSendLog_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "EmailSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
