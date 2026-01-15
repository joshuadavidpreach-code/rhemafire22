import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ where: { status: "published" }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>Courses</h1>
            <p>Free member teachings with a Ministry Track upgrade for official exams and ordination path.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16}}>
            {courses.map(c => (
              <div key={c.id} className="rf-card rf-card--roomy">
                <div className="rf-card__title">{c.title}</div>
                <p>{c.summary}</p>
                <Link className="rf-btn rf-btn--secondary" href={`/courses/${c.slug}`}>View Course</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
