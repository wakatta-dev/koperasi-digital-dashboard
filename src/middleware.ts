/** @format */

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   if (token && (pathname === "/" || pathname === "/login")) {
//     const role = (token as any).role;
//     const base =
//       role === "admin_user" ? "/admin-user/dashboard" : "/admin-owner/dashboard";
//     return NextResponse.redirect(new URL(base, req.url));
//   }

//   if (!token && pathname !== "/login") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token) {
//     const role = (token as any).role;
//     if (pathname.startsWith("/admin-user") && role !== "admin_user") {
//       return NextResponse.redirect(
//         new URL("/admin-owner/dashboard", req.url)
//       );
//     }
//     if (pathname.startsWith("/admin-owner") && role === "admin_user") {
//       return NextResponse.redirect(new URL("/admin-user/dashboard", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Resolve tenant ID from cookie or domain lookup
  const host = request.headers.get("host") ?? "";
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";

  let tenantId = request.cookies.get("tenantId")?.value;
  if (!tenantId && apiBase && host) {
    try {
      const res = await fetch(
        `${apiBase}/tenant/by-domain?domain=${host}`,
      );
      if (res.ok) {
        const { data } = await res.json();
        tenantId = String(data.tenant_id);
      }
    } catch {
      /* ignore lookup errors */
    }
  }

  // Prepare headers for downstream requests
  const headers = new Headers(request.headers);
  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    const res = NextResponse.next({ request: { headers } });
    if (tenantId) {
      res.cookies.set("tenantId", tenantId, { path: "/" });
    }
    return res;
  }

  // Get session from cookies
  const sessionCookie = request.cookies.get("auth-session");
  const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;

  // Define route groups and their required roles
  const routeRoleMap = {
    "/vendor": "vendor",
    "/koperasi": "koperasi",
    "/umkm": "umkm",
    "/bumdes": "bumdes",
  } as const;

  // Check if accessing a protected dashboard route
  const protectedRoute = Object.keys(routeRoleMap).find((route) =>
    pathname.startsWith(route),
  );

  const withTenant = (response: NextResponse): NextResponse => {
    if (tenantId) {
      response.headers.set("X-Tenant-ID", tenantId);
      response.cookies.set("tenantId", tenantId, { path: "/" });
    }
    return response;
  };

  if (protectedRoute) {
    // Redirect to login if no session
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return withTenant(NextResponse.redirect(loginUrl));
    }

    // Check if user has correct role for the route
    const requiredRole =
      routeRoleMap[protectedRoute as keyof typeof routeRoleMap];
    if (session.user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const userDashboard = `/${session.user.role}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url)),
      );
    }
  }

  // Redirect authenticated users from login page to their dashboard
  if (pathname === "/login" && session) {
    const userDashboard = `/${session.user.role}/dashboard`;
    return withTenant(NextResponse.redirect(new URL(userDashboard, request.url)));
  }

  // Redirect root path to login or user dashboard
  if (pathname === "/") {
    if (session) {
      const userDashboard = `/${session.user.role}/dashboard`;
      return withTenant(
        NextResponse.redirect(new URL(userDashboard, request.url)),
      );
    } else {
      return withTenant(NextResponse.redirect(new URL("/login", request.url)));
    }
  }

  return withTenant(NextResponse.next({ request: { headers } }));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
