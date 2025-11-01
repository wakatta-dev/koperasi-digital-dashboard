/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Notification,
  NotificationMetrics,
  NotificationPreferences,
  NotificationPreferencePayload,
  NotificationTemplateList,
  NotificationTemplate,
  NotificationTemplatePreview,
  NotificationTemplateVersion,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "../auth";

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

export async function exportNotifications(
  params?: { channel?: string; start?: string; end?: string; limit?: number },
): Promise<Blob> {
  const [accessToken, tenantId] = await Promise.all([
    getAccessToken(),
    getTenantId(),
  ]);
  const search = new URLSearchParams();
  if (params?.channel) search.set("channel", params.channel);
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  const query = search.toString() ? `?${search.toString()}` : "";
  const headers: Record<string, string> = {
    Accept: "text/csv",
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (tenantId) headers["X-Tenant-ID"] = tenantId;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.notifications.export}${query}`,
    { method: "GET", headers },
  );
  if (!res.ok) {
    throw new Error(res.statusText || "Failed to export notifications");
  }
  return res.blob();
}

export function listNotificationFailures(
  params?: { limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<Record<string, unknown>[]>> {
  const search = new URLSearchParams();
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (params?.cursor) search.set("cursor", params.cursor);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Record<string, unknown>[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.failures}${query}`,
    { signal: opts?.signal },
  );
}

export function getNotificationFailure(
  id: string | number,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.get<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.failureDetail(id)}`,
  );
}

export function getNotificationPreferences(
  params?: { updated_after?: string },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<NotificationPreferences>> {
  const search = new URLSearchParams();
  if (params?.updated_after) search.set("updated_after", params.updated_after);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<NotificationPreferences>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.preferences}${query}`,
    { signal: opts?.signal },
  );
}

export function updateNotificationPreferences(
  payload: NotificationPreferencePayload,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.put<Record<string, unknown>>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.preferences}`,
    payload,
  );
}

export function listNotificationTemplates(
  params?: { channel?: string; category?: string; q?: string; limit?: number; offset?: number },
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<NotificationTemplateList>> {
  const search = new URLSearchParams();
  if (params?.channel) search.set("channel", params.channel);
  if (params?.category) search.set("category", params.category);
  if (params?.q) search.set("q", params.q);
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (typeof params?.offset !== "undefined") {
    search.set("offset", String(params.offset));
  }
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<NotificationTemplateList>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.templates}${query}`,
    { signal: opts?.signal },
  );
}

export function getNotificationTemplate(
  id: string | number,
): Promise<ApiResponse<NotificationTemplate>> {
  return api.get<NotificationTemplate>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.templateDetail(id)}`,
  );
}

export function getNotificationTemplatePreview(
  id: string | number,
): Promise<ApiResponse<NotificationTemplatePreview>> {
  return api.get<NotificationTemplatePreview>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.templatePreview(id)}`,
  );
}

export function listNotificationTemplateVersions(
  id: string | number,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<NotificationTemplateVersion[]>> {
  return api.get<NotificationTemplateVersion[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.templateVersions(id)}`,
    { signal: opts?.signal },
  );
}
