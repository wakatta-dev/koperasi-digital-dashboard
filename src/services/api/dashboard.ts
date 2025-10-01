/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  BumdesDashboardSummary,
  DashboardSummaryFor,
  KoperasiDashboardSummary,
  TenantType,
  UmkmDashboardSummary,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function getDashboardSummary<T extends TenantType>(
  tenantType: T
): Promise<ApiResponse<DashboardSummaryFor<T>>> {
  return api.get<DashboardSummaryFor<T>>(
    `${API_PREFIX}/${tenantType}/dashboard`
  );
}

/**
 * Fetch koperasi dashboard summary as described in docs/modules/core/dashboard.md.
 * Optional tenant_id query remains for multi-tenant tooling (mostly during vendor support).
 */
export function getKoperasiDashboard(params?: {
  tenant_id?: string | number;
}): Promise<ApiResponse<KoperasiDashboardSummary>> {
  if (!params?.tenant_id) {
    return getDashboardSummary("koperasi");
  }

  const search = new URLSearchParams();
  search.set("tenant_id", String(params.tenant_id));
  const query = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard}`;
  return api.get<KoperasiDashboardSummary>(`${path}?${query}`);
}

/**
 * Backward compatible alias while the rest of the kodebase is updated.
 */
export const getKoperasiDashboardSummary = getKoperasiDashboard;

export function getBumdesDashboard(): Promise<
  ApiResponse<BumdesDashboardSummary>
> {
  return getDashboardSummary("bumdes");
}

export function getUmkmDashboard(): Promise<ApiResponse<UmkmDashboardSummary>> {
  return getDashboardSummary("umkm");
}
