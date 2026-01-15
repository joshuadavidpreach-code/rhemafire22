import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function UpgradePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:980}}>
            <h1>Upgrade to Ministry Track</h1>
            <p>Unlock official exams, transcript tracking, standing, and the ordination pipeline.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:980}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Stripe Upgrade (Scaffold)</div>
              <p>
                This package includes the scaffold page and API endpoint placeholder. To activate billing,
                wire Stripe Checkout and webhooks to grant the <strong>MINISTRY_TRACK</strong> entitlement.
              </p>
              <div className="rf-divider" style={{margin:"18px 0"}} />
              <form action="/api/stripe/create-checkout-session" method="post">
                <button className="rf-btn rf-btn--primary" type="submit">Start Upgrade Checkout</button>
              </form>
              <p style={{marginTop:12, color:"var(--rf-text-dim)"}}>
                Developer note: set STRIPE_SECRET_KEY, STRIPE_PRICE_ID, and webhook endpoint to activate.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
