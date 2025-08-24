/** @format */

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
}
