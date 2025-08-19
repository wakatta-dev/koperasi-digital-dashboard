/** @format */

import { getSession, signIn, signOut } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).catch(() => null);
  await signOut({ redirect: false });
}

export async function getAccessToken(): Promise<string | null> {
  const session: any = await getSession();
  return session?.accessToken ?? null;
}

export async function refreshToken(): Promise<string | null> {
  const session: any = await getSession();
  return session?.accessToken ?? null;
}
