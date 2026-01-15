CREATE TABLE "SiteSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);
