import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTransport, fromEmail } from "@/lib/mailer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transport = getTransport();
  if (!transport) {
    return NextResponse.json({ error: "SMTP not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS and FROM_EMAIL." }, { status: 500 });
  }

  const now = new Date();

  // fetch due subscribers
  const subs = await prisma.emailSubscriber.findMany({
    where: { status: "active", nextSendAt: { lte: now } },
    include: { sequence: { include: { steps: { orderBy: { sortOrder: "asc" } } } } },
    take: 50,
  });

  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    const steps = sub.sequence.steps;
    const step = steps[sub.currentStep];
    if (!step) {
      // completed
      await prisma.emailSubscriber.update({ where: { id: sub.id }, data: { status: "paused" } });
      continue;
    }

    const subject = step.subject.replace("{first_name}", sub.firstName || "");
    const body = step.bodyHtml.replaceAll("{first_name}", sub.firstName || "").replaceAll("{email}", sub.email);

    try {
      await transport.sendMail({
        from: fromEmail(),
        to: sub.email,
        subject,
        html: body,
      });

      await prisma.emailSendLog.create({
        data: {
          subscriberId: sub.id,
          stepId: step.id,
          toEmail: sub.email,
          subject,
          status: "sent",
          provider: "smtp",
        },
      });

      // schedule next
      const nextStepIndex = sub.currentStep + 1;
      const nextStep = steps[nextStepIndex];
      const nextSendAt = nextStep ? new Date(sub.optedInAt.getTime() + nextStep.dayOffset * 86400000) : new Date(now.getTime() + 365*86400000);

      await prisma.emailSubscriber.update({
        where: { id: sub.id },
        data: { currentStep: nextStepIndex, nextSendAt },
      });

      sent += 1;
    } catch (e: any) {
      await prisma.emailSendLog.create({
        data: {
          subscriberId: sub.id,
          stepId: step.id,
          toEmail: sub.email,
          subject,
          status: "failed",
          provider: "smtp",
          error: String(e?.message || e),
        },
      });
      failed += 1;
    }
  }

  return NextResponse.json({ ok: true, due: subs.length, sent, failed });
}
