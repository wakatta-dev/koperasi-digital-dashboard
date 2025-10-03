/** @format */

"use server";

import { apiRequest } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  User,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateStatusRequest,
} from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listUsers as listUsersService,
  createUser as createUserService,
  resetPassword,
  getUser as getUserService,
  updateUser as updateUserService,
  patchUserStatus as patchUserStatusService,
  deleteUser as deleteUserService,
  listUserRoles as listUserRolesService,
  removeUserRole as removeUserRoleService,
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

export async function createUser(payload: CreateUserRequest): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.users.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(
  id: string | number,
  payload: UpdateUserRequest,
): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.users.detail(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchUserStatus(
  id: string | number,
  payload: UpdateStatusRequest,
): Promise<ApiResponse<User>> {
  return apiRequest<User>(API_ENDPOINTS.users.status(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(
  id: string | number,
): Promise<ApiResponse<any>> {
  return apiRequest<any>(API_ENDPOINTS.users.detail(id), {
    method: "DELETE",
  });
}

export async function listUserRoles(
  id: string | number,
  params?: { limit: number; cursor?: string },
): Promise<ApiResponse<UserRole[]>> {
  const search = new URLSearchParams({
    limit: String(params?.limit ?? 100),
  });
  if (params?.cursor) search.set("cursor", params.cursor);
  const url = `${API_ENDPOINTS.users.roles(id)}?${search.toString()}`;
  return apiRequest<UserRole[]>(url);
}

export async function removeUserRole(
  id: string | number,
  rid: string | number,
): Promise<ApiResponse<any>> {
  return apiRequest<any>(API_ENDPOINTS.users.role(id, rid), {
    method: "DELETE",
  });
}

export async function listUsersAction(
  params?: Record<string, string | number>
) {
  try {
    const res = await listUsersService(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListUsersActionResult = Awaited<
  ReturnType<typeof listUsersAction>
>;

export async function listVendorUsersPage(
  params?: Record<string, string | number>
): Promise<{
  data: User[];
  meta: ApiResponse<User[]>["meta"];
}> {
  try {
    const res = await listUsersService(params);
    const data = ensureSuccess(res);
    return { data, meta: res.meta };
  } catch {
    return {
      data: [],
      meta: {
        request_id: "",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export async function getUserAction(id: string | number) {
  try {
    const res = await getUserService(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type GetUserActionResult = Awaited<
  ReturnType<typeof getUserAction>
>;

export async function createUserAction(payload: CreateUserRequest) {
  try {
    const res = await createUserService(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreateUserActionResult = Awaited<
  ReturnType<typeof createUserAction>
>;

export async function updateUserAction(
  id: string | number,
  payload: UpdateUserRequest,
) {
  try {
    const res = await updateUserService(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type UpdateUserActionResult = Awaited<
  ReturnType<typeof updateUserAction>
>;

export async function patchUserStatusAction(
  id: string | number,
  payload: UpdateStatusRequest,
) {
  try {
    const res = await patchUserStatusService(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type PatchUserStatusActionResult = Awaited<
  ReturnType<typeof patchUserStatusAction>
>;

export async function deleteUserAction(id: string | number) {
  try {
    const res = await deleteUserService(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type DeleteUserActionResult = Awaited<
  ReturnType<typeof deleteUserAction>
>;

export async function listUserRolesAction(id: string | number) {
  try {
    const res = await listUserRolesService(id, { limit: 100 });
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListUserRolesActionResult = Awaited<
  ReturnType<typeof listUserRolesAction>
>;

export async function removeUserRoleAction(
  userId: string | number,
  roleId: string | number,
) {
  try {
    const res = await removeUserRoleService(userId, roleId);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type RemoveUserRoleActionResult = Awaited<
  ReturnType<typeof removeUserRoleAction>
>;

export async function resetPasswordAction(payload: {
  email: string;
  new_password: string;
}) {
  try {
    const res = await resetPassword(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type ResetPasswordActionResult = Awaited<
  ReturnType<typeof resetPasswordAction>
>;
