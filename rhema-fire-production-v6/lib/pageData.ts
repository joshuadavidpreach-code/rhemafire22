import { prisma } from "@/lib/db";

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}
