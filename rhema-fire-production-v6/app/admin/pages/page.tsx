import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createPage(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!title || !slug) return;
  await prisma.page.create({ data: { title, slug, status: "published", contentHtml: "" } });
  revalidatePath("/admin/pages");
}

export default async function AdminPages() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell title="Pages">
      <form action={createPage} style={{display:"grid", gap:10, maxWidth:620}}>
        <div className="rf-field">
          <label className="rf-label">Title</label>
          <input name="title" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Slug</label>
          <input name="slug" className="rf-input" placeholder="e.g. start-here" required />
        </div>
        <button className="rf-btn rf-btn--primary" type="submit">Create Page</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />

      <div style={{display:"grid", gap:10}}>
        {pages.map(p => (
          <div key={p.id} className="rf-card rf-card--tight" style={{display:"grid", gap:6}}>
            <strong>{p.title}</strong>
            <div className="rf-card__meta">/{p.slug} • {p.status}</div>
            <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
              <a className="rf-btn rf-btn--secondary" style={{padding:"8px 12px"}} href={`/admin/page-builder/${p.slug}`}>Visual Builder</a>
              <a className="rf-btn rf-btn--secondary" style={{padding:"8px 12px"}} href={p.slug==="home" ? "/" : `/${p.slug}`} target="_blank" rel="noreferrer">Open</a>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
