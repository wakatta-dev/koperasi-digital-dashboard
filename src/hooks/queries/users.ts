/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, UserRole } from "@/types/api";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  patchUserStatus,
  deleteUser,
  listUserRoles,
  removeUserRole,
  resetPassword,
} from "@/services/api";
import { assignRole } from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import { toast } from "sonner";

export function useUsers(
  params?: Record<string, string | number>,
  initialData?: User[] | undefined,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: QK.users.list(params),
    queryFn: async () => ensureSuccess(await listUsers(params)),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval ? { refetchInterval: options.refetchInterval } : {}),
  });
}

export function useUser(id?: string | number, initialData?: User | undefined) {
  return useQuery({
    queryKey: QK.users.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getUser(id as string | number)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useUserRoles(
  userId?: string | number,
  initialData?: UserRole[] | undefined
) {
  return useQuery({
    queryKey: QK.users.roles(userId ?? ""),
    enabled: !!userId,
    queryFn: async () =>
      ensureSuccess(
        await listUserRoles(userId as string | number, { limit: 100 })
      ),
    ...(initialData ? { initialData } : {}),
  });
}

export function useUserActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: Partial<User>) =>
      ensureSuccess(await createUser(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.users.lists() });
      toast.success("User dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat user"),
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<User> & { tenant_role_id?: number } }) =>
      ensureSuccess(await updateUser(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.users.lists() });
      toast.success("User diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui user"),
  });

  const patchStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: boolean }) =>
      ensureSuccess(await patchUserStatus(vars.id, { status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.users.lists() });
      toast.success("Status user diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui status"),
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteUser(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.users.lists() });
      toast.success("User dihapus");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menghapus user"),
  });

  const removeRole = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      roleId: string | number;
    }) => ensureSuccess(await removeUserRole(vars.userId, vars.roleId)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.roles(vars.userId) });
      toast.success("Role dihapus");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menghapus role"),
  });

  const assign = useMutation({
    mutationFn: async (vars: { userId: string | number; roleId: string | number; tenantId?: string | number }) =>
      ensureSuccess(await assignRole(vars.userId, { role_id: vars.roleId, ...(vars.tenantId ? { tenant_id: vars.tenantId } : {}) } as any)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.roles(vars.userId) });
      toast.success("Role ditambahkan ke user");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menambahkan role"),
  });

  const resetPwd = useMutation({
    mutationFn: async (payload: { email: string; new_password: string }) =>
      ensureSuccess(await resetPassword(payload)),
    onSuccess: () => toast.success("Password direset"),
    onError: (err: any) => toast.error(err?.message || "Gagal reset password"),
  });

  return {
    create,
    update,
    patchStatus,
    remove,
    removeRole,
    assign,
    resetPwd,
  } as const;
}
