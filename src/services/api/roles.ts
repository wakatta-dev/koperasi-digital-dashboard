/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Permission,
  Role,
  UserRole,
  TenantRole,
  CreateRoleRequest,
  AddPermissionResponse,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";

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
  payload: CreateRoleRequest,
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

export async function listRolePermissions(
  id: string | number,
  params?: { limit: number; cursor?: string },
): Promise<ApiResponse<Permission[]>> {
  let query = "";
  const final = {
    limit: params?.limit ?? 100,
    ...(params?.cursor ? { cursor: params.cursor } : {}),
  } as { limit: number; cursor?: string };
  if (typeof final.limit !== "undefined") {
    const search = new URLSearchParams({ limit: String(final.limit) });
    if (final.cursor) search.set("cursor", final.cursor);
    query = `?${search.toString()}`;
  }
  const res = await api.get<any>(
    `${API_PREFIX}${API_ENDPOINTS.roles.permissions(id)}${query}`,
  );
  // Normalize permission shape according to docs while preserving obj/act
  if (res?.success && Array.isArray(res.data)) {
    const mapped: Permission[] = (res.data as any[]).map((p: any) => {
      const obj = p.object ?? p.obj ?? p.v2 ?? "";
      const act = p.action ?? p.act ?? p.v3 ?? "";
      const role = p.role ?? p.v0;
      const domain = p.domain ?? p.v1;
      const permission = p.permission ?? (obj && act ? `${obj}:${act}` : "");
      const label = p.label ?? (permission || "");
      return {
        id: Number(p.id ?? 0),
        role,
        domain,
        object: obj,
        action: act,
        permission,
        label,
        obj,
        act,
      } as Permission;
    });
    return { ...res, data: mapped } as ApiResponse<Permission[]>;
  }
  return res as ApiResponse<Permission[]>;
}

export function addRolePermission(
  id: string | number,
  payload: { obj: string; act: string },
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

export async function assignRole(
  userId: string | number,
  payload: { role_id: string | number; tenant_id?: string | number },
): Promise<ApiResponse<{ user_id: number; role_id: number }>> {
  // Ensure tenant_id is sent per docs
  const final = { ...payload } as {
    role_id: string | number;
    tenant_id?: string | number;
  };
  if (typeof final.tenant_id === "undefined") {
    const tenantId = await getTenantId();
    if (tenantId) final.tenant_id = tenantId as any;
  }
  return api.post<{ user_id: number; role_id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}`,
    final,
  );
}

export function listUserRoles(
  userId: string | number,
  params?: { limit: number; cursor?: string },
): Promise<ApiResponse<UserRole[]>> {
  let query = "";
  const final = {
    limit: params?.limit ?? 100,
    ...(params?.cursor ? { cursor: params.cursor } : {}),
  } as { limit: number; cursor?: string };
  if (typeof final.limit !== "undefined") {
    const search = new URLSearchParams({ limit: String(final.limit) });
    if (final.cursor) search.set("cursor", final.cursor);
    query = `?${search.toString()}`;
  }
  return api.get<UserRole[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}${query}`,
  );
}

export function removeUserRole(
  userId: string | number,
  roleId: string | number,
): Promise<ApiResponse<{ user_id: number; role_id: number }>> {
  return api.delete<{ user_id: number; role_id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.users.role(userId, roleId)}`,
  );
}

export function assignRoleToTenant(
  payload: { role_id: number; tenant_id: number },
): Promise<ApiResponse<TenantRole>> {
  return api.post<TenantRole>(
    `${API_PREFIX}${API_ENDPOINTS.roles.tenants}`,
    payload,
  );
}
