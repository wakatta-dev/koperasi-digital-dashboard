/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  Notification,
  NotificationMetrics,
  NotificationPreferencePayload,
  NotificationPreferences,
  NotificationTemplate,
  NotificationTemplateList,
  NotificationTemplatePreview,
  NotificationTemplateVersion,
} from "@/types/api";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationMetrics,
  listNotificationFailures,
  getNotificationFailure,
  getNotificationPreferences,
  updateNotificationPreferences,
  listNotificationTemplates,
  getNotificationTemplate,
  getNotificationTemplatePreview,
  listNotificationTemplateVersions,
  exportNotifications,
} from "@/services/api";

export function useNotifications(
  params?: Record<string, unknown>,
  initialData?: Notification[],
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: QK.notifications.list(params),
    queryFn: async () => ensureSuccess(await listNotifications(params)),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval
      ? { refetchInterval: options.refetchInterval }
      : {}),
  });
}

export function useNotificationMetrics(initialData?: NotificationMetrics) {
  return useQuery({
    queryKey: QK.notifications.metrics,
    queryFn: async () => ensureSuccess(await getNotificationMetrics()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationFailures(
  params?: Record<string, unknown>,
  initialData?: Record<string, unknown>[],
) {
  return useQuery({
    queryKey: QK.notifications.failures(params),
    queryFn: async () => ensureSuccess(await listNotificationFailures(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationFailure(
  id?: string | number,
  initialData?: Record<string, unknown>,
) {
  return useQuery({
    queryKey: QK.notifications.failure(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getNotificationFailure(id as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationPreferences(
  params?: Record<string, unknown>,
  initialData?: NotificationPreferences,
) {
  return useQuery({
    queryKey: QK.notifications.preferences(params),
    queryFn: async () => ensureSuccess(await getNotificationPreferences(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationTemplates(
  params?: Record<string, unknown>,
  initialData?: NotificationTemplateList,
) {
  return useQuery({
    queryKey: QK.notifications.templates(params),
    queryFn: async () => ensureSuccess(await listNotificationTemplates(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationTemplate(
  id?: string | number,
  initialData?: NotificationTemplate,
) {
  return useQuery({
    queryKey: QK.notifications.template(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getNotificationTemplate(id as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationTemplatePreview(
  id?: string | number,
  initialData?: NotificationTemplatePreview,
) {
  return useQuery({
    queryKey: QK.notifications.templatePreview(id ?? ""),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await getNotificationTemplatePreview(id as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationTemplateVersions(
  id?: string | number,
  initialData?: NotificationTemplateVersion[],
) {
  return useQuery({
    queryKey: QK.notifications.templateVersions(id ?? ""),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await listNotificationTemplateVersions(id as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();

  const markRead = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await markNotificationRead(id)),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QK.notifications.list() });
      qc.invalidateQueries({ queryKey: QK.notifications.failure(id) });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal menandai notifikasi"),
  });

  const markAll = useMutation({
    mutationFn: async () => ensureSuccess(await markAllNotificationsRead()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.list() });
      toast.success("Semua notifikasi ditandai sudah dibaca");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal menandai semua notifikasi"),
  });

  const updatePreferences = useMutation({
    mutationFn: async (payload: NotificationPreferencePayload) =>
      ensureSuccess(await updateNotificationPreferences(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.preferences() });
      toast.success("Preferensi notifikasi diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui preferensi"),
  });

  const download = useMutation({
    mutationFn: async (params?: {
      channel?: string;
      start?: string;
      end?: string;
      limit?: number;
    }) => exportNotifications(params),
  });

  return { markRead, markAll, updatePreferences, download } as const;
}
