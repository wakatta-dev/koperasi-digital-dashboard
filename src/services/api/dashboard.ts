/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, KoperasiDashboardSummary } from "@/types/api";
import { api, API_PREFIX } from "./base";

/**
 * Fetch koperasi dashboard summary as described in docs/modules/core/dashboard.md.
 * Optional tenant_id query remains for multi-tenant tooling (mostly during vendor support).
 */
export function getKoperasiDashboard(params?: {
  tenant_id?: string | number;
}): Promise<ApiResponse<KoperasiDashboardSummary>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  const query = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiDashboard}`;
  return api.get<KoperasiDashboardSummary>(query ? `${path}?${query}` : path);
}

/**
 * Backward compatible alias while the rest of the kodebase is updated.
 */
export const getKoperasiDashboardSummary = getKoperasiDashboard;
