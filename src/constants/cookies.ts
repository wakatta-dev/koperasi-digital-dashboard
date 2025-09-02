/** @format */

// Centralized cookie names/prefix for NextAuth
export const APP_COOKIE_BASE = "kdd.next-auth"; // kdd = Koperasi Digital Dashboard

// Determine if cookies must be secure based on env
export function isSecureCookies(): boolean {
  return (
    (process.env.NEXTAUTH_URL?.startsWith("https://") ?? false) ||
    process.env.NODE_ENV === "production"
  );
}

// Build session cookie name with optional secure override.
// When `secure` is undefined, it derives from environment via isSecureCookies().
export function sessionCookieName(secure?: boolean): string {
  const useSecure = typeof secure === "boolean" ? secure : isSecureCookies();
  return `${useSecure ? "__Secure-" : ""}${APP_COOKIE_BASE}.session-token`;
}

export const CSRF_COOKIE_NAME = `${APP_COOKIE_BASE}.csrf-token`;

