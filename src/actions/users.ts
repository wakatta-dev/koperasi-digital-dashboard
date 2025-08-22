/** @format */

"use server";

import { apiRequest } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, User } from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listUsers as listUsersService,
  createUser as createUserService,
  resetPassword,
} from "@/services/api";

export async function listUsers(params?: {
  limit?: number;
  cursor?: string;
}): Promise<ApiResponse<User[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.users.list}?${search.toString()}`
    : API_ENDPOINTS.users.list;
  return apiRequest<User[]>(endpoint);
}

export async function getUser(id: string | number): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.users.detail(id));
}

export async function createUser(payload: {
  role_id: number;
  email: string;
  password: string;
  full_name: string;
}): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.users.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listUsersAction(
  params?: Record<string, string | number>
) {
  const res = await listUsersService(params);
  return ensureSuccess(res);
}

export type ListUsersActionResult = Awaited<
  ReturnType<typeof listUsersAction>
>;

export async function createUserAction(payload: Partial<User>) {
  const res = await createUserService(payload);
  return ensureSuccess(res);
}

export type CreateUserActionResult = Awaited<
  ReturnType<typeof createUserAction>
>;

export async function resetPasswordAction(payload: { email: string }) {
  const res = await resetPassword(payload);
  return ensureSuccess(res);
}

export type ResetPasswordActionResult = Awaited<
  ReturnType<typeof resetPasswordAction>
>;
