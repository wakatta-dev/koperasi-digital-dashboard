/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Tenant, User } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listTenants(
  params?: Record<string, string | number>,
): Promise<ApiResponse<Tenant[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<Tenant[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.list}${query}`,
  );
}

export function getTenantByDomain(domain: string): Promise<ApiResponse<Tenant>> {
  return api.get<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.byDomain}?domain=${encodeURIComponent(
      domain,
    )}`,
  );
}

export function getTenant(id: string | number): Promise<ApiResponse<Tenant>> {
  return api.get<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.detail(id)}`,
  );
}

export function createTenant(
  payload: Partial<Tenant>,
): Promise<ApiResponse<Tenant>> {
  return api.post<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.list}`,
    payload,
  );
}

export function updateTenant(
  id: string | number,
  payload: Partial<Tenant>,
): Promise<ApiResponse<Tenant>> {
  return api.patch<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.detail(id)}`,
    payload,
  );
}

export function updateTenantStatus(
  id: string | number,
  payload: { status: string },
): Promise<ApiResponse<Tenant>> {
  return api.patch<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.status(id)}`,
    payload,
  );
}

export function listTenantUsers(
  id: string | number,
  params?: Record<string, string | number>,
): Promise<ApiResponse<User[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<User[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.users(id)}${query}`,
  );
}

export function addTenantUser(
  id: string | number,
  payload: Partial<User> & { role_id?: number; password?: string },
): Promise<ApiResponse<User>> {
  return api.post<User>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.users(id)}`,
    payload,
  );
}

export function listTenantModules(
  id: string | number,
  params?: Record<string, string | number>,
): Promise<ApiResponse<any[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<any[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.modules(id)}${query}`,
  );
}

export function updateTenantModule(
  id: string | number,
  payload: { module_id: number; status: string },
): Promise<ApiResponse<any>> {
  return api.patch<any>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.modules(id)}`,
    payload,
  );
}
