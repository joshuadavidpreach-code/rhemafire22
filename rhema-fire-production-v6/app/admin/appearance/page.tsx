import AdminShell from "@/components/AdminShell";
import { getSiteSettings, upsertSetting } from "@/lib/siteSettings";
import { revalidatePath } from "next/cache";

async function save(formData: FormData) {
  "use server";
  const fields = ["siteName","headerCtaText","headerCtaHref","footerText","copyrightText","blogSidebarHtml","optInEmbedHtml"];
  for (const key of fields) {
    await upsertSetting(key, String(formData.get(key) || ""));
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/media");
  revalidatePath("/courses");
  revalidatePath("/start-here");
  revalidatePath("/ministry-track");
  revalidatePath("/admin/appearance");
}

export default async function Appearance() {
  const s = await getSiteSettings();
  return (
    <AdminShell title="Appearance & Integrations">
      <p className="rf-card__meta">
        Edit header/footer, blog sidebar, and opt-in embed code (external autoresponder) or leave blank to use built-in opt-in.
      </p>
      <div className="rf-divider" style={{margin:"14px 0"}} />
      <form action={save} style={{display:"grid", gap:12, maxWidth:900}}>
        <div className="rf-field">
          <label className="rf-label">Site name</label>
          <input name="siteName" className="rf-input" defaultValue={s.siteName} />
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div className="rf-field">
            <label className="rf-label">Header CTA text</label>
            <input name="headerCtaText" className="rf-input" defaultValue={s.headerCtaText} />
          </div>
          <div className="rf-field">
            <label className="rf-label">Header CTA link</label>
            <input name="headerCtaHref" className="rf-input" defaultValue={s.headerCtaHref} />
          </div>
        </div>
        <div className="rf-field">
          <label className="rf-label">Footer text</label>
          <textarea name="footerText" className="rf-textarea" rows={3} defaultValue={s.footerText} />
        </div>
        <div className="rf-field">
          <label className="rf-label">Copyright line</label>
          <input name="copyrightText" className="rf-input" defaultValue={s.copyrightText} />
        </div>
        <div className="rf-field">
          <label className="rf-label">Blog sidebar HTML</label>
          <textarea name="blogSidebarHtml" className="rf-textarea" rows={8} defaultValue={s.blogSidebarHtml} />
        </div>
        <div className="rf-field">
          <label className="rf-label">Opt-in embed HTML (ConvertKit/MailerLite/etc.)</label>
          <textarea name="optInEmbedHtml" className="rf-textarea" rows={10} defaultValue={s.optInEmbedHtml} />
        </div>
        <button className="rf-btn rf-btn--primary" type="submit">Save</button>
      </form>
    </AdminShell>
  );
}
