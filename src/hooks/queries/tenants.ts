/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  RegisterTenantRequest,
  VerifyTenantRequest,
  TenantStatusRequest,
  TenantConfiguration,
  TenantConfigurationRequest,
  AuditLogQuery,
} from "@/types/api";
import {
  getTenantByDomain,
  getTenantAuditLogs,
  getTenantConfiguration,
  upsertTenantConfiguration,
  deleteTenantConfiguration,
  updateTenantProfile,
  registerTenant,
  verifyTenant,
  updateTenantStatus,
} from "@/services/api";

export function useTenantByDomain(
  domain?: string,
  initialData?: Record<string, unknown>,
) {
  return useQuery({
    queryKey: QK.tenants.byDomain(domain ?? ""),
    enabled: !!domain,
    queryFn: async () =>
      ensureSuccess(await getTenantByDomain(domain as string)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantAuditLogs(
  tenantId?: string | number,
  params?: AuditLogQuery,
  initialData?: Record<string, unknown>,
) {
  return useQuery({
    queryKey: QK.tenants.auditLogs(tenantId ?? "", params),
    enabled: !!tenantId,
    queryFn: async () =>
      ensureSuccess(
        await getTenantAuditLogs(tenantId as string | number, params),
      ),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantConfiguration(
  tenantId?: string | number,
  initialData?: TenantConfiguration,
) {
  return useQuery({
    queryKey: QK.tenants.configuration(tenantId ?? ""),
    enabled: !!tenantId,
    queryFn: async () =>
      ensureSuccess(await getTenantConfiguration(tenantId as string | number)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTenantActions() {
  const qc = useQueryClient();

  const register = useMutation({
    mutationFn: async (payload: RegisterTenantRequest) =>
      ensureSuccess(await registerTenant(payload)),
    onSuccess: () => {
      toast.success("Registrasi tenant berhasil");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal melakukan registrasi tenant"),
  });

  const verify = useMutation({
    mutationFn: async (payload: VerifyTenantRequest) =>
      ensureSuccess(await verifyTenant(payload)),
    onSuccess: () => {
      toast.success("Verifikasi tenant berhasil");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memverifikasi tenant"),
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: {
      tenantId: string | number;
      payload: TenantStatusRequest;
    }) =>
      ensureSuccess(await updateTenantStatus(vars.tenantId, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: QK.tenants.auditLogs(vars.tenantId),
      });
      toast.success("Status tenant diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui status tenant"),
  });

  const saveConfiguration = useMutation({
    mutationFn: async (vars: {
      tenantId: string | number;
      payload: TenantConfigurationRequest;
    }) =>
      ensureSuccess(
        await upsertTenantConfiguration(vars.tenantId, vars.payload),
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: QK.tenants.configuration(vars.tenantId),
      });
      toast.success("Konfigurasi tenant disimpan");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal menyimpan konfigurasi"),
  });

  const removeConfiguration = useMutation({
    mutationFn: async (tenantId: string | number) =>
      ensureSuccess(await deleteTenantConfiguration(tenantId)),
    onSuccess: (_, tenantId) => {
      qc.invalidateQueries({
        queryKey: QK.tenants.configuration(tenantId),
      });
      toast.success("Konfigurasi tenant dihapus");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal menghapus konfigurasi"),
  });

  const saveProfile = useMutation({
    mutationFn: async (vars: { tenantId: string | number; payload: FormData }) =>
      ensureSuccess(await updateTenantProfile(vars.tenantId, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tenants.profile(vars.tenantId) });
      toast.success("Profil tenant diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui profil tenant"),
  });

  return {
    register,
    verify,
    updateStatus,
    saveConfiguration,
    removeConfiguration,
    saveProfile,
  } as const;
}
