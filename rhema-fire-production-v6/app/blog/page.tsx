import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function BlogIndex() {
  const s = await getSiteSettings();
  const posts = await prisma.post.findMany({ where: { status: "published" }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>The Blog</h1>
            <p>Biblical clarity. Spirit-led power. Sound doctrine.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{display:"grid", gridTemplateColumns:"1fr 340px", gap:16}}>
            <div style={{display:"grid", gap:16}}>
              {posts.map((p) => (
                <div key={p.id} className="rf-card rf-card--roomy">
                  <div className="rf-card__title">{p.title}</div>
                  <p>{p.excerpt}</p>
                  <Link className="rf-btn rf-btn--secondary" href={`/blog/${p.slug}`}>Read</Link>
                </div>
              ))}
            </div>

            <aside style={{display:"grid", gap:16, height:"fit-content", position:"sticky", top:92}}>
              <div className="rf-card rf-card--roomy">
                <div className="rf-card__title">Sidebar</div>
                <div dangerouslySetInnerHTML={{ __html: s.blogSidebarHtml }} />
              </div>

              <div className="rf-card rf-card--roomy">
                <div className="rf-card__title">Free Book</div>
                {s.optInEmbedHtml?.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: s.optInEmbedHtml }} />
                ) : (
                  <form action="/api/optin" method="post">
                    <div className="rf-field">
                      <label className="rf-label">First name</label>
                      <input name="firstName" className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Email</label>
                      <input name="email" type="email" required className="rf-input" />
                    </div>
                    <input type="hidden" name="source" value="blog-sidebar" />
                    <button className="rf-btn rf-btn--primary" type="submit">Send Me the Book</button>
                  </form>
                )}
                <p style={{marginTop:12, color:"var(--rf-text-dim)"}}>Admin → Appearance lets you paste external autoresponder HTML.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
