import { prisma } from "./db";

export type SiteSettings = {
  siteName: string;
  headerCtaText: string;
  headerCtaHref: string;
  footerText: string;
  copyrightText: string;
  blogSidebarHtml: string;
  optInEmbedHtml: string; // external autoresponder embed code (optional)
};

const defaults: SiteSettings = {
  siteName: "Rhema Fire",
  headerCtaText: "Join Free",
  headerCtaHref: "/register",
  footerText: "Premium ministry platform — Word-anchored, Spirit-led, built for reach and discipleship.",
  copyrightText: `© ${new Date().getFullYear()} Rhema Fire`,
  blogSidebarHtml: "<p><strong>Start Here</strong><br/>Get the free book and join the course library.</p>",
  optInEmbedHtml: "" // if empty, use built-in opt-in form
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    siteName: map.siteName || defaults.siteName,
    headerCtaText: map.headerCtaText || defaults.headerCtaText,
    headerCtaHref: map.headerCtaHref || defaults.headerCtaHref,
    footerText: map.footerText || defaults.footerText,
    copyrightText: map.copyrightText || defaults.copyrightText,
    blogSidebarHtml: map.blogSidebarHtml || defaults.blogSidebarHtml,
    optInEmbedHtml: map.optInEmbedHtml || defaults.optInEmbedHtml,
  };
}

export async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
