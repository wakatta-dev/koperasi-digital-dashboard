/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  CreateRoleRequest,
  Permission,
  PermissionCatalogItem,
  Role,
  UpdateRoleRequest,
} from "@/types/api";
import {
  deleteRolePermissionByAlias,
  createRole,
  deleteRole,
  addRolePermission,
  listPermissionCatalog,
  listRolePermissions,
  listRoles,
  updateRole,
  deleteRolePermission,
} from "@/services/api";
import { toast } from "sonner";

export function useRoles(
  params?: { limit?: number; cursor?: string },
  initialData?: Role[] | undefined
) {
  const p = { limit: params?.limit ?? 50, cursor: params?.cursor };
  return useQuery({
    queryKey: QK.roles.lists(p),
    queryFn: async () => ensureSuccess(await listRoles(p as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useRolePermissions(
  roleId?: string | number,
  params?: { limit?: number; cursor?: string; permission?: string },
  initialData?: Permission[] | undefined
) {
  const p = { limit: params?.limit ?? 100, cursor: params?.cursor, permission: params?.permission };
  return useQuery({
    queryKey: QK.roles.permissions(roleId ?? ""),
    enabled: !!roleId,
    queryFn: async () => ensureSuccess(await listRolePermissions(roleId as any, p)),
    ...(initialData ? { initialData } : {}),
  });
}

export function usePermissionCatalog(
  initialData?: PermissionCatalogItem[] | undefined
) {
  return useQuery({
    queryKey: QK.roles.permissionCatalog(),
    queryFn: async () => ensureSuccess(await listPermissionCatalog()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useRoleActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: CreateRoleRequest) => ensureSuccess(await createRole(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.roles.all });
      toast.success("Role dibuat");
    },
    onError: (e: any) => toast.error(e?.message || "Gagal membuat role"),
  });

  const update = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: UpdateRoleRequest;
    }) => ensureSuccess(await updateRole(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.roles.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.roles.all });
      toast.success("Role diperbarui");
    },
    onError: (e: any) => toast.error(e?.message || "Gagal memperbarui role"),
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) => ensureSuccess(await deleteRole(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.roles.all });
      toast.success("Role dihapus");
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menghapus role"),
  });

  const addPermission = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      alias?: string;
      obj?: string;
      act?: string;
    }) =>
      ensureSuccess(
        await addRolePermission(vars.id, {
          alias: vars.alias,
          obj: vars.obj,
          act: vars.act,
        })
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.roles.permissions(vars.id) });
      toast.success("Permission ditambahkan");
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menambah permission"),
  });

  const removePermission = useMutation({
    mutationFn: async (vars: {
      roleId: string | number;
      permissionId?: string | number;
      alias?: string;
    }) => {
      if (vars.alias) {
        return ensureSuccess(await deleteRolePermissionByAlias(vars.roleId, vars.alias));
      }
      return ensureSuccess(await deleteRolePermission(vars.roleId, vars.permissionId as string | number));
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.roles.permissions(vars.roleId) });
      toast.success("Permission dihapus");
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menghapus permission"),
  });

  return { create, update, remove, addPermission, removePermission } as const;
}
