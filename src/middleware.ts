import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (token && (pathname === "/" || pathname === "/login")) {
    const role = (token as any).role;
    const base =
      role === "admin_user" ? "/admin-user/dashboard" : "/admin-owner/dashboard";
    return NextResponse.redirect(new URL(base, req.url));
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    const role = (token as any).role;
    if (pathname.startsWith("/admin-user") && role !== "admin_user") {
      return NextResponse.redirect(
        new URL("/admin-owner/dashboard", req.url)
      );
    }
    if (pathname.startsWith("/admin-owner") && role === "admin_user") {
      return NextResponse.redirect(new URL("/admin-user/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};

