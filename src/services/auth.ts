/** @format */

import { getSession, signIn, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function login(email: string, password: string) {
  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  if (res?.error) {
    throw new Error(res.error);
  }
  return res;
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).catch(() => null);
  if (typeof window !== "undefined") {
    document.cookie =
      "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  await signOut({ callbackUrl: "/login" });
}

export async function getAccessToken(): Promise<string | null> {
  const session: any = await getSession();
  return session?.accessToken ?? null;
}

export async function refreshToken(): Promise<string | null> {
  const session: any = await getSession();
  return session?.accessToken ?? null;
}
