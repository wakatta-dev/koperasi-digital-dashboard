/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  LoginResponse,
  RefreshResponse,
  LogoutEndpointResponse,
  RefreshRequest,
  LoginRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function login(
  payload: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  return api.post<LoginResponse>(
    `${API_PREFIX}${API_ENDPOINTS.auth.login}`,
    payload,
  );
}

export function refreshToken(
  payload: RefreshRequest,
): Promise<ApiResponse<RefreshResponse>> {
  return api.post<RefreshResponse>(
    `${API_PREFIX}${API_ENDPOINTS.auth.refresh}`,
    payload,
  );
}

export function logout(
  payload: RefreshRequest,
): Promise<LogoutEndpointResponse> {
  return api.post<{ message: string }>(
    `${API_PREFIX}${API_ENDPOINTS.auth.logout}`,
    payload,
  );
}
