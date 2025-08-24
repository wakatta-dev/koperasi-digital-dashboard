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
  const res = await listRoles();
  return ensureSuccess(res);
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
  payload: Partial<Role>,
): Promise<Role> {
  const res = await createRole(payload);
  return ensureSuccess(res);
}

export type CreateRoleActionResult = Awaited<
  ReturnType<typeof createRoleAction>
>;

export async function updateRoleAction(
  id: string | number,
  payload: Partial<Role>,
): Promise<Role> {
  const res = await updateRole(id, payload);
  return ensureSuccess(res);
}

export type UpdateRoleActionResult = Awaited<
  ReturnType<typeof updateRoleAction>
>;

export async function deleteRoleAction(
  id: string | number,
): Promise<{ id: number }> {
  const res = await deleteRole(id);
  return ensureSuccess(res);
}

export type DeleteRoleActionResult = Awaited<
  ReturnType<typeof deleteRoleAction>
>;

export async function listRolePermissionsAction(
  id: string | number,
): Promise<Permission[]> {
  const res = await listRolePermissions(id);
  return ensureSuccess(res);
}

export type ListRolePermissionsActionResult = Awaited<
  ReturnType<typeof listRolePermissionsAction>
>;

export async function addRolePermissionAction(
  id: string | number,
  payload: { obj: string; act: string },
): Promise<Permission> {
  const res = await addRolePermission(id, payload);
  return ensureSuccess(res);
}

export type AddRolePermissionActionResult = Awaited<
  ReturnType<typeof addRolePermissionAction>
>;

export async function deleteRolePermissionAction(
  roleId: string | number,
  permissionId: string | number,
): Promise<{ id: number }> {
  const res = await deleteRolePermission(roleId, permissionId);
  return ensureSuccess(res);
}

export type DeleteRolePermissionActionResult = Awaited<
  ReturnType<typeof deleteRolePermissionAction>
>;

export async function removeUserRoleAction(
  userId: string | number,
  roleId: string | number,
): Promise<{ id: number }> {
  const res = await removeUserRole(userId, roleId);
  return ensureSuccess(res);
}

export type RemoveUserRoleActionResult = Awaited<
  ReturnType<typeof removeUserRoleAction>
>;
