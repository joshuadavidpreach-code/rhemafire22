import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function MemberDashboard() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--deep">
          <div className="rf-container">
            <h1>Member Dashboard</h1>
            <p>Member portal scaffold. Extend: courses, progress, community, Ministry Track.</p>
            <div className="rf-divider" style={{margin:"18px 0"}} />
            <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
              <a className="rf-btn rf-btn--secondary" href="/member/track">Ministry Track</a>
              <a className="rf-btn rf-btn--secondary" href="/courses">Browse Courses</a>
            </div>
            <a className="rf-btn rf-btn--secondary" href="/admin">If you’re Admin, open the dashboard</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
