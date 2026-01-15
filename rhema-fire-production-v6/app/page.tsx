import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPageBySlug } from "@/lib/pageData";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");
  return {
    title: page?.metaTitle || "Rhema Fire",
    description: page?.metaDesc || "Word. Spirit. Power.",
  };
}

export default async function HomePage() {
  const page = await getPageBySlug("home");
  const latestPost = await prisma.post.findFirst({ where: { status: "published" }, orderBy: { createdAt: "desc" } });
  const latestLesson = await prisma.lesson.findFirst({ where: { status: "published", previewEnabled: true }, include: { course: true }, orderBy: { createdAt: "desc" } });

  const hasBuilder = page?.contentJson && page.contentJson !== "[]";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:1180}}>
            {page?.directAnswer ? (
              <div className="rf-card rf-card--tight" style={{marginBottom:16}}>
                <div className="rf-card__meta" style={{marginBottom:6}}>Direct Answer</div>
                <p style={{margin:0}}>{page.directAnswer}</p>
              </div>
            ) : null}

            {hasBuilder ? (
              <PageBuilderRenderer json={page!.contentJson} />
            ) : (
              <div style={{display:"grid", gap:18}}>
                <h1>Word. Spirit. Power.</h1>
                <p style={{maxWidth:780}}>
                  Rhema Fire is a premium ministry platform built for biblical clarity, Spirit-led discipleship, and global reach.
                </p>
                <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                  <Link href="/register" className="rf-btn rf-btn--primary">Join Free</Link>
                  <Link href="/free-book" className="rf-btn rf-btn--secondary">Get the Free Book</Link>
                </div>

                <div className="rf-divider" style={{marginTop:22}} />

                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16, marginTop:18}}>
                  <div className="rf-card rf-card--roomy">
                    <div className="rf-card__title">Latest Teaching</div>
                    {latestLesson ? (
                      <>
                        <p style={{marginBottom:12}}><strong>{latestLesson.title}</strong></p>
                        <p className="rf-card__meta">Course: {latestLesson.course.title}</p>
                        <div style={{marginTop:14, display:"flex", gap:10, flexWrap:"wrap"}}>
                          <Link className="rf-btn rf-btn--secondary" href={`/courses/${latestLesson.course.slug}/lessons/${latestLesson.slug}`}>Watch Preview</Link>
                          <Link className="rf-btn rf-btn--primary" href="/register">Watch Full (Members)</Link>
                        </div>
                      </>
                    ) : (
                      <p>No lessons yet. Add one in Admin → Lessons.</p>
                    )}
                  </div>

                  <div className="rf-card rf-card--roomy">
                    <div className="rf-card__title">Latest Blog</div>
                    {latestPost ? (
                      <>
                        <p style={{marginBottom:12}}><strong>{latestPost.title}</strong></p>
                        <p>{latestPost.excerpt}</p>
                        <Link className="rf-btn rf-btn--secondary" href={`/blog/${latestPost.slug}`}>Read</Link>
                      </>
                    ) : (
                      <p>No posts yet. Add one in Admin → Blog.</p>
                    )}
                  </div>

                  <div className="rf-card rf-card--roomy">
                    <div className="rf-card__title">Ministry Track</div>
                    <p>Upgrade path for ordination: exams, standing, and graduation review.</p>
                    <Link className="rf-btn rf-btn--secondary" href="/ministry-track">Learn More</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
