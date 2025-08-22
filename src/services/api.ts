/** @format */

import {
  getAccessToken,
  refreshToken as refreshAuthToken,
  logout as authLogout,
} from "./auth";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  LoginResponse,
  RefreshResponse,
  Tenant,
  User,
  Role,
  Plan,
  Invoice,
  Payment,
} from "@/types/api";

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
const API_PREFIX = "/api";

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
      errors: err,
    };
  }
}

export const api = {
  get: (path: string, options?: RequestInit) =>
    request(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestInit) =>
    request(path, { ...options, method: "POST", body }),
  put: (path: string, body?: any, options?: RequestInit) =>
    request(path, { ...options, method: "PUT", body }),
  delete: (path: string, options?: RequestInit) =>
    request(path, { ...options, method: "DELETE" }),
};

export function login(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.auth.login}`, payload);
}

export function refreshToken(payload: {
  refresh_token: string;
}): Promise<ApiResponse<RefreshResponse>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.auth.refresh}`, payload);
}

export function logout(): Promise<ApiResponse<any>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.auth.logout}`);
}

export function listTenants(
  params?: Record<string, string | number>
): Promise<ApiResponse<Tenant[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get(`${API_PREFIX}${API_ENDPOINTS.tenant.list}${query}`);
}

export function getTenantByDomain(
  domain: string
): Promise<ApiResponse<Tenant>> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.tenant.byDomain}?domain=${encodeURIComponent(
      domain
    )}`
  );
}

export function listUsers(
  params?: Record<string, string | number>
): Promise<ApiResponse<User[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get(`${API_PREFIX}${API_ENDPOINTS.users.list}${query}`);
}

export function createUser(payload: Partial<User>): Promise<ApiResponse<User>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.users.list}`, payload);
}

export function resetPassword(payload: {
  email: string;
}): Promise<ApiResponse<any>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.users.resetPassword}`, payload);
}

export function listRoles(): Promise<ApiResponse<Role[]>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.roles.list}`);
}

export function assignRole(
  userId: string | number,
  payload: { role_id: string | number; tenant_id?: string | number }
): Promise<ApiResponse<any>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}`, payload);
}

export function listVendorPlans(): Promise<ApiResponse<Plan[]>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.billing.vendor.plans}`);
}

export function listVendorInvoices(): Promise<ApiResponse<Invoice[]>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoices}`);
}

export function listClientInvoices(): Promise<ApiResponse<Invoice[]>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.billing.client.invoices}`);
}

export function createPayment(
  invoiceId: string | number,
  payload: Partial<Payment>
): Promise<ApiResponse<Payment>> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.invoice(invoiceId).payments}`,
    payload
  );
}

export default api;
