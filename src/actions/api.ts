/** @format */
"use server";

import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/authOptions";
import type { ApiResponse } from "@/types/api";
import { UserSession } from "@/types/session";
import { refreshToken, logout } from "@/services/auth";

export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const session = (await getServerSession(authOptions)) as UserSession;
  const tenantId = (await cookies()).get("tenantId")?.value;
  let token = session?.accessToken;

  const request = async (access?: string) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...(tenantId ? { "X-Tenant-ID": tenantId } : {}),
        ...(options?.headers || {}),
      },
    });

  let res = await request(token);

  if (res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      token = newToken;
      res = await request(token);
    } else {
      await logout();
      const error: any = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  }

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
