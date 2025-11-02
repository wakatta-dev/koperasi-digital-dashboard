/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type { Notification, NotificationMetrics } from "@/types/api";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationMetrics,
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
    queryKey: QK.notifications.metrics(),
    queryFn: async () => ensureSuccess(await getNotificationMetrics()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();

  const markRead = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await markNotificationRead(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.list() });
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

  return { markRead, markAll } as const;
}
