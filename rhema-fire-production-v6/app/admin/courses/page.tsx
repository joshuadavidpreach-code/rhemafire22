import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createCourse(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  if (!title || !slug) return;
  await prisma.course.create({ data: { title, slug, summary, descriptionHtml: "<p>Course description.</p>", status: "published" } });
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
}

export default async function AdminCourses() {
  const courses = await prisma.course.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell title="Courses">
      <form action={createCourse} style={{display:"grid", gap:10, maxWidth:720}}>
        <div className="rf-field">
          <label className="rf-label">Title</label>
          <input name="title" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Slug</label>
          <input name="slug" className="rf-input" required />
        </div>
        <div className="rf-field">
          <label className="rf-label">Summary</label>
          <textarea name="summary" className="rf-textarea" rows={3} />
        </div>
        <button className="rf-btn rf-btn--primary" type="submit">Publish Course</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />

      <div style={{display:"grid", gap:10}}>
        {courses.map(c => (
          <div key={c.id} className="rf-card rf-card--tight">
            <strong>{c.title}</strong>
            <div className="rf-card__meta">/courses/{c.slug} • {c.status}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
