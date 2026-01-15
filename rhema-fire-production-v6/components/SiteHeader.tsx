import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function SiteHeader() {
  const s = await getSiteSettings();
  return (
    <header className="rf-header rf-atmosphere">
      <div className="rf-container rf-header__inner">
        <Link className="rf-logo" href="/">
          <span style={{display:"inline-block", width:10, height:10, borderRadius:999, background:"var(--rf-accent)"}} />
          <span>{s.siteName}</span>
        </Link>
        <nav className="rf-nav">
          <Link href="/blog">Blog</Link>
          <Link href="/media">Media</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/free-book" className="rf-btn rf-btn--secondary" style={{padding:"10px 14px"}}>Free Book</Link>
          <Link href={s.headerCtaHref} className="rf-btn rf-btn--primary" style={{padding:"10px 14px"}}>{s.headerCtaText}</Link>
        </nav>
      </div>
    </header>
  );
}
