/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  RegisterTenantRequest,
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
