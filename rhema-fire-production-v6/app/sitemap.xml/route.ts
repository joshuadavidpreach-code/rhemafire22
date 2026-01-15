import { prisma } from "@/lib/db";

function xml(urls: string[]) {
  const items = urls
    .map((u) => `<url><loc>${u}</loc></url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export async function GET(req: Request) {
  const base = process.env.NEXTAUTH_URL || "https://www.rhemafire.org";

  const posts = await prisma.post.findMany({ where: { status: "published" }, select: { slug: true } });
  const courses = await prisma.course.findMany({ where: { status: "published" }, select: { slug: true } });
  const lessons = await prisma.lesson.findMany({ where: { status: "published", previewEnabled: true, previewIndexable: true }, select: { slug: true, course: { select: { slug: true } } }, include: { course: { select: { slug: true } } } });
  const lps = await prisma.landingPage.findMany({ where: { status: "published" }, select: { slug: true } });

  const urls = [
    `${base}/`,
    `${base}/about`,
    `${base}/contact`,
    `${base}/blog`,
    `${base}/media`,
    `${base}/courses`,
    `${base}/start-here`,
    `${base}/free-book`,
    `${base}/ministry-track`,
  ];

  for (const p of posts) urls.push(`${base}/blog/${p.slug}`);
  for (const c of courses) urls.push(`${base}/courses/${c.slug}`);
  for (const l of lessons) urls.push(`${base}/courses/${l.course.slug}/lessons/${l.slug}`);
  for (const lp of lps) urls.push(`${base}/lp/${lp.slug}`);

  return new Response(xml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
