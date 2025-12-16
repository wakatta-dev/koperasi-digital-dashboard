/** @format */

import {
  getAccessToken,
  refreshToken as refreshAuthToken,
  logout as authLogout,
} from "../auth";
import type { ApiResponse, Meta } from "@/types/api";

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

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
// Normalize base URL to avoid double /api prefixes
const STRIPPED = RAW_BASE_URL.replace(/\/+$/, "");
const BASE_URL = STRIPPED.endsWith("/api")
  ? STRIPPED.replace(/\/api$/, "")
  : STRIPPED;
export const API_PREFIX = "/api";

const MAX_CONCURRENT_REQUESTS = 5;
const RATE_LIMIT_MAX_RETRIES = 3;
const RATE_LIMIT_BASE_DELAY_MS = 750;

const requestQueue: Array<() => void> = [];
let activeRequests = 0;

async function acquireRequestSlot(): Promise<void> {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise<void>((resolve) => {
      requestQueue.push(resolve);
    });
  }
  activeRequests += 1;
}

function releaseRequestSlot() {
  activeRequests = Math.max(0, activeRequests - 1);
  const next = requestQueue.shift();
  if (next) {
    // Allow the queued requester to continue while keeping the counter accurate
    next();
  }
}

async function limitedFetch(url: string, init: RequestInit): Promise<Response> {
  await acquireRequestSlot();
  try {
    return await fetch(url, init);
  } finally {
    releaseRequestSlot();
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const seconds = Number(header);
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return seconds * 1000;
  }
  const timestamp = Date.parse(header);
  if (!Number.isNaN(timestamp)) {
    const delta = timestamp - Date.now();
    return delta > 0 ? delta : null;
  }
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const tenantId = (await getTenantId()) || process.env.NEXT_PUBLIC_TENANT_ID || "";
  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }
  // Ensure content negotiation per docs
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let body = options.body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  let retries = 0;
  let authRetried = false;

  while (true) {
    let res: Response;
    try {
      res = await limitedFetch(`${BASE_URL}${path}`, { ...options, headers, body });
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

    if (res.status === 401 && !authRetried) {
      const newToken = await refreshAuthToken();
      if (newToken) {
        accessToken = newToken;
        headers.set("Authorization", `Bearer ${accessToken}`);
        authRetried = true;
        continue;
      }
      await authLogout();
    }

    if (res.status === 429) {
      if (retries < RATE_LIMIT_MAX_RETRIES) {
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        const fallbackDelay = RATE_LIMIT_BASE_DELAY_MS * (retries + 1);
        await wait(retryAfterMs ?? fallbackDelay);
        retries += 1;
        continue;
      }

      const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
      const meta: Meta =
        (json?.meta as Meta | undefined) ?? {
          request_id: res.headers.get("x-request-id") ?? "",
          timestamp: new Date().toISOString(),
        };

      return {
        success: false,
        message: json?.message || "API rate limit exceeded",
        data: null as any,
        meta,
        errors: json?.errors ?? null,
      };
    }

    if (res.status === 204) {
      const meta: Meta = {
        request_id: res.headers.get("x-request-id") ?? "",
        timestamp: new Date().toISOString(),
      };
      return {
        success: true,
        message: res.statusText || "No Content",
        data: null,
        meta,
        errors: null,
      };
    }

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

    if (!res.ok || !json) {
      return {
        success: false,
        message: json?.message || res.statusText || "API request failed",
        data: null as any,
        meta: (json?.meta as any) ?? {
          request_id: res.headers.get("x-request-id") ?? "",
          timestamp: new Date().toISOString(),
        },
        errors: json?.errors ?? null,
      };
    }

    return json;
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
