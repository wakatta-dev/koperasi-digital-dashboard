/** @format */

import { getSession, signIn, signOut } from "next-auth/react";
import { env } from "@/lib/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

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
  try {
    let rt: string | null = null;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )refresh_token=([^;]+)/);
      rt = match ? decodeURIComponent(match[1]) : null;
    } else {
      try {
        const { cookies } = await import("next/headers");
        rt = (await cookies()).get("refresh_token")?.value ?? null;
      } catch {
        rt = null;
      }
    }

    if (!rt) {
      const session: any = await getSession();
      rt = session?.refreshToken ?? null;
    }

    if (!rt) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: rt }),
      credentials: "include",
    });

    const json = await res.json().catch(() => null);
    const data = json?.data;
    if (!res.ok || !data?.access_token) return null;

    if (data.refresh_token) {
      if (typeof window !== "undefined") {
        document.cookie = `refresh_token=${data.refresh_token}; path=/`;
      } else {
        try {
          const { cookies } = await import("next/headers");
          (await cookies()).set("refresh_token", data.refresh_token, { path: "/" });
        } catch {
          /* noop */
        }
      }
    }

    return data.access_token as string;
  } catch {
    return null;
  }
}
