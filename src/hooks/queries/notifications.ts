/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/types/api";
import {
  listNotifications,
  createNotification,
  updateNotificationStatus,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

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
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(
        await updateNotificationStatus(vars.id, { status: vars.status })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.notifications.all });
    },
  });

  return { create, updateStatus } as const;
}
