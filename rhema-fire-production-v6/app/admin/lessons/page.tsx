import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function youtubeIdFromUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/");
    const idx = parts.indexOf("embed");
    if (idx >= 0 && parts[idx+1]) return parts[idx+1];
  } catch {}
  return "dQw4w9WgXcQ";
}

async function createLesson(formData: FormData) {
  "use server";
  const courseId = String(formData.get("courseId") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
  const publicExcerpt = String(formData.get("publicExcerpt") || "").trim();
  if (!courseId || !title || !slug || !youtubeUrl) return;

  const youtubeId = youtubeIdFromUrl(youtubeUrl);
  await prisma.lesson.create({
    data: {
      courseId,
      title,
      slug,
      youtubeUrl,
      youtubeId,
      publicExcerpt,
      summaryHtml: "<p>Lesson summary.</p>",
      transcript: "Add transcript here.",
      previewEnabled: true,
      previewIndexable: true,
      status: "published",
    }
  });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (course) {
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath(`/media`);
  }
  revalidatePath("/admin/lessons");
}

export default async function AdminLessons() {
  const courses = await prisma.course.findMany({ where: { status: "published" }, orderBy: { title: "asc" } });
  const lessons = await prisma.lesson.findMany({ include: { course: true }, orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell title="Lessons">
      <form action={createLesson} style={{display:"grid", gap:10, maxWidth:760}}>
        <div className="rf-field">
          <label className="rf-label">Course</label>
          <select name="courseId" className="rf-select" required>
            <option value="">Select a course…</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div className="rf-field">
          <label className="rf-label">Title</label>
          <input name="title" className="rf-input" required />
        </div>

        <div className="rf-field">
          <label className="rf-label">Slug</label>
          <input name="slug" className="rf-input" placeholder="lesson-1" required />
        </div>

        <div className="rf-field">
          <label className="rf-label">YouTube URL</label>
          <input name="youtubeUrl" className="rf-input" placeholder="https://www.youtube.com/watch?v=..." required />
        </div>

        <div className="rf-field">
          <label className="rf-label">Public excerpt (SEO preview)</label>
          <textarea name="publicExcerpt" className="rf-textarea" rows={3} />
        </div>

        <button className="rf-btn rf-btn--primary" type="submit">Publish Lesson</button>
      </form>

      <div className="rf-divider" style={{margin:"18px 0"}} />

      <div style={{display:"grid", gap:10}}>
        {lessons.map(l => (
          <div key={l.id} className="rf-card rf-card--tight">
            <strong>{l.title}</strong>
            <div className="rf-card__meta">Course: {l.course.title} • Preview: /courses/{l.course.slug}/lessons/{l.slug}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
