/** @format */

import type { ApiResponse, Rfc3339String } from './common';

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

// Permission entity aligned to docs/modules/authorization.md
// Notes:
// - Backend may currently return { obj, act } fields. To keep UI stable,
//   we include optional obj/act while also exposing normalized object/action.
export interface Permission {
  id: number;
  // Role name and tenant domain (may be undefined on some backends)
  role?: string;
  domain?: string;
  // Normalized resource + verb
  object: string;
  action: string;
  // Convenience composite and human label
  permission: string;
  label: string;
  // Back-compat (request uses obj/act; some list responses may still use these)
  obj?: string;
  act?: string;
}

export type UserRole = RoleUser; // backward compat

// Requests (aligned with docs)
export interface CreateRoleRequest { name: string; description: string }
export interface UpdateRoleRequest { name: string; description: string }
export interface AssignRoleToTenantRequest { role_id: number; tenant_id: number }
export interface AssignRoleRequest { role_id: number; tenant_id: number }
export interface PermissionRequest { obj: string; act: string }

// Response aliases (aligned with docs)
export type ListRolesResponse = ApiResponse<Role[]>;
export type CreateRoleResponse = ApiResponse<Role>;
export type UpdateRoleResponse = ApiResponse<Role>;
export type DeleteRoleResponse = ApiResponse<{ id: number }>;
export type AssignRoleToTenantResponse = ApiResponse<TenantRole>;
export type ListPermissionsResponse = ApiResponse<Permission[]>;
export type AddPermissionResponse = ApiResponse<{ obj: string; act: string }>;
export type DeletePermissionResponse = ApiResponse<{ id: number }>;
export type ListUserRolesResponse = ApiResponse<RoleUser[]>;
export type AssignUserRoleResponse = ApiResponse<{ user_id: number; role_id: number }>;
export type DeleteUserRoleResponse = ApiResponse<{ user_id: number; role_id: number }>;
