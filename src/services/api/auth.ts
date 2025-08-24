/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, LoginResponse, RefreshResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function login(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> {
  return api.post<LoginResponse>(
    `${API_PREFIX}${API_ENDPOINTS.auth.login}`,
    payload,
  );
}

export function refreshToken(payload: {
  refresh_token: string;
}): Promise<ApiResponse<RefreshResponse>> {
  return api.post<RefreshResponse>(
    `${API_PREFIX}${API_ENDPOINTS.auth.refresh}`,
    payload,
  );
}

export function logout(payload: { refresh_token: string }): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.auth.logout}`,
    payload,
  );
}
