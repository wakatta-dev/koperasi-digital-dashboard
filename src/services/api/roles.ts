/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  AddPermissionResponse,
  ApiResponse,
  AssignRoleToTenantRequest,
  Permission,
  PermissionRequest,
  Role,
  RoleDiff,
  TenantRole,
  UpdateRoleRequest,
  CreateRoleRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

type ListRoleParams = {
  term?: string;
  permission?: string;
  limit?: number;
  cursor?: string;
};

export function listRoles(
  params?: ListRoleParams,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<Role[]>> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.permission) search.set("permission", params.permission);
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Role[]>(
    `${API_PREFIX}${API_ENDPOINTS.roles.list}${query}`,
    { signal: opts?.signal },
  );
}

export function createRole(
  payload: CreateRoleRequest,
): Promise<ApiResponse<Role>> {
  return api.post<Role>(
    `${API_PREFIX}${API_ENDPOINTS.roles.list}`,
    payload,
  );
}

export function updateRole(
  id: string | number,
  payload: UpdateRoleRequest,
): Promise<ApiResponse<Role>> {
  return api.put<Role>(
    `${API_PREFIX}${API_ENDPOINTS.roles.detail(id)}`,
    payload,
  );
}

export function deleteRole(
  id: string | number,
): Promise<ApiResponse<{ id: number }>> {
  return api.delete<{ id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.roles.detail(id)}`,
  );
}

export function getRoleDiff(
  id: string | number,
  params?: { from_version?: number; to_version?: string },
): Promise<ApiResponse<RoleDiff>> {
  const search = new URLSearchParams();
  if (typeof params?.from_version !== "undefined") {
    search.set("from_version", String(params.from_version));
  }
  if (params?.to_version) search.set("to_version", params.to_version);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<RoleDiff>(
    `${API_PREFIX}${API_ENDPOINTS.roles.diff(id)}${query}`,
  );
}

export function listRolePermissions(
  id: string | number,
  params?: { limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<Permission[]>> {
  const search = new URLSearchParams();
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Permission[]>(
    `${API_PREFIX}${API_ENDPOINTS.roles.permissions(id)}${query}`,
    { signal: opts?.signal },
  );
}

export function addRolePermission(
  id: string | number,
  payload: PermissionRequest,
): Promise<AddPermissionResponse> {
  return api.post<{ obj: string; act: string }>(
    `${API_PREFIX}${API_ENDPOINTS.roles.permissions(id)}`,
    payload,
  );
}

export function deleteRolePermission(
  roleId: string | number,
  permissionId: string | number,
): Promise<ApiResponse<{ id: number }>> {
  return api.delete<{ id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.roles.permission(roleId, permissionId)}`,
  );
}

export function assignRoleToTenant(
  payload: AssignRoleToTenantRequest,
): Promise<ApiResponse<TenantRole>> {
  return api.post<TenantRole>(
    `${API_PREFIX}${API_ENDPOINTS.roles.tenants}`,
    payload,
  );
}
