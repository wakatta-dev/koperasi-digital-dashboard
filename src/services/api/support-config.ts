/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  SupportGlobalConfigResponse,
  SupportTenantConfigResponse,
  UpdateSupportTenantConfigRequest,
  UpdateSupportTenantConfigResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function getSupportGlobalConfig(): Promise<SupportGlobalConfigResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.configGlobal}`,
  );
}

export function getSupportTenantConfig(): Promise<SupportTenantConfigResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.configTenant}`,
  );
}

export function updateSupportTenantConfig(
  payload: UpdateSupportTenantConfigRequest
): Promise<UpdateSupportTenantConfigResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configTenant}`,
    payload
  );
}

