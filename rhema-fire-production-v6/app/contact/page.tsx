import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getPageBySlug } from "@/lib/pageData";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  return {
    title: page?.metaTitle || "Contact — Rhema Fire",
    description: page?.metaDesc || "Contact Rhema Fire",
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact");
  const hasBuilder = page?.contentJson && page.contentJson !== "[]";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>Contact</h1>
            <p>Ministry inquiries, support, and invitations.</p>
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
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16}}>
                <div className="rf-card rf-card--roomy">
                  <div className="rf-card__title">Contact Form</div>
                  <form action="/api/forms/contact" method="post">
                    <div className="rf-field">
                      <label className="rf-label">Name</label>
                      <input name="name" className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Email</label>
                      <input name="email" type="email" required className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Subject</label>
                      <input name="subject" className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Message</label>
                      <textarea name="message" required className="rf-textarea" rows={5} />
                    </div>
                    <button className="rf-btn rf-btn--primary" type="submit">Send</button>
                  </form>
                </div>

                <div className="rf-card rf-card--roomy">
                  <div className="rf-card__title">Invite Joshua</div>
                  <form action="/api/forms/invite" method="post">
                    <div className="rf-field">
                      <label className="rf-label">Church / Organization</label>
                      <input name="name" className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Email</label>
                      <input name="email" type="email" required className="rf-input" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">City / State</label>
                      <input name="subject" className="rf-input" placeholder="City, State" />
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">Details</label>
                      <textarea name="message" required className="rf-textarea" rows={5} />
                    </div>
                    <button className="rf-btn rf-btn--secondary" type="submit">Submit Request</button>
                  </form>
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
