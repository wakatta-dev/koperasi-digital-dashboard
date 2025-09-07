/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import {
  listRoles,
  assignRole,
  createRole,
  updateRole,
  deleteRole,
  listRolePermissions,
  addRolePermission,
  deleteRolePermission,
  removeUserRole,
} from "@/services/api";
import type { Role, Permission } from "@/types/api";

export async function listRolesAction() {
  // Provide a sensible default limit for listing roles
  try {
    const res = await listRoles({ limit: 100 });
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListRolesActionResult = Awaited<
  ReturnType<typeof listRolesAction>
>;

export async function assignRoleAction(
  userId: string | number,
  payload: { role_id: string | number; tenant_id?: string | number }
) {
  const res = await assignRole(userId, payload);
  return ensureSuccess(res);
}

export type AssignRoleActionResult = Awaited<
  ReturnType<typeof assignRoleAction>
>;

export async function createRoleAction(
  payload: { name: string; description: string },
): Promise<Role | null> {
  try {
    const res = await createRole(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreateRoleActionResult = Awaited<
  ReturnType<typeof createRoleAction>
>;

export async function updateRoleAction(
  id: string | number,
  payload: Partial<Role>,
): Promise<Role | null> {
  try {
    const res = await updateRole(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type UpdateRoleActionResult = Awaited<
  ReturnType<typeof updateRoleAction>
>;

export async function deleteRoleAction(
  id: string | number,
): Promise<{ id: number } | null> {
  try {
    const res = await deleteRole(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type DeleteRoleActionResult = Awaited<
  ReturnType<typeof deleteRoleAction>
>;

export async function listRolePermissionsAction(
  id: string | number,
): Promise<Permission[]> {
  try {
    const res = await listRolePermissions(id, { limit: 100 });
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListRolePermissionsActionResult = Awaited<
  ReturnType<typeof listRolePermissionsAction>
>;

export async function addRolePermissionAction(
  id: string | number,
  payload: { obj: string; act: string },
): Promise<{ obj: string; act: string } | null> {
  try {
    const res = await addRolePermission(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type AddRolePermissionActionResult = Awaited<
  ReturnType<typeof addRolePermissionAction>
>;

export async function deleteRolePermissionAction(
  roleId: string | number,
  permissionId: string | number,
): Promise<{ id: number } | null> {
  try {
    const res = await deleteRolePermission(roleId, permissionId);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type DeleteRolePermissionActionResult = Awaited<
  ReturnType<typeof deleteRolePermissionAction>
>;

export async function removeUserRoleAction(
  userId: string | number,
  roleId: string | number,
): Promise<{ user_id: number; role_id: number } | null> {
  try {
    const res = await removeUserRole(userId, roleId);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type RemoveUserRoleActionResult = Awaited<
  ReturnType<typeof removeUserRoleAction>
>;
