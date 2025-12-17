/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sessionCookieName } from "@/constants/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  let tenantId = request.cookies.get("tenantId")?.value;
  const isLanding = pathname === "/";

  // lookup by domain kalau cookie kosong
  if (!tenantId && apiBase && host) {
    try {
      const res = await fetch(`${apiBase}/api/get-by-domain/${host}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const { data } = await res.json();
        const resolvedId =
          data?.tenant_id ?? data?.id ?? data?.tenantId ?? null;
        tenantId =
          resolvedId !== null && typeof resolvedId !== "undefined"
            ? String(resolvedId)
            : undefined;
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

  // jika sudah punya tenantId tapi berada di halaman tenant-not-found → redirect ke root
  if (tenantId && pathname === "/tenant-not-found") {
    return withTenant(NextResponse.redirect(new URL("/", request.url)));
  }

  // kalau masih nggak ketemu → redirect
  if (!tenantId && pathname !== "/tenant-not-found" && !isLanding) {
    return NextResponse.redirect(new URL("/tenant-not-found", request.url));
  }

  // cek token NextAuth dengan nama cookie yang di-kustom agar unik per aplikasi
  const isSecure =
    request.nextUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production";
  const cookieName = sessionCookieName(isSecure);
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
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

  if (isLanding) {
    if (token) {
      const userDashboard = `/${userRole}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url))
      );
    }
    return withTenant(NextResponse.next());
  }

  return withTenant(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
