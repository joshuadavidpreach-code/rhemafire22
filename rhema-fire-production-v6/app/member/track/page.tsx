import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

async function hasTrack(userEmail: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail }, include: { entitlements: { include: { tier: true } } } });
  if (!user) return false;
  return user.entitlements.some((e) => e.active && e.tier.code === "MINISTRY_TRACK");
}

export default async function TrackPage() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;

  if (!email) {
    return (
      <>
        <SiteHeader />
        <main className="rf-section rf-section--deep">
          <div className="rf-container">
            <h1>Ministry Track</h1>
            <p>Please log in.</p>
            <Link className="rf-btn rf-btn--primary" href="/login">Log in</Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const ok = await hasTrack(email);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container">
            <h1>Ministry Track</h1>
            <p>Official ordination pathway: exams, transcript, standing, and graduation review.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:980}}>
            {ok ? (
              <div className="rf-card rf-card--roomy">
                <div className="rf-card__title">Track Dashboard (Scaffold)</div>
                <p>This is the scaffold area. Next build step: terms, exams, transcript, standing, and ordination review.</p>
                <div className="rf-divider" style={{margin:"18px 0"}} />
                <div style={{display:"grid", gap:10}}>
                  <div className="rf-card rf-card--tight"><strong>Term Progress</strong><div className="rf-card__meta">Coming next</div></div>
                  <div className="rf-card rf-card--tight"><strong>Exams</strong><div className="rf-card__meta">Coming next</div></div>
                  <div className="rf-card rf-card--tight"><strong>Transcript</strong><div className="rf-card__meta">Coming next</div></div>
                  <div className="rf-card rf-card--tight"><strong>Ordination Review</strong><div className="rf-card__meta">Coming next</div></div>
                </div>
              </div>
            ) : (
              <div className="rf-card rf-card--roomy">
                <div className="rf-card__title">Upgrade Required</div>
                <p>You have free member access. Upgrade to Ministry Track to unlock official exams and ordination pathway.</p>
                <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
                  <Link className="rf-btn rf-btn--primary" href="/upgrade">Upgrade to Ministry Track</Link>
                  <Link className="rf-btn rf-btn--secondary" href="/member">Back to Member Dashboard</Link>
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
