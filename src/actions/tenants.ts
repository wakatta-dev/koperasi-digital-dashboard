/** @format */

"use server";

import { apiRequest } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import type { Tenant, User } from "@/lib/types";
import type { ApiResponse } from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listTenants as listTenantsService,
  getTenantByDomain,
} from "@/services/api";

export async function listTenants(params?: {
  limit?: number;
  cursor?: string;
}): Promise<ApiResponse<Tenant[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.tenant.list}?${search.toString()}`
    : API_ENDPOINTS.tenant.list;
  return apiRequest<Tenant[]>(endpoint);
}

export async function getTenant(
  id: string | number
): Promise<ApiResponse<Tenant>> {
  return apiRequest<Tenant>(API_ENDPOINTS.tenant.detail(id));
}

export async function createTenant(payload: {
  name: string;
  type: string;
  domain: string;
}): Promise<ApiResponse<Tenant>> {
  return apiRequest<Tenant>(API_ENDPOINTS.tenant.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTenant(
  id: string | number,
  payload: { name?: string; type?: string; domain?: string }
): Promise<ApiResponse<Tenant>> {
  return apiRequest<Tenant>(API_ENDPOINTS.tenant.detail(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateTenantStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<Tenant>> {
  return apiRequest<Tenant>(API_ENDPOINTS.tenant.status(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listTenantUsers(
  id: string | number
): Promise<ApiResponse<User[]>> {
  return apiRequest<User[]>(API_ENDPOINTS.tenant.users(id));
}

export async function addTenantUser(
  id: string | number,
  payload: {
    email: string;
    password: string;
    full_name: string;
    role_id: number;
  }
): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.tenant.users(id), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listTenantModules(
  id: string | number
): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(API_ENDPOINTS.tenant.modules(id));
}

export async function updateTenantModule(
  id: string | number,
  payload: { module_id: number; status: string }
): Promise<ApiResponse<any>> {
  return apiRequest<any>(API_ENDPOINTS.tenant.modules(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listTenantsAction(
  params?: Record<string, string | number>
) {
  const res = await listTenantsService(params);
  return ensureSuccess(res);
}

export type ListTenantsActionResult = Awaited<
  ReturnType<typeof listTenantsAction>
>;

export async function getTenantByDomainAction(domain: string) {
  const res = await getTenantByDomain(domain);
  return ensureSuccess(res);
}

export type GetTenantByDomainActionResult = Awaited<
  ReturnType<typeof getTenantByDomainAction>
>;
