import { getSiteSettings } from "@/lib/siteSettings";

export default async function SiteFooter() {
  const s = await getSiteSettings();
  return (
    <footer className="rf-section rf-section--deep rf-atmosphere">
      <div className="rf-grain" />
      <div className="rf-container">
        <div className="rf-divider" style={{marginBottom:18}} />
        <div style={{display:"flex", justifyContent:"space-between", gap:24, flexWrap:"wrap"}}>
          <div>
            <div className="rf-logo" style={{marginBottom:10}}>
              <span style={{display:"inline-block", width:10, height:10, borderRadius:999, background:"var(--rf-accent)"}} />
              <span>{s.siteName}</span>
            </div>
            <p style={{maxWidth:520}}>{s.footerText}</p>
          </div>
          <div style={{display:"grid", gap:8}}>
            <a href="/blog">Blog</a>
            <a href="/media">Media</a>
            <a href="/courses">Courses</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
        <p style={{marginTop:18, color:"var(--rf-text-dim)"}}>{s.copyrightText}</p>
      </div>
    </footer>
  );
}
