/** @format */

import type { ApiResponse } from './common';

export interface LoginRequest { email: string; password: string }
export interface RefreshRequest { refresh_token: string }

export interface LoginResponse {
  id: number;
  nama: string;
  role: string;
  jenis_tenant: string; // vendor|koperasi|umkm|bumdes
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
}

export interface RefreshResponse { access_token: string }

export type LoginEndpointResponse = ApiResponse<LoginResponse>;
export type RefreshEndpointResponse = ApiResponse<RefreshResponse>;
export type LogoutEndpointResponse = ApiResponse<{ message: string }>;
