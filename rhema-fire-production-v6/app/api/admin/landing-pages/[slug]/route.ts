import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lp = await prisma.landingPage.findUnique({ where: { slug: params.slug } });
  if (!lp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ title: lp.title, contentJson: lp.contentJson || "[]" });
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const contentJson = String(body?.contentJson || "[]");
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const updated = await prisma.landingPage.update({
    where: { slug: params.slug },
    data: { title, contentJson },
  });
  return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
}
