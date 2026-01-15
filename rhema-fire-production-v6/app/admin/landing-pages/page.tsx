import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createLP(formData: FormData) {
  "use server";
  const title = String(formData.get("title")||"").trim();
  const slug = String(formData.get("slug")||"").trim();
  const contentHtml = String(formData.get("contentHtml")||"").trim() || "<p>Landing page content…</p>";
  if (!title || !slug) return;
  await prisma.landingPage.create({ data: { title, slug, contentHtml, contentJson: "[]", status:"published" } });
  revalidatePath(`/lp/${slug}`);
  revalidatePath("/admin/landing-pages");
}

export default async function LandingPagesAdmin() {
  const pages = await prisma.landingPage.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AdminShell title="Landing Pages">
      <p className="rf-card__meta">Create funnel pages at /lp/&lt;slug&gt;. Use the Visual Builder for fast edits.</p>
      <form action={createLP} style={{display:"grid", gap:10, maxWidth:900}}>
        <div className="rf-field">
          <label className="rf-label">Title</label>
          <input name="title" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Slug (URL)</label>
          <input name="slug" className="rf-input" placeholder="free-book-offer" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Fallback HTML content</label>
          <textarea name="contentHtml" className="rf-textarea" rows={8} />
        </div>
        <button className="rf-btn rf-btn--primary" type="submit">Publish Landing Page</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />
      <div style={{display:"grid", gap:10}}>
        {pages.map(p => (
          <div key={p.id} className="rf-card rf-card--tight" style={{display:"grid", gap:6}}>
            <strong>{p.title}</strong>
            <div className="rf-card__meta">/lp/{p.slug} • {p.status}</div>
            <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
              <a className="rf-btn rf-btn--secondary" style={{padding:"8px 12px"}} href={`/admin/landing-builder/${p.slug}`}>Visual Builder</a>
              <a className="rf-btn rf-btn--secondary" style={{padding:"8px 12px"}} href={`/lp/${p.slug}`} target="_blank" rel="noreferrer">Open</a>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
