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

export type UserResetPasswordRequest = {
  email: string;
  new_password: string;
};

export type InviteUserRequest = {
  email: string;
  full_name: string;
  role_id: number;
  reason?: string;
  resend?: boolean;
};

export type ActivateInvitationRequest = {
  token: string;
  password: string;
  password_confirmation: string;
};

export type ChangeEmailRequest = {
  new_email: string;
  reason: string;
  otp?: string;
};

export type ActivateEmailChangeRequest = {
  token: string;
};

export type UserInvitation = {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  role_id: number;
  email: string;
  full_name: string;
  reason?: string;
  status: string;
  token: string;
  token_expires_at?: Rfc3339String;
  last_sent_at?: Rfc3339String;
  send_count?: number;
};

export type UserListResponse = ApiResponse<User[]>;
export type UserDetailResponse = ApiResponse<User>;
export type UserMutationResponse = ApiResponse<User>;
export type UserStatusResponse = ApiResponse<{ status: boolean }>;
export type UserDeleteResponse = ApiResponse<{ id: number }>;
export type UserRoleUpdateResponse = ApiResponse<{ id: number }>;
export type UserInvitationResponse = ApiResponse<UserInvitation>;
