/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "../auth";

// SHU module client wrappers (per docs/modules/shu.md)

export function createYearlySHU(payload: {
  year: number;
  total_shu: number;
}): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.shu.yearly}`, payload);
}

export function simulateSHU(year: number | string): Promise<ApiResponse<any[]>> {
  return api.post<any[]>(`${API_PREFIX}${API_ENDPOINTS.shu.simulate(year)}`);
}

export function distributeSHU(
  year: number | string,
  payload?: { method?: string; description?: string }
): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.shu.distribute(year)}`, payload);
}

export function listSHUHistory(): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(`${API_PREFIX}${API_ENDPOINTS.shu.history}`);
}

export function listSHUByMember(memberId: string | number): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(`${API_PREFIX}${API_ENDPOINTS.shu.member(memberId)}`);
}

// Export SHU for a given year (binary)
export async function exportSHURaw(year: number | string): Promise<Blob> {
  const [accessToken, tenantId] = await Promise.all([
    getAccessToken(),
    getTenantId(),
  ]);
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (tenantId) headers["X-Tenant-ID"] = String(tenantId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.shu.export(year)}`,
    { headers }
  );
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

