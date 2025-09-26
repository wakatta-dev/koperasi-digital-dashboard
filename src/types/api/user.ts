/** @format */

import type { ApiResponse, Rfc3339String } from "./common";
import type { TenantRole } from "./role";

export type User = {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  status: boolean;
  last_login?: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  tenant_role: TenantRole;
};

export type InviteVendorUserRequest = {
  email: string;
  full_name: string;
  role_id: number;
};

export type CreateUserRequest = {
  tenant_role_id: number;
  email: string;
  password: string;
  full_name: string;
};

export type UpdateUserRequest = {
  tenant_role_id?: number;
  full_name?: string;
  email?: string;
};

export type UpdateStatusRequest = {
  status: boolean;
};

export type UpdateUserRoleRequest = {
  role_id: number;
};

export type ResetPasswordRequest = {
  email: string;
  new_password: string;
};

export type UserListResponse = ApiResponse<User[]>;
export type UserDetailResponse = ApiResponse<User>;
export type UserMutationResponse = ApiResponse<User>;
export type UserStatusResponse = ApiResponse<{ status: boolean }>;
export type UserDeleteResponse = ApiResponse<{ id: number }>;
export type UserRoleUpdateResponse = ApiResponse<{ id: number }>;
export type ResetPasswordResponse = ApiResponse<{ message: string }>;
