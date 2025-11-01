/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  VendorAccountInvitationRequest,
  VendorAccountInvitationResponse,
  VendorChangeEmailRequest,
  VendorDeactivatePayload,
  VendorDeactivateResult,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function confirmVendorEmailChange(
  token: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  const query = `?token=${encodeURIComponent(token)}`;
  return api.get<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.emailChangeConfirm}${query}`,
  );
}

export function inviteVendorTenantAccount(
  tenantId: string | number,
  payload: VendorAccountInvitationRequest,
): Promise<ApiResponse<VendorAccountInvitationResponse>> {
  const tenantValue =
    typeof payload.tenant_id !== "undefined"
      ? payload.tenant_id
      : Number.isNaN(Number(tenantId))
        ? tenantId
        : Number(tenantId);
  const body: VendorAccountInvitationRequest = {
    ...payload,
    tenant_id: tenantValue as number,
  };
  return api.post<VendorAccountInvitationResponse>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.tenantAccounts(tenantId)}`,
    body,
  );
}

export function requestVendorTenantEmailChange(
  tenantId: string | number,
  userId: string | number,
  payload: VendorChangeEmailRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.patch<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.tenantAccountEmail(tenantId, userId)}`,
    payload,
  );
}

export function deactivateVendorTenant(
  tenantId: string | number,
  payload: VendorDeactivatePayload,
): Promise<ApiResponse<VendorDeactivateResult>> {
  return api.post<VendorDeactivateResult>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.tenantDeactivate(tenantId)}`,
    payload,
  );
}
