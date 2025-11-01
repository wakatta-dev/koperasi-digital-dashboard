/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  AuditLogQuery,
  RegisterTenantRequest,
  TenantAuditLogResponse,
  TenantConfiguration,
  TenantConfigurationRequest,
  TenantProfile,
  TenantStatusRequest,
  TenantStatusResponse,
  VerifyTenantRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function registerTenant(
  payload: RegisterTenantRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.register}`,
    payload,
  );
}

export function verifyTenant(
  payload: VerifyTenantRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.verify}`,
    payload,
  );
}

export function updateTenantStatus(
  tenantId: string | number,
  payload: TenantStatusRequest,
): Promise<TenantStatusResponse> {
  return api.patch<Record<string, string | boolean>>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.status(tenantId)}`,
    payload,
  );
}

export function getTenantAuditLogs(
  tenantId: string | number,
  params?: AuditLogQuery,
  opts?: { signal?: AbortSignal },
): Promise<TenantAuditLogResponse> {
  const search = new URLSearchParams();
  if (params?.cursor) search.set("cursor", String(params.cursor));
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (typeof params?.actor_id !== "undefined") {
    search.set("actor_id", String(params.actor_id));
  }
  if (typeof params?.target_tenant_id !== "undefined") {
    search.set("target_tenant_id", String(params.target_tenant_id));
  }
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.auditLogs(tenantId)}${query}`,
    { signal: opts?.signal },
  );
}

export function getTenantConfiguration(
  tenantId: string | number,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<TenantConfiguration>> {
  return api.get<TenantConfiguration>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.configuration(tenantId)}`,
    { signal: opts?.signal },
  );
}

export function upsertTenantConfiguration(
  tenantId: string | number,
  payload: TenantConfigurationRequest,
): Promise<ApiResponse<TenantConfiguration>> {
  return api.put<TenantConfiguration>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.configuration(tenantId)}`,
    payload,
  );
}

export function deleteTenantConfiguration(
  tenantId: string | number,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.delete<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.configuration(tenantId)}`,
  );
}

export function updateTenantProfile(
  tenantId: string | number,
  payload: FormData,
): Promise<ApiResponse<TenantProfile>> {
  return api.put<TenantProfile>(
    `${API_PREFIX}${API_ENDPOINTS.tenants.profile(tenantId)}`,
    payload,
    {
      // Let browser set multipart boundaries automatically
      headers: { Accept: "application/json" },
    },
  );
}

export function getTenantByDomain(
  domain: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.get<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.domain.byDomain(domain)}`,
  );
}
