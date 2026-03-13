/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  CreateSupportOperationalExceptionNoteRequest,
  SendSupportEmailRequest,
  SupportOperationalExceptionContextParams,
  SupportActivityLogParams,
  UpdateSupportOperationalExceptionDecisionRequest,
  UpdateSupportOperationalAssetRentalRequest,
  UpdateSupportOperationalMarketplaceAccountingRequest,
  UpdateSupportOperationalModulesRequest,
  UpdateSupportOperationalPreferencesRequest,
  UpdateSupportProfileContactDomainRequest,
  UpdateSupportProfileIdentityRequest,
  UpdateSupportTenantConfigRequest,
} from "@/types/api";
import {
  getSupportGlobalConfig,
  getSupportDiagnostics,
  getSupportOperationalExceptionContext,
  getSupportOperationalSettings,
  getSupportPolicyDefinitions,
  getSupportProfileSettings,
  getSupportSystemReadiness,
  getSupportTenantConfig,
  listSupportActivityLogs,
  listSupportEmailTemplates,
  sendSupportEmail,
  createSupportOperationalExceptionNote,
  updateSupportOperationalAssetRental,
  updateSupportOperationalExceptionDecision,
  updateSupportOperationalMarketplaceAccounting,
  updateSupportOperationalModules,
  updateSupportOperationalPreferences,
  updateSupportProfileContactDomain,
  updateSupportProfileIdentity,
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

export function useSupportSystemReadiness() {
  return useQuery({
    queryKey: QK.settings.supportReadiness(),
    queryFn: async () => ensureSuccess(await getSupportSystemReadiness()),
  });
}

export function useSupportDiagnostics() {
  return useQuery({
    queryKey: QK.settings.supportDiagnostics(),
    queryFn: async () => ensureSuccess(await getSupportDiagnostics()),
  });
}

export function useSupportPolicyDefinitions() {
  return useQuery({
    queryKey: [...QK.settings.supportOperationalSettings(), "policy-definitions"],
    queryFn: async () => ensureSuccess(await getSupportPolicyDefinitions()),
  });
}

export function useSupportProfileSettings() {
  return useQuery({
    queryKey: QK.settings.supportProfileSettings(),
    queryFn: async () => ensureSuccess(await getSupportProfileSettings()),
  });
}

export function useSupportOperationalSettings() {
  return useQuery({
    queryKey: QK.settings.supportOperationalSettings(),
    queryFn: async () => ensureSuccess(await getSupportOperationalSettings()),
  });
}

export function useSupportTenantConfigActions() {
  const qc = useQueryClient();
  const saveTenantConfig = useMutation({
    mutationFn: async (payload: UpdateSupportTenantConfigRequest) =>
      ensureSuccess(await updateSupportTenantConfig(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.settings.supportReadiness() });
      qc.invalidateQueries({ queryKey: QK.settings.supportTenantConfig() });
      toast.success("Pengaturan tenant berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan pengaturan tenant.");
    },
  });

  return { saveTenantConfig } as const;
}

export function useSupportProfileActions() {
  const qc = useQueryClient();

  const saveIdentity = useMutation({
    mutationFn: async (payload: UpdateSupportProfileIdentityRequest) =>
      ensureSuccess(await updateSupportProfileIdentity(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.settings.supportReadiness() });
      qc.invalidateQueries({ queryKey: QK.settings.supportProfileSettings() });
      qc.invalidateQueries({ queryKey: QK.settings.supportTenantConfig() });
      toast.success("Identitas tenant berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan identitas tenant.");
    },
  });

  const saveContactDomain = useMutation({
    mutationFn: async (payload: UpdateSupportProfileContactDomainRequest) =>
      ensureSuccess(await updateSupportProfileContactDomain(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.settings.supportReadiness() });
      qc.invalidateQueries({ queryKey: QK.settings.supportProfileSettings() });
      qc.invalidateQueries({ queryKey: QK.settings.supportTenantConfig() });
      toast.success("Kontak dan domain berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan kontak dan domain.");
    },
  });

  return { saveIdentity, saveContactDomain } as const;
}

export function useSupportOperationalActions() {
  const qc = useQueryClient();
  const invalidateOperational = () => {
    qc.invalidateQueries({ queryKey: QK.settings.supportReadiness() });
    qc.invalidateQueries({ queryKey: QK.settings.supportOperationalSettings() });
    qc.invalidateQueries({ queryKey: QK.settings.supportTenantConfig() });
  };

  const savePreferences = useMutation({
    mutationFn: async (payload: UpdateSupportOperationalPreferencesRequest) =>
      ensureSuccess(await updateSupportOperationalPreferences(payload)),
    onSuccess: () => {
      invalidateOperational();
      toast.success("Preferensi tenant berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan preferensi tenant.");
    },
  });

  const saveModules = useMutation({
    mutationFn: async (payload: UpdateSupportOperationalModulesRequest) =>
      ensureSuccess(await updateSupportOperationalModules(payload)),
    onSuccess: () => {
      invalidateOperational();
      toast.success("Aktivasi modul berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan aktivasi modul.");
    },
  });

  const saveAssetRental = useMutation({
    mutationFn: async (payload: UpdateSupportOperationalAssetRentalRequest) =>
      ensureSuccess(await updateSupportOperationalAssetRental(payload)),
    onSuccess: () => {
      invalidateOperational();
      toast.success("Pengaturan asset rental berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan asset rental.");
    },
  });

  const saveMarketplaceAccounting = useMutation({
    mutationFn: async (payload: UpdateSupportOperationalMarketplaceAccountingRequest) =>
      ensureSuccess(await updateSupportOperationalMarketplaceAccounting(payload)),
    onSuccess: () => {
      invalidateOperational();
      toast.success("Pengaturan marketplace dan accounting berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan marketplace dan accounting.");
    },
  });

  return { savePreferences, saveModules, saveAssetRental, saveMarketplaceAccounting } as const;
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

export function useSupportOperationalExceptionContext(
  params?: SupportOperationalExceptionContextParams
) {
  return useQuery({
    queryKey: params
      ? QK.settings.operationalExceptionContext(params.domain, params.source_id)
      : ["settings", "support", "operational-exception", "empty"],
    enabled: Boolean(params?.domain && params?.source_id),
    queryFn: async () => ensureSuccess(await getSupportOperationalExceptionContext(params!)),
  });
}

export function useSupportOperationalExceptionActions(
  domain?: string,
  sourceId?: string | number
) {
  const qc = useQueryClient();
  const invalidateContext = () => {
    if (!domain || sourceId === undefined || sourceId === null || sourceId === "") {
      return;
    }
    qc.invalidateQueries({
      queryKey: QK.settings.operationalExceptionContext(domain, sourceId),
    });
  };

  const saveNote = useMutation({
    mutationFn: async (payload: CreateSupportOperationalExceptionNoteRequest) =>
      ensureSuccess(await createSupportOperationalExceptionNote(payload)),
    onSuccess: () => {
      invalidateContext();
      toast.success("Catatan exception berhasil disimpan.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan catatan exception.");
    },
  });

  const applyDecision = useMutation({
    mutationFn: async (payload: UpdateSupportOperationalExceptionDecisionRequest) =>
      ensureSuccess(await updateSupportOperationalExceptionDecision(payload)),
    onSuccess: (_, vars) => {
      invalidateContext();
      toast.success(
        vars.status === "resolved"
          ? "Exception ditandai selesai."
          : "Exception berhasil dieskalasi."
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal memperbarui status exception.");
    },
  });

  return { saveNote, applyDecision } as const;
}
