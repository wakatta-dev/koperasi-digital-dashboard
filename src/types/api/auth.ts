/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  tenant_role_id: number;
}

export interface LoginResponse {
  id: number;
  nama: string;
  role: string;
  jenis_tenant: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface SessionInfo {
  session_id: string;
  device_id?: string;
  ip_address?: string;
  user_agent?: string;
  last_active?: Rfc3339String;
  expires_at?: Rfc3339String;
}

export type LoginEndpointResponse = ApiResponse<LoginResponse>;
export type RefreshEndpointResponse = ApiResponse<RefreshResponse>;
export type LogoutEndpointResponse = ApiResponse<{ message: string }>;
export type ForgotPasswordResponse = ApiResponse<Record<string, unknown>>;
export type ResetPasswordResponse = ApiResponse<Record<string, unknown>>;
export type RegisterResponse = ApiResponse<Record<string, unknown>>;
export type SessionsResponse = ApiResponse<SessionInfo[]>;
