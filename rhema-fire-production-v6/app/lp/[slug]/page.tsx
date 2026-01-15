import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";

export default async function Landing({ params }: { params: { slug: string } }) {
  const lp = await prisma.landingPage.findUnique({ where: { slug: params.slug } });
  if (!lp || lp.status !== "published") return notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:980}}>
            <h1>{lp.title}</h1>
          </div>
        </section>
        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:980}}>
            {lp.contentJson && lp.contentJson !== "[]" ? (
              <PageBuilderRenderer json={lp.contentJson} />
            ) : (
              <div className="rf-card rf-card--roomy">
                <div dangerouslySetInnerHTML={{ __html: lp.contentHtml }} />
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
