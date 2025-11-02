/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ActivateEmailChangeRequest,
  ActivateInvitationRequest,
  ApiResponse,
  AssignRoleRequest,
  ChangeEmailRequest,
  CreateUserRequest,
  InviteUserRequest,
  UpdateStatusRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  User,
  UserInvitation,
  UserRole,
  UserResetPasswordRequest,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";

type ListUserParams = {
  term?: string;
  status?: boolean;
  role_id?: string | number;
  limit?: number;
  cursor?: string;
};

export function listUsers(
  params?: ListUserParams,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<User[]>> {
  const search = new URLSearchParams();
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (typeof params?.status !== "undefined") {
    search.set("status", String(params.status));
  }
  if (params?.role_id) search.set("role_id", String(params.role_id));
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<User[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.list}${query}`,
    { signal: opts?.signal },
  );
}

export function createUser(
  payload: CreateUserRequest,
): Promise<ApiResponse<User>> {
  return api.post<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.list}`,
    payload,
  );
}

export function inviteUser(
  payload: InviteUserRequest,
): Promise<ApiResponse<UserInvitation>> {
  return api.post<UserInvitation>(
    `${API_PREFIX}${API_ENDPOINTS.users.invite}`,
    payload,
  );
}

export function activateInvitation(
  payload: ActivateInvitationRequest,
): Promise<ApiResponse<User>> {
  return api.post<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.inviteActivate}`,
    payload,
  );
}

export function getUser(
  id: string | number,
): Promise<ApiResponse<User>> {
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

export function updateUserStatus(
  id: string | number,
  payload: UpdateStatusRequest,
): Promise<ApiResponse<Record<string, boolean>>> {
  return api.patch<Record<string, boolean>>(
    `${API_PREFIX}${API_ENDPOINTS.users.status(id)}`,
    payload,
  );
}

export function deleteUser(
  id: string | number,
): Promise<ApiResponse<Record<string, number>>> {
  return api.delete<Record<string, number>>(
    `${API_PREFIX}${API_ENDPOINTS.users.detail(id)}`,
  );
}

export function resetUserPassword(
  payload: UserResetPasswordRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.users.resetPassword}`,
    payload,
  );
}

export async function assignRole(
  userId: string | number,
  payload: AssignRoleRequest,
): Promise<ApiResponse<{ user_id: number; role_id: number }>> {
  const finalPayload: AssignRoleRequest = { ...payload };
  if (typeof finalPayload.tenant_id === "undefined") {
    const tenantId = await getTenantId();
    if (tenantId) {
      finalPayload.tenant_id = Number.isNaN(Number(tenantId))
        ? tenantId
        : Number(tenantId);
    }
  }
  return api.post<{ user_id: number; role_id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}`,
    finalPayload,
  );
}

export function listUserRoles(
  userId: string | number,
  params?: { term?: string; permission?: string; limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<UserRole[]>> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.permission) search.set("permission", params.permission);
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<UserRole[]>(
    `${API_PREFIX}${API_ENDPOINTS.users.roles(userId)}${query}`,
    { signal: opts?.signal },
  );
}

export function removeUserRole(
  userId: string | number,
  roleId: string | number,
): Promise<ApiResponse<{ user_id: number; role_id: number }>> {
  return api.delete<{ user_id: number; role_id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.users.roleItem(userId, roleId)}`,
  );
}

export function updateUserRole(
  userId: string | number,
  payload: UpdateUserRoleRequest,
): Promise<ApiResponse<Record<string, number>>> {
  return api.patch<Record<string, number>>(
    `${API_PREFIX}${API_ENDPOINTS.users.role(userId)}`,
    payload,
  );
}

export function requestEmailChange(
  userId: string | number,
  payload: ChangeEmailRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.post<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.users.emailChange(userId)}`,
    payload,
  );
}

export function activateEmailChange(
  payload: ActivateEmailChangeRequest,
): Promise<ApiResponse<User>> {
  return api.post<User>(
    `${API_PREFIX}${API_ENDPOINTS.users.emailChangeActivate}`,
    payload,
  );
}
