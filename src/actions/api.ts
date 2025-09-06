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
  let tenantId: string | undefined;
  try {
    tenantId = (await cookies()).get("tenantId")?.value;
  } catch {
    tenantId = undefined;
  }
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

  try {
    let res = await request(token);

    if (res.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        token = newToken;
        res = await request(token);
      } else {
        await logout();
        return {
          success: false,
          message: "Unauthorized",
          data: null as any,
          meta: {
            request_id: "",
            timestamp: new Date().toISOString(),
          } as any,
          errors: null,
        };
      }
    }

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

    if (!res.ok || !json) {
      const errorMessage =
        json?.message || res.statusText || "API request failed";
      return {
        success: false,
        message: errorMessage,
        data: null as any,
        meta:
          (json?.meta as any) ?? {
            request_id: "",
            timestamp: new Date().toISOString(),
          },
        errors: json?.errors ?? null,
      };
    }

    return json;
  } catch (err) {
    console.error("apiRequest error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "API request failed",
      data: null as any,
      meta: {
        request_id: "",
        timestamp: new Date().toISOString(),
      } as any,
      errors: null,
    };
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const json = await apiRequest<T>(endpoint, options);
  return json.success ? (json.data as T) : null;
}
