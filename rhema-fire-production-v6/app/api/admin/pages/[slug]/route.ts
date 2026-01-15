import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    title: page.title,
    metaTitle: page.metaTitle,
    metaDesc: page.metaDesc,
    directAnswer: page.directAnswer,
    contentJson: page.contentJson || "[]",
  });
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim() || params.slug;
  const metaTitle = String(body?.metaTitle || "").trim() || null;
  const metaDesc = String(body?.metaDesc || "").trim() || null;
  const directAnswer = String(body?.directAnswer || "").trim() || null;
  const contentJson = String(body?.contentJson || "[]");

  const updated = await prisma.page.upsert({
    where: { slug: params.slug },
    update: { title, metaTitle, metaDesc, directAnswer, contentJson },
    create: { title, slug: params.slug, status: "published", metaTitle, metaDesc, directAnswer, contentJson, contentHtml: "" },
  });

  return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
}
