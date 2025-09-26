/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Tenant,
  TenantDetail,
  TenantListResponse,
  TenantDetailResponse,
  TenantUser,
  TenantUserListResponse,
  TenantModule,
  TenantModuleListResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantStatusRequest,
  AddTenantUserRequest,
  UpdateTenantModuleRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listTenants(
  params?: {
    term?: string;
    type?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<TenantListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.type) search.set("type", params.type);
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  return api.get<TenantDetail[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.list}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function getTenantByDomain(domain: string): Promise<ApiResponse<Tenant>> {
  return api.get<Tenant>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.byDomain}?domain=${encodeURIComponent(
      domain,
    )}`,
  );
}

export function getTenant(
  id: string | number,
  opts?: { signal?: AbortSignal }
): Promise<TenantDetailResponse> {
  return api.get<TenantDetail>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.detail(id)}`,
    { signal: opts?.signal }
  );
}

export function createTenant(
  payload: CreateTenantRequest,
): Promise<TenantDetailResponse> {
  return api.post<TenantDetail>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.list}`,
    payload,
  );
}

export function updateTenant(
  id: string | number,
  payload: Partial<UpdateTenantRequest>,
): Promise<TenantDetailResponse> {
  return api.patch<TenantDetail>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.detail(id)}`,
    payload,
  );
}

export function updateTenantStatus(
  id: string | number,
  payload: UpdateTenantStatusRequest,
): Promise<TenantDetailResponse> {
  return api.patch<TenantDetail>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.status(id)}`,
    payload,
  );
}

export function listTenantUsers(
  id: string | number,
  params?: {
    term?: string;
    role?: string | number;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<TenantUserListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.role) search.set("role", String(params.role));
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  return api.get<TenantUser[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.users(id)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function addTenantUser(
  id: string | number,
  payload: AddTenantUserRequest,
): Promise<ApiResponse<TenantUser>> {
  return api.post<TenantUser>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.users(id)}`,
    payload,
  );
}

export function listTenantModules(
  id: string | number,
  params?: {
    term?: string;
    enabled?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<TenantModuleListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.enabled) search.set("enabled", params.enabled);
  const q = search.toString();
  return api.get<TenantModule[]>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.modules(id)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function updateTenantModule(
  id: string | number,
  payload: { module_id: string | number; status: "aktif" | "nonaktif" }
): Promise<ApiResponse<TenantModule>> {
  const mapped: UpdateTenantModuleRequest = {
    module_id: String(payload.module_id),
    status: payload.status,
  };
  return api.patch<TenantModule>(
    `${API_PREFIX}${API_ENDPOINTS.tenant.modules(id)}`,
    mapped,
  );
}
