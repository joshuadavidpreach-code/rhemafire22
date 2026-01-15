import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const firstName = String(form.get("firstName") || "").trim() || null;
  const source = String(form.get("source") || "").trim() || "unknown";
  if (!email) return NextResponse.redirect(new URL("/free-book", req.url));

  await prisma.optin.create({ data: { email, firstName, source } });

  // In-house autoresponder: attach to default sequence if exists
  const seq = await prisma.emailSequence.findUnique({ where: { code: "FREE_BOOK_DRIP_10" }, include: { steps: { orderBy: { sortOrder: "asc" } } } });
  if (seq && seq.steps.length) {
    const step0 = seq.steps[0];
    const nextSendAt = new Date(Date.now() + step0.dayOffset * 86400000);
    await prisma.emailSubscriber.upsert({
      where: { email },
      update: { firstName, sequenceId: seq.id, status: "active", nextSendAt },
      create: { email, firstName, sequenceId: seq.id, currentStep: 0, nextSendAt, status: "active" },
    });
  }

  return NextResponse.redirect(new URL("/thank-you", req.url));
}
