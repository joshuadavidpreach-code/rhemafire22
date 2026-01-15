import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function updateStep(formData: FormData) {
  "use server";
  const stepId = String(formData.get("stepId"));
  const dayOffset = Number(formData.get("dayOffset") || 0);
  const subject = String(formData.get("subject") || "");
  const bodyHtml = String(formData.get("bodyHtml") || "");

  await prisma.emailStep.update({
    where: { id: stepId },
    data: { dayOffset, subject, bodyHtml },
  });
  revalidatePath("/admin/autoresponder");
}

async function createTestSend(formData: FormData) {
  "use server";
  // Just revalidate page; actual sending happens via cron endpoint.
  revalidatePath("/admin/autoresponder");
}

export default async function AutoresponderAdmin() {
  const seq = await prisma.emailSequence.findUnique({
    where: { code: "FREE_BOOK_DRIP_10" },
    include: { steps: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <AdminShell title="In-house Autoresponder">
      <p className="rf-card__meta">
        Edit your 10-email drip here. Variables: <code>{"{first_name}"}</code> and <code>{"{email}"}</code>.
        Sending is triggered by Vercel Cron hitting <code>/api/cron/send-drip?secret=...</code>.
      </p>

      <div className="rf-divider" style={{margin:"14px 0"}} />

      {!seq ? (
        <p>No sequence found. Run <code>npx prisma db seed</code> to create the default 10-email sequence.</p>
      ) : (
        <div style={{display:"grid", gap:14}}>
          <div className="rf-card rf-card--tight">
            <strong>{seq.name}</strong>
            <div className="rf-card__meta">Code: {seq.code}</div>
          </div>

          {seq.steps.map((s, idx) => (
            <div key={s.id} className="rf-card rf-card--roomy">
              <div className="rf-card__title">Email #{idx + 1}</div>
              <form action={updateStep} style={{display:"grid", gap:10}}>
                <input type="hidden" name="stepId" value={s.id} />
                <div style={{display:"grid", gridTemplateColumns:"160px 1fr", gap:12}}>
                  <div className="rf-field">
                    <label className="rf-label">Day Offset</label>
                    <input name="dayOffset" className="rf-input" defaultValue={String(s.dayOffset)} />
                  </div>
                  <div className="rf-field">
                    <label className="rf-label">Subject</label>
                    <input name="subject" className="rf-input" defaultValue={s.subject} />
                  </div>
                </div>
                <div className="rf-field">
                  <label className="rf-label">Body HTML</label>
                  <textarea name="bodyHtml" className="rf-textarea" rows={8} defaultValue={s.bodyHtml} />
                </div>
                <button className="rf-btn rf-btn--primary" type="submit">Save Email</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
