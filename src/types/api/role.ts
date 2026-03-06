/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export interface Role {
  id: number;
  name: string;
  jenis_tenant: string;
  description: string;
  display_name?: string;
  is_active?: boolean;
  is_custom?: boolean;
  scope_tenant_id?: number;
  is_protected?: boolean;
  is_editable?: boolean;
  is_deletable?: boolean;
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

// Permission entity aligned to docs/modules/authorization.md
// Notes:
// - Backend may currently return { obj, act } fields. To keep UI stable,
//   we include optional obj/act while also exposing normalized object/action.
export interface Permission {
  id: number;
  role?: string;
  domain?: string;
  alias: string;
  label: string;
  description?: string;
  obj?: string;
  act?: string;
  object?: string;
  action?: string;
}

export type UserRole = RoleUser; // backward compat

// Requests (aligned with docs)
export interface CreateRoleRequest {
  name: string;
  description: string;
  tenant_type?: string;
  display_name?: string;
  tenant_id?: number | string;
  is_custom?: boolean;
  is_active?: boolean;
  reason?: string;
}

export interface UpdateRoleRequest {
  name: string;
  description: string;
  tenant_type?: string;
  display_name?: string;
  is_active?: boolean;
  reason?: string;
}

export interface AssignRoleToTenantRequest {
  role_id: number;
  tenant_id: number;
}

export interface AssignRoleRequest {
  role_id: number;
  tenant_id?: number | string;
  reason?: string;
}

export interface PermissionRequest {
  alias?: string;
  obj?: string;
  act?: string;
}

export interface PermissionCatalogItem {
  alias: string;
  label: string;
  description?: string;
}

export interface RoleDiff {
  role_id: number;
  from_version?: number;
  to_version?: number | string;
  added_permissions?: Permission[];
  removed_permissions?: Permission[];
  metadata?: Record<string, unknown>;
}

// Response aliases (aligned with docs)
export type ListRolesResponse = ApiResponse<Role[]>;
export type CreateRoleResponse = ApiResponse<Role>;
export type UpdateRoleResponse = ApiResponse<Role>;
export type DeleteRoleResponse = ApiResponse<{ id: number }>;
export type AssignRoleToTenantResponse = ApiResponse<TenantRole>;
export type ListPermissionsResponse = ApiResponse<Permission[]>;
export type AddPermissionResponse = ApiResponse<{ alias: string; label: string }>;
export type DeletePermissionResponse = ApiResponse<{ id: number }>;
export type DeletePermissionByAliasResponse = ApiResponse<{ alias: string; label: string }>;
export type PermissionCatalogResponse = ApiResponse<PermissionCatalogItem[]>;
export type ListUserRolesResponse = ApiResponse<RoleUser[]>;
export type AssignUserRoleResponse = ApiResponse<{ user_id: number; role_id: number }>;
export type DeleteUserRoleResponse = ApiResponse<{ user_id: number; role_id: number }>;
