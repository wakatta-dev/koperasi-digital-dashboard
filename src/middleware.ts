/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  let tenantId = request.cookies.get("tenantId")?.value;

  // lookup by domain kalau cookie kosong
  if (!tenantId && apiBase && host) {
    try {
      const res = await fetch(
        `${apiBase}/api/tenant/by-domain?domain=${host}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const { data } = await res.json();
        tenantId = data?.tenant_id ? String(data.tenant_id) : undefined;
      }
    } catch (err: any) {
      console.error("Tenant lookup failed:", err?.message);
    }
  }

  // helper: inject tenant ke response
  const withTenant = (res: NextResponse): NextResponse => {
    if (tenantId) {
      res.headers.set("X-Tenant-ID", tenantId);
      res.cookies.set("tenantId", tenantId, { path: "/" });
    }
    return res;
  };

  // skip static & api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return withTenant(NextResponse.next());
  }

  // kalau masih nggak ketemu → redirect
  if (!tenantId && pathname !== "/tenant-not-found") {
    return NextResponse.redirect(new URL("/tenant-not-found", request.url));
  }

  // cek token NextAuth
  // Ensure we read the correct cookie name in production ("__Secure-")
  // This avoids login loops on HTTPS (e.g., Vercel) where cookies are secure.
  const isSecure =
    request.nextUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production";
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });
  const userRole = (token as any)?.jenis_tenant;

  const routeRoleMap = {
    "/vendor": "vendor",
    "/koperasi": "koperasi",
    "/umkm": "umkm",
    "/bumdes": "bumdes",
  } as const;

  const protectedRoute = Object.keys(routeRoleMap).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return withTenant(NextResponse.redirect(loginUrl));
    }

    const requiredRole =
      routeRoleMap[protectedRoute as keyof typeof routeRoleMap];
    if (userRole !== requiredRole) {
      const userDashboard = `/${userRole}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url))
      );
    }
  }

  if (pathname === "/login" && token) {
    const userDashboard = `/${userRole}/dashboard`;
    return withTenant(
      NextResponse.redirect(new URL(userDashboard, request.url))
    );
  }

  if (pathname === "/") {
    if (token) {
      const userDashboard = `/${userRole}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url))
      );
    }
    return withTenant(NextResponse.redirect(new URL("/login", request.url)));
  }

  return withTenant(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
