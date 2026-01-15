import Link from "next/link";

export default function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{minHeight:"100vh", background:"var(--rf-deep)"}}>
      <header className="rf-header">
        <div className="rf-container rf-header__inner">
          <div className="rf-logo">
            <span style={{display:"inline-block", width:10, height:10, borderRadius:999, background:"var(--rf-accent)"}} />
            <span>Rhema Fire Admin</span>
          </div>
          <nav className="rf-nav">
            <Link href="/">View Site</Link>
            <Link href="/admin" className="rf-btn rf-btn--secondary" style={{padding:"10px 14px"}}>Dashboard</Link>
          </nav>
        </div>
      </header>

      <div className="rf-container" style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:16, padding:"18px 0"}}>
        <aside className="rf-card rf-card--tight" style={{position:"sticky", top:92, height:"fit-content"}}>
          <div className="rf-card__title" style={{marginBottom:12}}>Menu</div>
          <div style={{display:"grid", gap:8}}>
            <Link href="/admin/pages">Pages</Link>
            <Link href="/admin/page-builder/home">Page Builder</Link>
            <Link href="/admin/blog">Blog</Link>
            <Link href="/admin/courses">Courses</Link>
            <Link href="/admin/lessons">Lessons</Link>
            <Link href="/admin/seo/redirects">Redirects</Link>
            <Link href="/admin/appearance">Appearance</Link>
            <Link href="/admin/landing-pages">Landing Pages</Link>
            <Link href="/admin/autoresponder">Autoresponder</Link>
            <Link href="/admin/settings">Settings</Link>
          </div>
          <div className="rf-divider" style={{margin:"14px 0"}} />
          <div className="rf-card__meta">Private routes are noindexed automatically.</div>
        </aside>

        <section className="rf-card rf-card--roomy">
          <div className="rf-card__title">{title}</div>
          {children}
        </section>
      </div>
    </div>
  );
}
