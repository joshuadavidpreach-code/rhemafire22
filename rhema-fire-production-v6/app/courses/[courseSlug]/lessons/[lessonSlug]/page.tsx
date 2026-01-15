import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function LessonPreview({ params }: { params: { courseSlug: string; lessonSlug: string } }) {
  const course = await prisma.course.findUnique({ where: { slug: params.courseSlug } });
  if (!course) return notFound();

  const lesson = await prisma.lesson.findFirst({
    where: { courseId: course.id, slug: params.lessonSlug, status: "published", previewEnabled: true },
  });
  if (!lesson) return notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:980}}>
            <h1>{lesson.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: lesson.summaryHtml }} />
            <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
              <Link className="rf-btn rf-btn--primary" href="/login">Watch Full Lesson (Members)</Link>
              <Link className="rf-btn rf-btn--secondary" href={`/courses/${course.slug}`}>Back to Course</Link>
            </div>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:980, display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:16}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Transcript Excerpt</div>
              <p style={{whiteSpace:"pre-wrap"}}>{lesson.publicExcerpt || "Add a public excerpt in Admin → Lessons."}</p>
              <div className="rf-divider" style={{margin:"18px 0"}} />
              <div className="rf-card__meta">This preview is indexable for SEO. The full lesson is inside the member portal.</div>
            </div>

            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Video</div>
              <div className="rf-video" style={{marginTop:10}}>
                <div className="rf-video__ratio">
                  <iframe
                    src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                  />
                </div>
              </div>
              <p style={{marginTop:12, color:"var(--rf-text-dim)"}}>For performance, you can disable preview video and keep excerpts only.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
