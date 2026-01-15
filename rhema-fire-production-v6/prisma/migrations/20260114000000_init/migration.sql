-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE "Page" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'published',
  "contentHtml" TEXT NOT NULL DEFAULT '',
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateTable
CREATE TABLE "Post" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'published',
  "excerpt" TEXT NOT NULL DEFAULT '',
  "contentHtml" TEXT NOT NULL DEFAULT '',
  "directAnswer" TEXT,
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateTable
CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'published',
  "summary" TEXT NOT NULL DEFAULT '',
  "descriptionHtml" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateTable
CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'published',
  "summaryHtml" TEXT NOT NULL DEFAULT '',
  "youtubeUrl" TEXT NOT NULL,
  "youtubeId" TEXT NOT NULL,
  "transcript" TEXT NOT NULL DEFAULT '',
  "publicExcerpt" TEXT NOT NULL DEFAULT '',
  "previewEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "previewIndexable" BOOLEAN NOT NULL DEFAULT TRUE,
  "courseId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Lesson_courseId_slug_key" ON "Lesson"("courseId","slug");

-- CreateTable
CREATE TABLE "Optin" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "firstName" TEXT,
  "source" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Optin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'contact',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
  "id" TEXT NOT NULL,
  "fromPath" TEXT NOT NULL,
  "toPath" TEXT NOT NULL,
  "status" INTEGER NOT NULL DEFAULT 301,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");
