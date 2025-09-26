/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  KoperasiDashboardSummary,
  KoperasiTrendPoint,
  Notification,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

// Koperasi dashboard endpoints (per docs/modules/dashboard.md)

export function getKoperasiDashboardSummary(params?: {
  tenant_id?: string | number;
}): Promise<ApiResponse<KoperasiDashboardSummary>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.summary}`;
  return api.get<KoperasiDashboardSummary>(q ? `${path}?${q}` : path);
}

export function getKoperasiDashboardTrend(params?: {
  tenant_id?: string | number;
  start?: string;
  end?: string;
}): Promise<ApiResponse<KoperasiTrendPoint[]>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.trend}`;
  return api.get<KoperasiTrendPoint[]>(q ? `${path}?${q}` : path);
}

export function getKoperasiDashboardNotifications(params?: {
  tenant_id?: string | number;
  limit?: string | number;
  cursor?: string;
}): Promise<ApiResponse<Notification[]>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard.notifications}`;
  return api.get<Notification[]>(q ? `${path}?${q}` : path);
}
