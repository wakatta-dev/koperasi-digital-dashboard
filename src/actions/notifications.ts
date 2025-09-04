/** @format */

"use server";

import { apiRequest } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Notification } from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listNotifications as listNotificationsService,
  createNotification as createNotificationService,
  updateNotificationStatus as updateNotificationStatusService,
} from "@/services/api";

export async function listNotifications(params?: {
  limit?: number;
  cursor?: string;
}): Promise<ApiResponse<Notification[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.notifications.list}?${search.toString()}`
    : API_ENDPOINTS.notifications.list;
  return apiRequest<Notification[]>(endpoint);
}

export async function createNotification(payload: {
  title: string;
  message: string;
}): Promise<ApiResponse<Notification>> {
  return apiRequest<Notification>(API_ENDPOINTS.notifications.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNotificationStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<Notification>> {
  return apiRequest<Notification>(API_ENDPOINTS.notifications.status(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listNotificationsAction(
  params?: Record<string, string | number>
) {
  try {
    const res = await listNotificationsService(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListNotificationsActionResult = Awaited<
  ReturnType<typeof listNotificationsAction>
>;

export async function createNotificationAction(payload: Partial<Notification>) {
  try {
    const res = await createNotificationService(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreateNotificationActionResult = Awaited<
  ReturnType<typeof createNotificationAction>
>;

export async function updateNotificationStatusAction(
  id: string | number,
  payload: { status: string }
) {
  try {
    const res = await updateNotificationStatusService(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type UpdateNotificationStatusActionResult = Awaited<
  ReturnType<typeof updateNotificationStatusAction>
>;
