import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Card from "@/components/Card";
import { getPageBySlug } from "@/lib/pageData";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  return {
    title: page?.metaTitle || "About — Rhema Fire",
    description: page?.metaDesc || "About Rhema Fire",
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const hasBuilder = page?.contentJson && page.contentJson !== "[]";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>About Rhema Fire</h1>
            <p style={{maxWidth:820}}>
              A high-contrast, reverent ministry platform designed to preach truth, teach Scripture, and build disciples with fire and clarity.
            </p>
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
              <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
                <Card title="Mission" meta="Rescue • Restore • Revive">
                  <p>Equip believers with Word-anchored doctrine and Spirit-led power, producing fruit that lasts.</p>
                </Card>
                <Card title="Ministry Track" meta="2-year ordination path">
                  <p>Quizzes, exams, standing, and graduation review — built for serious leadership formation.</p>
                </Card>
                <Card title="Media Engine" meta="YouTube-powered lessons">
                  <p>Paste a YouTube link — your lesson page renders instantly with transcript and resources.</p>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
