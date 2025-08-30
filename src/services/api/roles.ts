/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Permission, Role, UserRole } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listRoles(
  params?: { limit: number; cursor?: string },
): Promise<ApiResponse<Role[]>> {
  let query = "";
  if (params && typeof params.limit !== "undefined") {
    const search = new URLSearchParams({ limit: String(params.limit) });
    if (params.cursor) search.set("cursor", params.cursor);
    query = `?${search.toString()}`;
  }
  return api.get<Role[]>(`${API_PREFIX}${API_ENDPOINTS.roles.list}${query}`);
}

export function createRole(
  payload: Partial<Role>,
): Promise<ApiResponse<Role>> {
  return api.post<Role>(
    `${API_PREFIX}${API_ENDPOINTS.roles.list}`,
    payload,
  );
}

export function updateRole(
  id: string | number,
  payload: Partial<Role>,
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

export function listRolePermissions(
  id: string | number,
): Promise<ApiResponse<Permission[]>> {
  return api.get<Permission[]>(
    `${API_PREFIX}${API_ENDPOINTS.roles.permissions(id)}`,
  );
}

export function addRolePermission(
  id: string | number,
  payload: { obj: string; act: string },
): Promise<ApiResponse<Permission>> {
  return api.post<Permission>(
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

export function assignRole(
  userId: string | number,
  payload: { role_id: string | number; tenant_id?: string | number },
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}`,
    payload,
  );
}

export function listUserRoles(
  userId: string | number,
): Promise<ApiResponse<UserRole[]>> {
  return api.get<UserRole[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}`,
  );
}

export function removeUserRole(
  userId: string | number,
  roleId: string | number,
): Promise<ApiResponse<{ id: number }>> {
  return api.delete<{ id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.users.role(userId, roleId)}`,
  );
}
