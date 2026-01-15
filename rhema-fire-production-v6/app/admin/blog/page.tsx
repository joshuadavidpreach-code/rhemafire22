import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createPost(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  if (!title || !slug) return;

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) return;

  await prisma.post.create({
    data: {
      title, slug, excerpt,
      contentHtml: "<p>Replace this with your post content in Admin (v2 editor).</p>",
      authorId: admin.id,
      status: "published"
    }
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export default async function AdminBlog() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell title="Blog">
      <form action={createPost} style={{display:"grid", gap:10, maxWidth:720}}>
        <div className="rf-field">
          <label className="rf-label">Title</label>
          <input name="title" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Slug</label>
          <input name="slug" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Excerpt</label>
          <textarea name="excerpt" className="rf-textarea" rows={3} />
        </div>
        <button className="rf-btn rf-btn--primary" type="submit">Publish Post</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />

      <div style={{display:"grid", gap:10}}>
        {posts.map(p => (
          <div key={p.id} className="rf-card rf-card--tight">
            <strong>{p.title}</strong>
            <div className="rf-card__meta">/blog/{p.slug} • {p.status}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
