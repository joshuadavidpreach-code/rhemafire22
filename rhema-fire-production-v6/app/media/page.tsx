import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPageBySlug } from "@/lib/pageData";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("media");
  return {
    title: page?.metaTitle || "Media — Rhema Fire",
    description: page?.metaDesc || "Media Library",
  };
}

export default async function MediaPage() {
  const page = await getPageBySlug("media");
  const hasBuilder = page?.contentJson && page.contentJson !== "[]";

  const lessons = await prisma.lesson.findMany({
    where: { status: "published", previewEnabled: true },
    include: { course: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>Media Library</h1>
            <p>Broadcast archive powered by your YouTube uploads — organized into courses and lessons.</p>
            {page?.directAnswer ? (
              <div className="rf-card rf-card--tight" style={{marginTop:14}}>
                <div className="rf-card__meta" style={{marginBottom:6}}>Direct Answer</div>
                <p style={{margin:0}}>{page.directAnswer}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container">
            {hasBuilder ? (
              <PageBuilderRenderer json={page!.contentJson} />
            ) : (
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16}}>
                {lessons.map((l) => (
                  <div key={l.id} className="rf-card rf-card--roomy">
                    <div className="rf-card__title">{l.title}</div>
                    <div className="rf-card__meta" style={{marginBottom:10}}>Course: {l.course.title}</div>
                    <p>{l.publicExcerpt || "Preview excerpt pending."}</p>
                    <Link className="rf-btn rf-btn--secondary" href={`/courses/${l.course.slug}/lessons/${l.slug}`}>Watch Preview</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
