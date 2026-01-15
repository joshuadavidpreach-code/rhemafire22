import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function CoursePage({ params }: { params: { courseSlug: string } }) {
  const course = await prisma.course.findUnique({ where: { slug: params.courseSlug }, include: { lessons: { orderBy: { createdAt: "asc" } } } });
  if (!course || course.status !== "published") return notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>{course.title}</h1>
            <p style={{maxWidth:820}}>{course.summary}</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:16}}>
            <div className="rf-card rf-card--roomy">
              <div dangerouslySetInnerHTML={{ __html: course.descriptionHtml }} />
              <div className="rf-divider" style={{margin:"18px 0"}} />
              <div className="rf-card__title">Lessons (Previews)</div>
              <div style={{display:"grid", gap:10}}>
                {course.lessons.map(l => (
                  <Link key={l.id} href={`/courses/${course.slug}/lessons/${l.slug}`} className="rf-card rf-card--tight" style={{display:"block"}}>
                    <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
                      <strong>{l.title}</strong>
                      <span style={{color:"var(--rf-text-dim)"}}>Preview</span>
                    </div>
                    <div className="rf-card__meta" style={{marginTop:6}}>{l.publicExcerpt}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Watch Full Lessons</div>
              <p>Create a free account to access the member portal and watch the full lessons.</p>
              <Link className="rf-btn rf-btn--primary" href="/login">Join Free</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
