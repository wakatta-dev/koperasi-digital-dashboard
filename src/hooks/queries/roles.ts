/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Permission, Role } from "@/types/api";
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  listRolePermissions,
  addRolePermission,
  deleteRolePermission,
  assignRole,
  removeUserRole,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

export function useRoles(
  params: { limit?: number; cursor?: string } = { limit: 100 },
  initialData?: Role[] | undefined,
) {
  const finalParams = {
    limit: typeof params.limit === "number" ? params.limit : 100,
    ...(params.cursor ? { cursor: params.cursor } : {}),
  } as { limit: number; cursor?: string };

  return useQuery({
    queryKey: QK.roles.lists(finalParams),
    queryFn: async () => ensureSuccess(await listRoles(finalParams)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useRolePermissions(
  roleId?: string | number,
  initialData?: Permission[] | undefined
) {
  return useQuery({
    queryKey: QK.roles.permissions(roleId ?? ""),
    enabled: !!roleId,
    queryFn: async () =>
      ensureSuccess(await listRolePermissions(roleId as string | number)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useRoleActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: Partial<Role>) =>
      ensureSuccess(await createRole(payload)),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "roles" &&
          q.queryKey[1] === "list",
      });
    },
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<Role> }) =>
      ensureSuccess(await updateRole(vars.id, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "roles" &&
          q.queryKey[1] === "list",
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteRole(id)),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "roles" &&
          q.queryKey[1] === "list",
      });
    },
  });

  const addPermission = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      obj: string;
      act: string;
    }) =>
      ensureSuccess(
        await addRolePermission(vars.id, { obj: vars.obj, act: vars.act })
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.roles.permissions(vars.id) });
    },
  });

  const deletePermission = useMutation({
    mutationFn: async (vars: {
      roleId: string | number;
      permissionId: string | number;
    }) =>
      ensureSuccess(await deleteRolePermission(vars.roleId, vars.permissionId)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.roles.permissions(vars.roleId) });
    },
  });

  const assign = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      role_id: string | number;
      tenant_id?: string | number;
    }) =>
      ensureSuccess(
        await assignRole(vars.userId, {
          role_id: vars.role_id,
          tenant_id: vars.tenant_id,
        })
      ),
  });

  const removeUserRoleMut = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      roleId: string | number;
    }) => ensureSuccess(await removeUserRole(vars.userId, vars.roleId)),
  });

  return {
    create,
    update,
    remove,
    addPermission,
    deletePermission,
    assign,
    removeUserRole: removeUserRoleMut,
  } as const;
}
