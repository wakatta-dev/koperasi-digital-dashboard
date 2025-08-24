/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Notification } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listNotifications(
  params?: Record<string, string | number>
): Promise<ApiResponse<Notification[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  console.log(`${API_PREFIX}${API_ENDPOINTS.notifications.list}${query}`);
  return api.get<Notification[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.list}${query}`
  );
}

export function createNotification(
  payload: Partial<Notification>
): Promise<ApiResponse<Notification>> {
  return api.post<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.create}`,
    payload
  );
}

export function updateNotificationStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<Notification>> {
  return api.patch<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.status(id)}`,
    payload
  );
}
