/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminTenantDetail,
  getAdminTenantSubscription,
  listAdminTenants,
  updateAdminTenantProfile,
  updateAdminTenantStatus,
} from "@/services/api";
import type {
  AdminTenantUpdateProfileRequest,
  AdminTenantUpdateStatusRequest,
} from "@/types/api";
import { QK } from "./queryKeys";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function useAdminTenants(params?: {
  cursor?: string | number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: QK.adminTenants.list(params),
    queryFn: async () => {
      const res = await listAdminTenants(params);
      if (!res.success) {
        throw new Error(getErrorMessage(new Error(res.message), "Gagal memuat tenant."));
      }
      return res;
    },
  });
}

export function useAdminTenantDetail(
  tenantId?: string | number,
  params?: { cursor?: string | number; limit?: number }
) {
  return useQuery({
    queryKey: QK.adminTenants.detail(tenantId ?? "", params),
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const res = await getAdminTenantDetail(tenantId as string | number, params);
      if (!res.success) {
        throw new Error(getErrorMessage(new Error(res.message), "Gagal memuat detail tenant."));
      }
      return res;
    },
  });
}

export function useAdminTenantSubscription(tenantId?: string | number) {
  return useQuery({
    queryKey: QK.adminTenants.subscription(tenantId ?? ""),
    enabled: Boolean(tenantId),
    queryFn: async ({ signal }) => {
      const res = await getAdminTenantSubscription(tenantId as string | number, {
        signal,
      });
      if (!res.success) {
        throw new Error(
          getErrorMessage(new Error(res.message), "Gagal memuat subscription tenant.")
        );
      }
      return res;
    },
  });
}

export function useAdminTenantActions() {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (vars: {
      tenantId: string | number;
      payload: AdminTenantUpdateStatusRequest;
    }) => {
      const res = await updateAdminTenantStatus(vars.tenantId, vars.payload);
      if (!res.success) {
        throw new Error(getErrorMessage(new Error(res.message), "Gagal memperbarui status tenant."));
      }
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.adminTenants.all });
      qc.invalidateQueries({
        queryKey: QK.adminTenants.detail(vars.tenantId),
      });
      qc.invalidateQueries({ queryKey: QK.vendorDashboard.summary() });
      toast.success("Status tenant diperbarui.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui status tenant."));
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (vars: {
      tenantId: string | number;
      payload: AdminTenantUpdateProfileRequest;
    }) => {
      const res = await updateAdminTenantProfile(vars.tenantId, vars.payload);
      if (!res.success) {
        throw new Error(getErrorMessage(new Error(res.message), "Gagal memperbarui profil tenant."));
      }
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.adminTenants.all });
      qc.invalidateQueries({
        queryKey: QK.adminTenants.detail(vars.tenantId),
      });
      toast.success("Profil tenant diperbarui.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui profil tenant."));
    },
  });

  return {
    updateStatus,
    updateProfile,
  } as const;
}
