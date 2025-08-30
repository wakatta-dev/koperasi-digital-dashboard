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
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

export function useUsers(
  params?: Record<string, string | number>,
  initialData?: User[] | undefined
) {
  return useQuery({
    queryKey: QK.users.list(params),
    queryFn: async () => ensureSuccess(await listUsers(params)),
    ...(initialData ? { initialData } : {}),
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
    },
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<User> }) =>
      ensureSuccess(await updateUser(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.users.lists() });
    },
  });

  const patchStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(await patchUserStatus(vars.id, { status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.users.lists() });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteUser(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.users.lists() });
    },
  });

  const removeRole = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      roleId: string | number;
    }) => ensureSuccess(await removeUserRole(vars.userId, vars.roleId)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.users.roles(vars.userId) });
    },
  });

  const resetPwd = useMutation({
    mutationFn: async (payload: { email: string; new_password: string }) =>
      ensureSuccess(await resetPassword(payload)),
  });

  return {
    create,
    update,
    patchStatus,
    remove,
    removeRole,
    resetPwd,
  } as const;
}
