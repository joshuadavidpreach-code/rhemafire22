CREATE TABLE "LandingPage" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'published',
  "contentHtml" TEXT NOT NULL DEFAULT '',
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LandingPage_slug_key" ON "LandingPage"("slug");
