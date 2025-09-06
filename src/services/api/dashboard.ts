/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, DashboardSummary, TrendData, DashboardNotification } from "@/types/api";
import { api, API_PREFIX } from "./base";

// Koperasi dashboard endpoints (per docs/modules/dashboard.md)

export function getKoperasiDashboardSummary(params?: { tenant_id?: string | number }): Promise<ApiResponse<DashboardSummary>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.summary}`;
  return api.get<DashboardSummary>(q ? `${path}?${q}` : path);
}

export function getKoperasiDashboardTrend(params?: {
  tenant_id?: string | number;
  start?: string;
  end?: string;
}): Promise<ApiResponse<TrendData[]>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.trend}`;
  return api.get<TrendData[]>(q ? `${path}?${q}` : path);
}

export function getKoperasiDashboardNotifications(params?: {
  tenant_id?: string | number;
}): Promise<ApiResponse<DashboardNotification[]>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.notifications}`;
  return api.get<DashboardNotification[]>(q ? `${path}?${q}` : path);
}
