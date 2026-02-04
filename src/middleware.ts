/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sessionCookieName } from "@/constants/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostHeader = request.headers.get("host") ?? "";
  const forwardedHost = request.headers.get("x-forwarded-host") ?? "";
  const rawHost = forwardedHost || hostHeader;
  // Keep port if present (e.g., localhost:3004); backend will normalize.
  const lookupHost = rawHost.split(",")[0]?.trim().toLowerCase() ?? "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const tenantCookie = request.cookies.get("tenantId")?.value;
  let tenantId = tenantCookie?.trim();
  let tenantResolved = Boolean(tenantId);
  let tenantLookupStatus:
    | "unattempted"
    | "resolved"
    | "not-found"
    | "invalid"
    | "error" = "unattempted";
  const isLanding = pathname === "/";
  const publicPrefixes = ["/penyewaan-aset", "/marketplace"];
  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  // lookup by domain kalau cookie kosong
  if (!tenantId && apiBase && lookupHost) {
    try {
      const res = await fetch(`${apiBase}/api/get-by-domain/${lookupHost}`, {
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
        tenantResolved = Boolean(tenantId);
        tenantLookupStatus = tenantResolved ? "resolved" : "invalid";
      } else if (res.status === 404) {
        tenantLookupStatus = "not-found";
      } else {
        tenantLookupStatus = "error";
      }
    } catch (err: any) {
      console.error("Tenant lookup failed:", err?.message);
      tenantLookupStatus = "error";
    }
  }

  const lookupFailed =
    tenantLookupStatus === "not-found" ||
    tenantLookupStatus === "invalid" ||
    tenantLookupStatus === "error";

  // helper: inject tenant ke response
  const withTenant = (res: NextResponse): NextResponse => {
    if (tenantResolved && tenantId) {
      res.headers.set("X-Tenant-ID", tenantId);
      res.cookies.set("tenantId", tenantId, { path: "/" });
    }
    return res;
  };

  const clearTenantCookie = (res: NextResponse): NextResponse => {
    if (tenantCookie || lookupFailed) {
      res.cookies.set("tenantId", "", { path: "/", maxAge: 0 });
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
  if (
    !tenantId &&
    pathname !== "/tenant-not-found" &&
    !isLanding &&
    !isPublic
  ) {
    const res = NextResponse.redirect(
      new URL("/tenant-not-found", request.url),
    );
    return clearTenantCookie(res);
  }

  // Public routes: allow through without auth checks
  if (isPublic) {
    return withTenant(NextResponse.next());
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
    pathname.startsWith(route),
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
        NextResponse.redirect(new URL(userDashboard, request.url)),
      );
    }
  }

  if (pathname === "/login" && token) {
    const userDashboard = `/${userRole}/dashboard`;
    return withTenant(
      NextResponse.redirect(new URL(userDashboard, request.url)),
    );
  }

  if (isLanding || isPublic) {
    if (token) {
      const userDashboard = `/${userRole}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url)),
      );
    }
    return withTenant(NextResponse.next());
  }

  return withTenant(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
