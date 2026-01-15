import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim() || null;
  const emailRaw = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!emailRaw || password.length < 8) {
    return NextResponse.json({ error: "Email required and password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: emailRaw } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);

  // Create user (member by default)
  const user = await prisma.user.create({
    data: { email: emailRaw, password: hash, name, role: "MEMBER" },
  });

  // Grant FREE_MEMBER entitlement
  const freeTier = await prisma.membershipTier.findUnique({ where: { code: "FREE_MEMBER" } });
  if (freeTier) {
    await prisma.userEntitlement.create({
      data: { userId: user.id, tierId: freeTier.id, source: "system", active: true },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
