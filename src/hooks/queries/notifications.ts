/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/types/api";
import {
  listNotifications,
  createNotification,
  updateNotificationStatus,
} from "@/services/api";
import { listNotificationReminders, upsertNotificationReminders } from "@/services/api/vendor";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import { toast } from "sonner";

export function useNotifications(
  params?: Record<string, string | number>,
  initialData?: Notification[] | undefined
) {
  return useQuery({
    queryKey: QK.notifications.list(params),
    queryFn: async () => ensureSuccess(await listNotifications(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: Partial<Notification>) =>
      ensureSuccess(await createNotification(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.all });
      toast.success("Notifikasi dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat notifikasi"),
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(
        await updateNotificationStatus(vars.id, { status: vars.status })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.all });
      toast.success("Status notifikasi diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui notifikasi"),
  });

  return { create, updateStatus } as const;
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
