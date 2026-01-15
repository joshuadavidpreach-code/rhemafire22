import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createRedirect(formData: FormData) {
  "use server";
  const fromPath = String(formData.get("fromPath") || "").trim();
  const toPath = String(formData.get("toPath") || "").trim();
  if (!fromPath || !toPath) return;
  await prisma.redirect.upsert({
    where: { fromPath },
    update: { toPath, status: 301 },
    create: { fromPath, toPath, status: 301 },
  });
  revalidatePath("/admin/seo/redirects");
}

export default async function Redirects() {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Redirects">
      <p className="rf-card__meta">
        This stores redirects in DB. In production, apply redirects via Vercel config or middleware map (Edge can’t query DB).
      </p>

      <form action={createRedirect} style={{display:"grid", gap:10, maxWidth:720, marginTop:12}}>
        <div className="rf-field">
          <label className="rf-label">From path</label>
          <input name="fromPath" className="rf-input" placeholder="/old" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">To path</label>
          <input name="toPath" className="rf-input" placeholder="/new" required />
        </div>
        <button className="rf-btn rf-btn--secondary" type="submit">Save Redirect</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />

      <div style={{display:"grid", gap:10}}>
        {redirects.map(r => (
          <div key={r.id} className="rf-card rf-card--tight">
            <strong>{r.fromPath}</strong>
            <div className="rf-card__meta">→ {r.toPath} (301)</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
