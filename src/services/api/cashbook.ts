/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "../auth";

// Create manual cash entry
export function createManualCashEntry(payload: {
  amount: number;
  type: "in" | "out";
  category: string;
  note?: string;
}): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.cashbook.manual}`, payload);
}

// Get summary between optional dates
export function getCashSummary(params?: {
  start?: string; // RFC3339
  end?: string; // RFC3339
}): Promise<ApiResponse<any>> {
  const search = new URLSearchParams();
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.cashbook.summary}`;
  return api.get<any>(q ? `${path}?${q}` : path);
}

// Export summary (binary) using raw fetch to preserve Content-Type
export async function exportCashSummaryRaw(payload: {
  report_type: string;
  start?: string;
  end?: string;
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
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.cashbook.export}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

