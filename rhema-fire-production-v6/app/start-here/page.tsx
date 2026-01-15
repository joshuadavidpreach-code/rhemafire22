import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function StartHere() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:980}}>
            <h1>Start Here</h1>
            <p style={{maxWidth:820}}>
              If you’re new, coming back to Jesus, or ready to get serious — this is your path.
            </p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
              <Link className="rf-btn rf-btn--primary" href="/free-book">Get the Free Book</Link>
              <Link className="rf-btn rf-btn--secondary" href="/courses">Browse Courses</Link>
              <Link className="rf-btn rf-btn--secondary" href="/register">Join Free</Link>
            </div>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Step 1</div>
              <p><strong>Get the Free Book</strong> and lock in the foundation.</p>
            </div>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Step 2</div>
              <p><strong>Join Free</strong> to access full lessons and the media vault.</p>
            </div>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Step 3</div>
              <p><strong>Ministry Track</strong> (optional) for exams, transcript, and ordination pipeline.</p>
              <Link className="rf-btn rf-btn--secondary" href="/ministry-track">Learn More</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
