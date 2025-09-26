/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Notification,
  CreateNotificationRequest,
  UpdateNotificationStatusRequest,
  NotificationReminder,
  ReminderRequest,
  VendorBroadcastRequest,
  VendorBulkRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listNotifications(
  params?: Record<string, string | number>,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<Notification[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<Notification[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.list}${query}`,
    { signal: opts?.signal }
  );
}

export function createNotification(
  payload: CreateNotificationRequest
): Promise<ApiResponse<Notification>> {
  return api.post<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.create}`,
    payload
  );
}

export function updateNotificationStatus(
  id: string | number,
  payload: UpdateNotificationStatusRequest
): Promise<ApiResponse<Notification>> {
  return api.patch<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.status(id)}`,
    payload
  );
}

// Tenant reminders (koperasi)
export function listTenantReminders(): Promise<ApiResponse<NotificationReminder[]>> {
  return api.get<NotificationReminder[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`
  );
}

export function upsertTenantReminders(
  payload: ReminderRequest[]
): Promise<ApiResponse<null>> {
  return api.put<null>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`,
    payload
  );
}

export function listVendorNotifications(
  params?: Record<string, string | number>,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<Notification[]>> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<Notification[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.list}${query}`,
    { signal: opts?.signal }
  );
}

export function publishVendorNotification(
  id: string | number,
  payload?: FormData | BodyInit
): Promise<ApiResponse<Notification>> {
  return api.put<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.publish(id)}`,
    payload ?? {}
  );
}

export function unpublishVendorNotification(
  id: string | number
): Promise<ApiResponse<Notification>> {
  return api.put<Notification>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.unpublish(id)}`,
    {}
  );
}

export function vendorBroadcastNotification(
  payload: VendorBroadcastRequest
): Promise<ApiResponse<null>> {
  return api.post<null>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.broadcast}`,
    payload
  );
}

export function vendorBulkNotification(
  payload: VendorBulkRequest
): Promise<ApiResponse<null>> {
  return api.post<null>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.bulk}`,
    payload
  );
}
