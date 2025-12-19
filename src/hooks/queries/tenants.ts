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
} from "@/types/api";
import {
  getTenantByDomain,
  registerTenant,
  updateTenantProfile,
  updateTenantStatus,
  verifyTenant,
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
        queryKey: QK.tenants.profile(vars.tenantId),
      });
      toast.success("Status tenant diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui status tenant"),
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
    saveProfile,
  } as const;
}
