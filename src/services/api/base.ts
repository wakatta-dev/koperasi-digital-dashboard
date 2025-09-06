/** @format */

import {
  getAccessToken,
  refreshToken as refreshAuthToken,
  logout as authLogout,
} from "../auth";
import type { ApiResponse } from "@/types/api";

export async function getTenantId(): Promise<string | null> {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )tenantId=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  try {
    const { cookies } = await import("next/headers");
    return (await cookies()).get("tenantId")?.value ?? null;
  } catch {
    return null;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_PREFIX = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const tenantId = await getTenantId();
  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }

  let body = options.body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  try {
    let res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });

    if (res.status === 401) {
      const newToken = await refreshAuthToken();
      if (newToken) {
        accessToken = newToken;
        headers.set("Authorization", `Bearer ${accessToken}`);
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });
      } else {
        await authLogout();
      }
    }

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

    if (!res.ok || !json) {
      return {
        success: false,
        message: json?.message || res.statusText || "API request failed",
        data: null as any,
        meta: (json?.meta as any) ?? {
          request_id: "",
          timestamp: new Date().toISOString(),
        },
        errors: json?.errors ?? null,
      };
    }

    return json;
  } catch (err) {
    console.error("request error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "API request error",
      data: null as any,
      meta: {
        request_id: "",
        timestamp: new Date().toISOString(),
      } as any,
      errors: null,
    };
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export default api;
