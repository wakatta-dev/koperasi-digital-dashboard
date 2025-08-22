/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import { listRoles, assignRole } from "@/services/api";

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
