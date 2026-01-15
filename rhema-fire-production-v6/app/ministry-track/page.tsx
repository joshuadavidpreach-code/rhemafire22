import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function MinistryTrack() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:980}}>
            <h1>Ministry Track</h1>
            <p style={{maxWidth:860}}>
              A two-year ordination pathway: structured courses, quizzes, exams, good-standing standards, and graduation review.
            </p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
              <Link className="rf-btn rf-btn--primary" href="/upgrade">Upgrade</Link>
              <Link className="rf-btn rf-btn--secondary" href="/start-here">Start Here</Link>
            </div>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">What you get</div>
              <ul style={{color:"var(--rf-text-muted)", margin:0, paddingLeft:18, display:"grid", gap:8}}>
                <li>Official exams + transcript record</li>
                <li>Term-by-term program map</li>
                <li>Standing requirements and review</li>
                <li>Ordination issuance upon completion (in good standing)</li>
              </ul>
            </div>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Who it’s for</div>
              <p>Those called to ministry who want structure, doctrine, and accountability — not hype.</p>
            </div>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Ready?</div>
              <p>Upgrade to unlock the official Track dashboard.</p>
              <Link className="rf-btn rf-btn--primary" href="/upgrade">Upgrade Now</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
