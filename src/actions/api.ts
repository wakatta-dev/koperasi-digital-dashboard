/** @format */

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const session = (await getServerSession(authOptions)) as any;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
    {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
        ...(options?.headers || {}),
      },
    }
  );

  const json = await res.json().catch(() => null);
  return json?.data;
}
