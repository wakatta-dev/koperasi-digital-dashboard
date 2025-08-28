/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tenant, User } from "@/types/api";
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

export function useTenants(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: QK.tenants.list(params),
    queryFn: async () => ensureSuccess(await listTenants(params)),
  });
}

export function useTenant(id?: string | number) {
  return useQuery({
    queryKey: QK.tenants.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getTenant(id as string | number)),
  });
}

export function useTenantByDomain(domain?: string) {
  return useQuery({
    queryKey: QK.tenants.byDomain(domain ?? ""),
    enabled: !!domain,
    queryFn: async () => ensureSuccess(await getTenantByDomain(domain as string)),
  });
}

export function useTenantUsers(id?: string | number, params?: Record<string, string | number>) {
  return useQuery({
    queryKey: QK.tenants.users(id ?? "", params),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await listTenantUsers(id as string | number, params)),
  });
}

export function useTenantModules(id?: string | number, params?: Record<string, string | number>) {
  return useQuery({
    queryKey: QK.tenants.modules(id ?? "", params),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await listTenantModules(id as string | number, params)),
  });
}

export function useTenantActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: Partial<Tenant>) => ensureSuccess(await createTenant(payload as any)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
    },
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<Tenant> }) =>
      ensureSuccess(await updateTenant(vars.id, vars.payload as any)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(await updateTenantStatus(vars.id, { status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.tenants.lists() });
    },
  });

  const addUser = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<User> & { role_id?: number; password?: string } }) =>
      ensureSuccess(await addTenantUser(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.users(vars.id) });
    },
  });

  const updateModule = useMutation({
    mutationFn: async (vars: { id: string | number; module_id: number; status: string }) =>
      ensureSuccess(await updateTenantModule(vars.id, { module_id: vars.module_id, status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.modules(vars.id) });
    },
  });

  return { create, update, updateStatus, addUser, updateModule } as const;
}

