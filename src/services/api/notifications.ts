/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Notification,
  NotificationMetrics,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

type NotificationQuery = {
  limit?: number;
  cursor?: string;
  filter?: "all" | "unread";
  category?: string;
  channel?: string;
};

export function listNotifications(
  params?: NotificationQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<Notification[]>> {
  const search = new URLSearchParams();
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.filter) search.set("filter", params.filter);
  if (params?.category) search.set("category", params.category);
  if (params?.channel) search.set("channel", params.channel);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Notification[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.list}${query}`,
    { signal: opts?.signal },
  );
}

export function markNotificationRead(
  id: string | number,
): Promise<ApiResponse<Notification>> {
  return api.patch<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.markRead(id)}`,
  );
}

export function markAllNotificationsRead(): Promise<
  ApiResponse<Record<string, number>>
> {
  return api.patch<Record<string, number>>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.markAllRead}`,
  );
}

export function getNotificationMetrics(): Promise<
  ApiResponse<NotificationMetrics>
> {
  return api.get<NotificationMetrics>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.dashboardMetrics}`,
  );
}
