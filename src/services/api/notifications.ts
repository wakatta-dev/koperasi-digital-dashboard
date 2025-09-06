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

// Tenant reminders (koperasi)
export function listTenantReminders(): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`
  );
}

export function upsertTenantReminders(payload: any[]): Promise<ApiResponse<null>> {
  return api.put<null>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`,
    payload
  );
}

export function vendorBroadcastNotification(payload: {
  message: string;
  targetType: "SINGLE" | "ALL" | "GROUP";
  tenantIDs?: number[];
  category: string;
}): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.broadcast}`,
    payload
  );
}

export function vendorBulkNotification(payload: {
  message: string;
  targetType: "SINGLE" | "ALL" | "GROUP";
  segment: "VENDOR" | "KOPERASI" | "UMKM" | "BUMDES";
}): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.vendor.bulk}`,
    payload
  );
}
