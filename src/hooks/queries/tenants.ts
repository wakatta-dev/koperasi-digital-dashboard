/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Tenant,
  TenantDetail,
  TenantModule,
  TenantUser,
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantStatusRequest,
  AddTenantUserRequest,
} from "@/types/api";
import {
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  updateTenantStatus,
  listTenantUsers,
  addTenantUser,
  listTenantModules,
  updateTenantModule,
  getTenantByDomain,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import { toast } from "sonner";

export function useTenants(
  params?: {
    term?: string;
    type?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  initialData?: TenantDetail[] | undefined,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: QK.tenants.list(params),
    queryFn: async () => ensureSuccess(await listTenants(params)),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval ? { refetchInterval: options.refetchInterval } : {}),
  });
}

export function useTenant(
  id?: string | number,
  initialData?: TenantDetail | undefined
) {
  return useQuery({
    queryKey: QK.tenants.detail(id ?? ""),
    enabled: !!id,
    queryFn: async ({ signal }) =>
      ensureSuccess(await getTenant(id as string | number, { signal })),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantByDomain(
  domain?: string,
  initialData?: Tenant | undefined
) {
  return useQuery({
    queryKey: QK.tenants.byDomain(domain ?? ""),
    enabled: !!domain,
    queryFn: async () =>
      ensureSuccess(await getTenantByDomain(domain as string)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantUsers(
  id?: string | number,
  params?: {
    term?: string;
    role?: string | number;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  initialData?: TenantUser[] | undefined
) {
  return useQuery({
    queryKey: QK.tenants.users(id ?? "", params),
    enabled: !!id,
    queryFn: async ({ signal }) =>
      ensureSuccess(await listTenantUsers(id as string | number, params, { signal })),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantModules(
  id?: string | number,
  params?: {
    term?: string;
    enabled?: string;
    limit?: number;
    cursor?: string;
  },
  initialData?: TenantModule[] | undefined
) {
  return useQuery({
    queryKey: QK.tenants.modules(id ?? "", params),
    enabled: !!id,
    queryFn: async ({ signal }) =>
      ensureSuccess(await listTenantModules(id as string | number, params, { signal })),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: CreateTenantRequest) =>
      ensureSuccess(await createTenant(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
      toast.success("Tenant dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat tenant"),
  });

  const update = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: Partial<UpdateTenantRequest>;
    }) => ensureSuccess(await updateTenant(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
      toast.success("Tenant diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui tenant"),
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: UpdateTenantStatusRequest["status"] }) =>
      ensureSuccess(await updateTenantStatus(vars.id, { status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
      toast.success("Status tenant diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui status"),
  });

  const addUser = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: AddTenantUserRequest;
    }) => ensureSuccess(await addTenantUser(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.users(vars.id) });
      toast.success("User ditambahkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menambah user"),
  });

  const updateModule = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      module_id: string | number;
      status: "aktif" | "nonaktif";
    }) => ensureSuccess(await updateTenantModule(vars.id, vars)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.modules(vars.id) });
      toast.success("Status modul diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui modul"),
  });

  return { create, update, updateStatus, addUser, updateModule } as const;
}
