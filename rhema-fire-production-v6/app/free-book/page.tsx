import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function FreeBookPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>Get the Free Book</h1>
            <p style={{maxWidth:760}}>
              Get a free copy in exchange for your email. After you opt in, you’ll receive the download and a 10-email discipleship drip.
            </p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:760}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Send it to me</div>
              <form action="/api/optin" method="post">
                <div className="rf-field">
                  <label className="rf-label">First name</label>
                  <input name="firstName" className="rf-input" />
                </div>
                <div className="rf-field">
                  <label className="rf-label">Email</label>
                  <input name="email" type="email" required className="rf-input" />
                </div>
                <input type="hidden" name="source" value="free-book-page" />
                <button className="rf-btn rf-btn--primary" type="submit">Send Me the Book</button>
              </form>
              <p style={{marginTop:12, color:"var(--rf-text-dim)"}}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
