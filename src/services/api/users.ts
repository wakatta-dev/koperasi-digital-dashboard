/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateStatusRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listUsers(
  params?: {
    term?: string;
    status?: string;
    role_id?: string | number;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<User[]>> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.status) search.set("status", params.status);
  if (params?.role_id) search.set("role_id", String(params.role_id));
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<User[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.list}${query}`,
    { signal: opts?.signal },
  );
}

export function createUser(payload: CreateUserRequest): Promise<ApiResponse<User>> {
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
  payload: UpdateUserRequest,
): Promise<ApiResponse<User>> {
  return api.put<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.detail(id)}`,
    payload,
  );
}

export function patchUserStatus(
  id: string | number,
  payload: UpdateStatusRequest,
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
