/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  inviteAdminTenantAccount,
  listAdminTenantAccounts,
  requestAdminTenantAccountEmailChange,
  resetAdminTenantAccountPassword,
  updateAdminTenantAccountRole,
  updateAdminTenantAccountStatus,
} from "@/services/api";
import type {
  AdminTenantAccountChangeEmailRequest,
  AdminTenantAccountInvitationRequest,
  AdminTenantAccountRoleRequest,
  AdminTenantAccountStatusRequest,
} from "@/types/api";
import { QK } from "./queryKeys";

function message(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function useAdminTenantAccounts(
  tenantId?: string | number,
  params?: {
    cursor?: string | number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }
) {
  return useQuery({
    queryKey: QK.adminTenantAccounts.list(tenantId ?? "", params),
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const res = await listAdminTenantAccounts(
        tenantId as string | number,
        params
      );
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal memuat akun tenant."));
      }
      return res;
    },
  });
}

export function useAdminTenantAccountActions(tenantId?: string | number) {
  const qc = useQueryClient();
  const invalidate = () => {
    if (!tenantId) return;
    qc.invalidateQueries({
      queryKey: QK.adminTenantAccounts.list(tenantId),
    });
    qc.invalidateQueries({
      queryKey: QK.adminTenants.detail(tenantId),
    });
  };

  const invite = useMutation({
    mutationFn: async (payload: AdminTenantAccountInvitationRequest) => {
      const res = await inviteAdminTenantAccount(tenantId as string | number, payload);
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal mengundang akun tenant."));
      }
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Undangan akun tenant dijadwalkan.");
    },
    onError: (error) => toast.error(message(error, "Gagal mengundang akun tenant.")),
  });

  const changeEmail = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      payload: AdminTenantAccountChangeEmailRequest;
    }) => {
      const res = await requestAdminTenantAccountEmailChange(
        tenantId as string | number,
        vars.userId,
        vars.payload
      );
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal meminta perubahan email."));
      }
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Perubahan email dijadwalkan.");
    },
    onError: (error) => toast.error(message(error, "Gagal meminta perubahan email.")),
  });

  const resetPassword = useMutation({
    mutationFn: async (userId: string | number) => {
      const res = await resetAdminTenantAccountPassword(
        tenantId as string | number,
        userId
      );
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal reset password."));
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reset password dijadwalkan.");
    },
    onError: (error) => toast.error(message(error, "Gagal reset password.")),
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      payload: AdminTenantAccountStatusRequest;
    }) => {
      const res = await updateAdminTenantAccountStatus(
        tenantId as string | number,
        vars.userId,
        vars.payload
      );
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal memperbarui status akun."));
      }
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Status akun tenant diperbarui.");
    },
    onError: (error) => toast.error(message(error, "Gagal memperbarui status akun.")),
  });

  const updateRole = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      payload: AdminTenantAccountRoleRequest;
    }) => {
      const res = await updateAdminTenantAccountRole(
        tenantId as string | number,
        vars.userId,
        vars.payload
      );
      if (!res.success) {
        throw new Error(message(new Error(res.message), "Gagal memperbarui role akun."));
      }
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Role akun tenant diperbarui.");
    },
    onError: (error) => toast.error(message(error, "Gagal memperbarui role akun.")),
  });

  return {
    invite,
    changeEmail,
    resetPassword,
    updateStatus,
    updateRole,
  } as const;
}
