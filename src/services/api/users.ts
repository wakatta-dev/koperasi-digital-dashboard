/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, User } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listUsers(
  params?: Record<string, string | number>,
): Promise<ApiResponse<User[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<User[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.list}${query}`,
  );
}

export function createUser(payload: Partial<User>): Promise<ApiResponse<User>> {
  return api.post<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.list}`,
    payload,
  );
}

export function getUser(id: string | number): Promise<ApiResponse<User>> {
  return api.get<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.detail(id)}`,
  );
}

export function updateUser(
  id: string | number,
  payload: Partial<User> & { tenant_role_id?: number },
): Promise<ApiResponse<User>> {
  return api.put<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.detail(id)}`,
    payload,
  );
}

export function patchUserStatus(
  id: string | number,
  payload: { status: boolean },
): Promise<ApiResponse<User>> {
  return api.patch<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.status(id)}`,
    payload,
  );
}

export function deleteUser(id: string | number): Promise<ApiResponse<any>> {
  return api.delete<any>(
    `${API_PREFIX}${API_ENDPOINTS.users.detail(id)}`,
  );
}

export function resetPassword(payload: {
  email: string;
  new_password: string;
}): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.users.resetPassword}`,
    payload,
  );
}
