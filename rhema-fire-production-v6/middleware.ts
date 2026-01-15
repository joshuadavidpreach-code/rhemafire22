import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Legacy .html URL support (home.html, index.html, about.html, contact.html, blog.html)
  if (pathname.endsWith(".html")) {
    const url = req.nextUrl.clone();
    const clean = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    url.pathname = clean === "" ? "/" : clean;
    return NextResponse.redirect(url);
  }

  // Apply DB redirects via a simple static approach isn't possible at Edge.
  // Keep as-is; for production, use a redirect map or Vercel config.
  if (pathname.startsWith("/admin") || pathname.startsWith("/member")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Admin-only gate
    if (pathname.startsWith("/admin") && (token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/member", req.url));
    }

    // Add noindex headers for private routes
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
