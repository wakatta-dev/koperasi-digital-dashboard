/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateNotificationRequest,
  Notification,
  NotificationStatus,
} from "@/types/api";
import {
  listNotifications,
  createNotification,
  updateNotificationStatus,
  listVendorNotifications,
  vendorBroadcastNotification,
  vendorBulkNotification,
} from "@/services/api";
import { listNotificationReminders, upsertNotificationReminders } from "@/services/api/vendor";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import { toast } from "sonner";

export function useNotifications(
  params?: Record<string, string | number>,
  initialData?: Notification[] | undefined,
  options?: { refetchInterval?: number; scope?: "tenant" | "vendor" }
) {
  const scope = options?.scope ?? "tenant";
  return useQuery({
    queryKey: QK.notifications.list({ ...(params ?? {}), scope }),
    queryFn: async () =>
      ensureSuccess(
        scope === "vendor"
          ? await listVendorNotifications(params)
          : await listNotifications(params)
      ),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval ? { refetchInterval: options.refetchInterval } : {}),
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: CreateNotificationRequest) =>
      ensureSuccess(await createNotification(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.all });
      toast.success("Notifikasi dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat notifikasi"),
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: NotificationStatus }) =>
      ensureSuccess(
        await updateNotificationStatus(vars.id, { status: vars.status })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.all });
      toast.success("Status notifikasi diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui notifikasi"),
  });

  const vendorBroadcast = useMutation({
    mutationFn: async (payload: {
      message: string;
      targetType: "SINGLE" | "ALL" | "GROUP";
      tenantIDs?: number[];
      category: string;
    }) => ensureSuccess(await vendorBroadcastNotification(payload as any)),
    onSuccess: () => {
      toast.success("Broadcast dikirim");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal broadcast notifikasi"),
  });

  const vendorBulk = useMutation({
    mutationFn: async (payload: {
      message: string;
      targetType: "SINGLE" | "ALL" | "GROUP";
      segment: "VENDOR" | "KOPERASI" | "UMKM" | "BUMDES";
    }) => ensureSuccess(await vendorBulkNotification(payload as any)),
    onSuccess: () => {
      toast.success("Bulk notifikasi dijadwalkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat bulk notifikasi"),
  });

  return { create, updateStatus, vendorBroadcast, vendorBulk } as const;
}

export function useNotificationReminders(initialData?: any[] | undefined) {
  return useQuery({
    queryKey: ["notifications", "reminders"],
    queryFn: async () => ensureSuccess(await listNotificationReminders()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationReminderActions() {
  const qc = useQueryClient();
  const upsert = useMutation({
    mutationFn: async (payload: any[]) => ensureSuccess(await upsertNotificationReminders(payload as any)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications", "reminders"] });
      toast.success("Konfigurasi reminder disimpan");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menyimpan reminder");
    }
  });
  return { upsert } as const;
}
