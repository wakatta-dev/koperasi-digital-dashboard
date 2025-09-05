import type { APIResponse, Rfc3339String } from './index';

export interface Role {
  id: number;
  name: string;
  jenis_tenant: string;
  description: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TenantRole {
  id: number;
  tenant_id: number;
  role_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface RoleUser {
  id: number;
  user_id: number;
  role_id: number;
  tenant_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface CasbinRule {
  id: number;
  p_type: string;
  v0?: string; v1?: string; v2?: string; v3?: string; v4?: string; v5?: string;
}

export interface CreateRoleRequest { name: string; description: string }
export interface UpdateRoleRequest { name: string; description: string }
export interface AssignRoleToTenantRequest { role_id: number; tenant_id: number }
export interface AssignRoleRequest { role_id: number; tenant_id: number }
export interface PermissionRequest { obj: string; act: string }

export type ListRolesResponse = APIResponse<Role[]>;
export type CreateRoleResponse = APIResponse<Role>;
export type UpdateRoleResponse = APIResponse<Role>;
export type DeleteRoleResponse = APIResponse<{ id: number }>;
export type AssignRoleToTenantResponse = APIResponse<TenantRole>;
export type ListPermissionsResponse = APIResponse<CasbinRule[]>;
export type AddPermissionResponse = APIResponse<{ obj: string; act: string }>;
export type DeletePermissionResponse = APIResponse<{ id: number }>;
export type ListUserRolesResponse = APIResponse<RoleUser[]>;
export type AssignUserRoleResponse = APIResponse<{ user_id: number; role_id: number }>;
export type DeleteUserRoleResponse = APIResponse<{ user_id: number; role_id: number }>;

