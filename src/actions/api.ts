/** @format */
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { ApiResponse } from "@/types/api";
import { UserSession } from "@/types/session";

export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const session = (await getServerSession(authOptions)) as UserSession;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...(session.user?.id
        ? { "X-Tenant-ID": session.user?.id.toString() }
        : {}),
      ...(options?.headers || {}),
    },
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<T>;

  if (!res.ok) {
    const error: any = new Error(json?.message || res.statusText);
    error.status = res.status;
    throw error;
  }

  return json;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const json = await apiRequest<T>(endpoint, options);
  if (!json?.success) {
    throw new Error(json?.message || "API request failed");
  }
  return json.data as T;
}
