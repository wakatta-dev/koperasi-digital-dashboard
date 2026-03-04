/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  SendSupportEmailRequest,
  SupportActivityLogParams,
  UpdateSupportTenantConfigRequest,
} from "@/types/api";
import {
  getSupportGlobalConfig,
  getSupportTenantConfig,
  listSupportActivityLogs,
  listSupportEmailTemplates,
  sendSupportEmail,
  updateSupportEmailTemplate,
  updateSupportTenantConfig,
} from "@/services/api";

export function useSupportGlobalConfig() {
  return useQuery({
    queryKey: QK.settings.supportGlobalConfig(),
    queryFn: async () => ensureSuccess(await getSupportGlobalConfig()),
  });
}

export function useSupportTenantConfig() {
  return useQuery({
    queryKey: QK.settings.supportTenantConfig(),
    queryFn: async () => ensureSuccess(await getSupportTenantConfig()),
  });
}

export function useSupportTenantConfigActions() {
  const qc = useQueryClient();
  const saveTenantConfig = useMutation({
    mutationFn: async (payload: UpdateSupportTenantConfigRequest) =>
      ensureSuccess(await updateSupportTenantConfig(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.settings.supportTenantConfig() });
      toast.success("Pengaturan operasional berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan pengaturan operasional.");
    },
  });

  return { saveTenantConfig } as const;
}

export function useSupportEmailTemplates() {
  return useQuery({
    queryKey: QK.settings.emailTemplates(),
    queryFn: async () => ensureSuccess(await listSupportEmailTemplates()),
  });
}

export function useSupportEmailActions() {
  const qc = useQueryClient();

  const saveTemplate = useMutation({
    mutationFn: async (vars: { id: string | number; subject: string; body: string }) =>
      ensureSuccess(await updateSupportEmailTemplate(vars.id, {
        subject: vars.subject,
        body: vars.body,
      })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.settings.emailTemplates() });
      toast.success("Template email berhasil diperbarui.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal memperbarui template email.");
    },
  });

  const sendTestEmail = useMutation({
    mutationFn: async (payload: SendSupportEmailRequest) =>
      ensureSuccess(await sendSupportEmail(payload)),
    onSuccess: () => {
      toast.success("Email uji berhasil dikirim.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal mengirim email uji.");
    },
  });

  return { saveTemplate, sendTestEmail } as const;
}

export function useSupportActivityLogs(params?: SupportActivityLogParams) {
  return useQuery({
    queryKey: QK.settings.activityLogs(
      params ? (params as Record<string, unknown>) : {}
    ),
    queryFn: async () => {
      const res = await listSupportActivityLogs(params);
      if (!res.success) {
        const message =
          Object.values(res.errors ?? {})
            .flat()
            .join("; ") || res.message || "Gagal memuat activity log";
        throw new Error(message);
      }
      return res;
    },
  });
}
