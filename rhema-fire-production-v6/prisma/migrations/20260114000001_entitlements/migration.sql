-- Add MembershipTier and UserEntitlement tables
CREATE TABLE "MembershipTier" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "MembershipTier_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MembershipTier_code_key" ON "MembershipTier"("code");

CREATE TABLE "UserEntitlement" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tierId" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'system',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "startsAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "endsAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "UserEntitlement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserEntitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "UserEntitlement_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "MembershipTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "UserEntitlement_userId_active_idx" ON "UserEntitlement"("userId","active");

-- Update User default role to MEMBER for new signups (existing users unchanged)
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
