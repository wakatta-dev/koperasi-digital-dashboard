/** @format */

export function getNextAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not configured');
  }
  return secret;
}

export const NEXTAUTH_SECRET = getNextAuthSecret();

