/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutEndpointResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SessionInfo,
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

export function logoutAll(
  payload: RefreshRequest,
): Promise<LogoutEndpointResponse> {
  return api.post<{ message: string }>(
    `${API_PREFIX}${API_ENDPOINTS.auth.logoutAll}`,
    payload,
  );
}

export function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.auth.forgotPassword}`,
    payload,
  );
}

export function resetPassword(
  payload: ResetPasswordRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.auth.resetPassword}`,
    payload,
  );
}

export function register(
  payload: RegisterRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.auth.register}`,
    payload,
  );
}

export function listSessions(): Promise<ApiResponse<SessionInfo[]>> {
  return api.get<SessionInfo[]>(
    `${API_PREFIX}${API_ENDPOINTS.auth.sessions}`,
  );
}
