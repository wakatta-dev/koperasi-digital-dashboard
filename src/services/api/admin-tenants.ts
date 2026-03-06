/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  AdminTenantDetailResponse,
  AdminTenantListResponse,
  AdminTenantProfileResponse,
  AdminTenantSubscriptionResponse,
  AdminTenantStatusResponse,
  AdminTenantUpdateProfileRequest,
  AdminTenantUpdateStatusRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

type AdminTenantListParams = {
  cursor?: string | number;
  limit?: number;
  search?: string;
  status?: string;
};

export function listAdminTenants(
  params?: AdminTenantListParams,
  opts?: { signal?: AbortSignal }
): Promise<AdminTenantListResponse> {
  const search = new URLSearchParams();
  if (typeof params?.cursor !== "undefined") {
    search.set("cursor", String(params.cursor));
  }
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.search) search.set("search", params.search);
  if (params?.status) search.set("status", params.status);
  const query = search.toString() ? `?${search.toString()}` : "";

  return api.get(`${API_PREFIX}${API_ENDPOINTS.adminTenants.list}${query}`, {
    signal: opts?.signal,
  });
}

export function getAdminTenantDetail(
  tenantId: string | number,
  params?: { cursor?: string | number; limit?: number },
  opts?: { signal?: AbortSignal }
): Promise<AdminTenantDetailResponse> {
  const search = new URLSearchParams();
  if (typeof params?.cursor !== "undefined") {
    search.set("cursor", String(params.cursor));
  }
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  const query = search.toString() ? `?${search.toString()}` : "";

  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.adminTenants.detail(tenantId)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function updateAdminTenantStatus(
  tenantId: string | number,
  payload: AdminTenantUpdateStatusRequest
): Promise<AdminTenantStatusResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.adminTenants.status(tenantId)}`,
    payload
  );
}

export function updateAdminTenantProfile(
  tenantId: string | number,
  payload: AdminTenantUpdateProfileRequest
): Promise<AdminTenantProfileResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.adminTenants.detail(tenantId)}`,
    payload
  );
}

export function getAdminTenantSubscription(
  tenantId: string | number,
  opts?: { signal?: AbortSignal }
): Promise<AdminTenantSubscriptionResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.adminTenants.subscription(tenantId)}`,
    {
      signal: opts?.signal,
    }
  );
}
