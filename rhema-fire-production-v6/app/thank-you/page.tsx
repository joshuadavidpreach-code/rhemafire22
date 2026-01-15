import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function ThankYou() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:820}}>
            <h1>Check your email</h1>
            <p>Your free book is on the way. Next: create your free member account and start the teachings.</p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
              <Link className="rf-btn rf-btn--primary" href="/login">Join Free</Link>
              <Link className="rf-btn rf-btn--secondary" href="/courses">Browse Courses</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
