/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  NotificationReminder,
  ReminderRequest,
  ReportExportMeta,
  VendorFinancialReport,
  VendorUsageReport,
} from "@/types/api";
import type { VendorDashboard } from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "../auth";

// Vendor Dashboard
export function getVendorDashboard(): Promise<ApiResponse<VendorDashboard>> {
  return api.get<VendorDashboard>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.dashboard}`
  );
}

// Vendor Reports
export function getVendorFinancialReport(params?: {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  group_by?: string; // month|quarter|year
}): Promise<ApiResponse<VendorFinancialReport>> {
  const search = new URLSearchParams();
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  if (params?.group_by) search.set("group_by", params.group_by);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.vendor.reports.financial}`;
  return api.get<VendorFinancialReport>(q ? `${path}?${q}` : path);
}

export function getVendorUsageReport(params?: {
  tenant?: string | number;
  module?: string;
}): Promise<ApiResponse<VendorUsageReport>> {
  const search = new URLSearchParams();
  if (params?.tenant) search.set("tenant", String(params.tenant));
  if (params?.module) search.set("module", params.module);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.vendor.reports.usage}`;
  return api.get<VendorUsageReport>(q ? `${path}?${q}` : path);
}

// Export returns a file; perform a raw fetch with headers
export async function exportVendorReportRaw(payload: {
  report_type: string; // financial|usage
  format: string; // pdf|xlsx
  params?: Record<string, any>;
}): Promise<Blob> {
  const [accessToken, tenantId] = await Promise.all([
    getAccessToken(),
    getTenantId(),
  ]);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (tenantId) headers["X-Tenant-ID"] = tenantId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.vendor.reports.export}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

export function listVendorReportExports(): Promise<ApiResponse<ReportExportMeta[]>> {
  return api.get<ReportExportMeta[]>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.reports.exports}`
  );
}

// Vendor → Tenants (self-registration + verify + status)
export function registerTenantVendor(payload: any): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.vendor.tenants}`, payload);
}

export function verifyTenantRegistration(payload: any): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.tenantsVerify}`,
    payload
  );
}

export function updateVendorTenantStatus(
  id: string | number,
  payload: { is_active: boolean }
): Promise<ApiResponse<any>> {
  return api.patch<any>(
    `${API_PREFIX}${API_ENDPOINTS.vendor.tenantStatus(id)}`,
    payload
  );
}

// Notifications → reminders
export function listNotificationReminders(): Promise<
  ApiResponse<NotificationReminder[]>
> {
  return api.get<NotificationReminder[]>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`
  );
}

export function upsertNotificationReminders(
  payload: ReminderRequest[]
): Promise<ApiResponse<null>> {
  return api.put<null>(
    `${API_PREFIX}${API_ENDPOINTS.notifications.reminders}`,
    payload
  );
}

// Payment gateway webhook simulator (for testing)
export function postPaymentGatewayWebhook(
  gateway: string,
  payload: any
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.gateways.webhook(gateway)}`,
    payload
  );
}
