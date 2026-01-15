import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "published") return notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:860}}>
            <h1 style={{marginBottom:10}}>{post.title}</h1>
            {post.directAnswer ? (
              <div className="rf-card rf-card--tight" style={{marginTop:16}}>
                <div className="rf-card__meta" style={{marginBottom:6}}>Direct Answer</div>
                <p style={{margin:0}}>{post.directAnswer}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:860}}>
            <div className="rf-card rf-card--roomy">
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
