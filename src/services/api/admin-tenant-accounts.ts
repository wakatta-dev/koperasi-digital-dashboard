/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  AdminTenantAccountChangeEmailRequest,
  AdminTenantAccountEmailChangeResponse,
  AdminTenantAccountInvitationRequest,
  AdminTenantAccountInvitationResponse,
  AdminTenantAccountListResponse,
  AdminTenantAccountPasswordResetResponse,
  AdminTenantAccountRoleRequest,
  AdminTenantAccountRoleResponse,
  AdminTenantAccountStatusRequest,
  AdminTenantAccountStatusResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

type AdminTenantAccountListParams = {
  cursor?: string | number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
};

export function listAdminTenantAccounts(
  tenantId: string | number,
  params?: AdminTenantAccountListParams,
  opts?: { signal?: AbortSignal }
): Promise<AdminTenantAccountListResponse> {
  const search = new URLSearchParams();
  if (typeof params?.cursor !== "undefined") {
    search.set("cursor", String(params.cursor));
  }
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.search) search.set("search", params.search);
  if (params?.status) search.set("status", params.status);
  if (params?.role) search.set("role", params.role);
  const query = search.toString() ? `?${search.toString()}` : "";

  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.list(tenantId)}${query}`,
    { signal: opts?.signal }
  );
}

export function inviteAdminTenantAccount(
  tenantId: string | number,
  payload: AdminTenantAccountInvitationRequest
): Promise<AdminTenantAccountInvitationResponse> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.create(tenantId)}`,
    payload
  );
}

export function requestAdminTenantAccountEmailChange(
  tenantId: string | number,
  userId: string | number,
  payload: AdminTenantAccountChangeEmailRequest
): Promise<AdminTenantAccountEmailChangeResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.email(tenantId, userId)}`,
    payload
  );
}

export function resetAdminTenantAccountPassword(
  tenantId: string | number,
  userId: string | number
): Promise<AdminTenantAccountPasswordResetResponse> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.resetPassword(
      tenantId,
      userId
    )}`
  );
}

export function updateAdminTenantAccountStatus(
  tenantId: string | number,
  userId: string | number,
  payload: AdminTenantAccountStatusRequest
): Promise<AdminTenantAccountStatusResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.status(tenantId, userId)}`,
    payload
  );
}

export function updateAdminTenantAccountRole(
  tenantId: string | number,
  userId: string | number,
  payload: AdminTenantAccountRoleRequest
): Promise<AdminTenantAccountRoleResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.adminTenantAccounts.role(tenantId, userId)}`,
    payload
  );
}
