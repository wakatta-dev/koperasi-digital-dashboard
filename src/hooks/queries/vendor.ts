/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  VendorAccountInvitationRequest,
  VendorChangeEmailRequest,
  VendorDeactivatePayload,
} from "@/types/api";
import {
  confirmVendorEmailChange,
  inviteVendorTenantAccount,
  requestVendorTenantEmailChange,
  deactivateVendorTenant,
} from "@/services/api";

export function useVendorEmailChangeConfirmation(token?: string) {
  return useQuery({
    queryKey: ["vendor", "email-change", token ?? ""],
    enabled: !!token,
    queryFn: async () => ensureSuccess(await confirmVendorEmailChange(token as string)),
  });
}

export function useVendorAccountActions(tenantId: string | number) {
  const qc = useQueryClient();

  const inviteAccount = useMutation({
    mutationFn: async (payload: VendorAccountInvitationRequest) =>
      ensureSuccess(await inviteVendorTenantAccount(tenantId, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendor.accounts(tenantId) });
      toast.success("Undangan akun terkirim");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal mengundang akun tenant"),
  });

  const changeEmail = useMutation({
    mutationFn: async (vars: {
      userId: string | number;
      payload: VendorChangeEmailRequest;
    }) =>
      ensureSuccess(
        await requestVendorTenantEmailChange(
          tenantId,
          vars.userId,
          vars.payload,
        ),
      ),
    onSuccess: () => {
      toast.success("Permintaan perubahan email dikirim");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal mengirim permintaan perubahan email"),
  });

  const deactivateTenant = useMutation({
    mutationFn: async (payload: VendorDeactivatePayload) =>
      ensureSuccess(await deactivateVendorTenant(tenantId, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendor.deactivate(tenantId) });
      toast.success("Tenant berhasil dinonaktifkan");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal menonaktifkan tenant"),
  });

  return { inviteAccount, changeEmail, deactivateTenant } as const;
}
