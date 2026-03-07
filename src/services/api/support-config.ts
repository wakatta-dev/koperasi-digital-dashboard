/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  SupportGlobalConfigResponse,
  SupportOperationalAssetRentalResponse,
  SupportOperationalMarketplaceAccountingResponse,
  SupportOperationalModulesResponse,
  SupportOperationalPreferencesResponse,
  SupportOperationalSettingsResponse,
  SupportSystemReadinessResponse,
  SupportProfileContactDomainResponse,
  SupportProfileIdentityResponse,
  SupportProfileSettingsResponse,
  SupportTenantConfigResponse,
  UpdateSupportOperationalAssetRentalRequest,
  UpdateSupportOperationalMarketplaceAccountingRequest,
  UpdateSupportOperationalModulesRequest,
  UpdateSupportOperationalPreferencesRequest,
  UpdateSupportProfileContactDomainRequest,
  UpdateSupportProfileIdentityRequest,
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

export function getSupportSystemReadiness(): Promise<SupportSystemReadinessResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.configReadiness}`,
  );
}

export function getSupportProfileSettings(): Promise<SupportProfileSettingsResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.configProfile}`,
  );
}

export function updateSupportProfileIdentity(
  payload: UpdateSupportProfileIdentityRequest
): Promise<SupportProfileIdentityResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configProfileIdentity}`,
    payload
  );
}

export function updateSupportProfileContactDomain(
  payload: UpdateSupportProfileContactDomainRequest
): Promise<SupportProfileContactDomainResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configProfileContactDomain}`,
    payload
  );
}

export function getSupportOperationalSettings(): Promise<SupportOperationalSettingsResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.configOperational}`,
  );
}

export function updateSupportOperationalPreferences(
  payload: UpdateSupportOperationalPreferencesRequest
): Promise<SupportOperationalPreferencesResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configOperationalPreferences}`,
    payload
  );
}

export function updateSupportOperationalModules(
  payload: UpdateSupportOperationalModulesRequest
): Promise<SupportOperationalModulesResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configOperationalModules}`,
    payload
  );
}

export function updateSupportOperationalAssetRental(
  payload: UpdateSupportOperationalAssetRentalRequest
): Promise<SupportOperationalAssetRentalResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configOperationalAssetRental}`,
    payload
  );
}

export function updateSupportOperationalMarketplaceAccounting(
  payload: UpdateSupportOperationalMarketplaceAccountingRequest
): Promise<SupportOperationalMarketplaceAccountingResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.configOperationalMarketplaceAccounting}`,
    payload
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
