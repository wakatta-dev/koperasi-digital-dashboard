import type { APIResponse, Rfc3339String } from './index';

export interface User {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  status: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface CreateUserRequest {
  tenant_role_id: number;
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateUserRequest { tenant_role_id?: number; full_name?: string }
export interface UpdateStatusRequest { status: boolean }
export interface ResetPasswordRequest { email: string; new_password: string }

export type CreateUserResponse = APIResponse<User>;
export type ListUsersResponse = APIResponse<User[]>;
export type GetUserResponse = APIResponse<User>;
export type UpdateUserResponse = APIResponse<User>;
export type UpdateStatusResponse = APIResponse<{ status: boolean }>;
export type DeleteUserResponse = APIResponse<{ id: number }>;
export type ResetPasswordResponse = APIResponse<{ message: string }>;

