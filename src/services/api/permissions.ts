/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  PermissionConfirmRequest,
  PermissionDefinition,
  PermissionSyncReport,
  PermissionSyncRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listPermissionRegistry(
  params?: { include_inactive?: boolean },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<PermissionDefinition[]>> {
  const search = new URLSearchParams();
  if (typeof params?.include_inactive !== "undefined") {
    search.set("include_inactive", String(params.include_inactive));
  }
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<PermissionDefinition[]>(
    `${API_PREFIX}${API_ENDPOINTS.permissions.registry}${query}`,
    { signal: opts?.signal },
  );
}

export function syncPermissionRegistry(
  payload: PermissionSyncRequest,
): Promise<ApiResponse<PermissionSyncReport>> {
  return api.post<PermissionSyncReport>(
    `${API_PREFIX}${API_ENDPOINTS.permissions.sync}`,
    payload,
  );
}

export function confirmPermissionDefinition(
  id: string | number,
  payload: PermissionConfirmRequest,
): Promise<ApiResponse<PermissionDefinition>> {
  return api.post<PermissionDefinition>(
    `${API_PREFIX}${API_ENDPOINTS.permissions.confirm(id)}`,
    payload,
  );
}
