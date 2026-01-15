import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "").trim() || null;
  const email = String(form.get("email") || "").trim().toLowerCase();
  const subject = String(form.get("subject") || "").trim() || null;
  const message = String(form.get("message") || "").trim();
  if (!email || !message) return NextResponse.redirect(new URL("/contact", req.url));

  await prisma.contactMessage.create({
    data: { name, email, subject, message, type: "invite" },
  });

  return NextResponse.redirect(new URL("/contact?sent=1", req.url));
}
