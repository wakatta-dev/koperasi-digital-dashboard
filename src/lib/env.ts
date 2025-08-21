/** @format */

/**
 * Centralized environment variables.
 * Provides a stable fallback secret in development to avoid
 * NextAuth decryption errors when `NEXTAUTH_SECRET` is missing.
 */
export const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "development_secret_change_me";

if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "NEXTAUTH_SECRET is not set. Using a fallback development secret."
  );
}
