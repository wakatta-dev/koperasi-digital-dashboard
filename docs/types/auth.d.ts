import type { APIResponse, Rfc3339String } from './index';

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

export type LoginEndpointResponse = APIResponse<LoginResponse>;
export type RefreshEndpointResponse = APIResponse<RefreshResponse>;
export type LogoutEndpointResponse = APIResponse<{ message: string }>;

