/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  FinanceReportResponse,
  BillingReportResponse,
  CashflowReportResponse,
  ProfitLossReportResponse,
  BalanceSheetReportResponse,
  ReportArchive,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";

export function getFinanceReport(params?: {
  tenant_id?: string | number;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}): Promise<ApiResponse<FinanceReportResponse>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.finance}`;
  return api.get<FinanceReportResponse>(q ? `${path}?${q}` : path);
}

export function getBillingReport(params?: {
  tenant_id?: string | number;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}): Promise<ApiResponse<BillingReportResponse>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.billing}`;
  return api.get<BillingReportResponse>(q ? `${path}?${q}` : path);
}

export function getCashflowReport(params?: {
  tenant_id?: string | number;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}): Promise<ApiResponse<CashflowReportResponse>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.cashflow}`;
  return api.get<CashflowReportResponse>(q ? `${path}?${q}` : path);
}

export function getProfitLossReport(params?: {
  tenant_id?: string | number;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}): Promise<ApiResponse<ProfitLossReportResponse>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.profitLoss}`;
  return api.get<ProfitLossReportResponse>(q ? `${path}?${q}` : path);
}

export function getBalanceSheetReport(params?: {
  tenant_id?: string | number;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}): Promise<ApiResponse<BalanceSheetReportResponse>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.balanceSheet}`;
  return api.get<BalanceSheetReportResponse>(q ? `${path}?${q}` : path);
}

// Tenant report export (binary)
export async function exportReportRaw(params: {
  tenant_id?: string | number;
  type: string; // profit-loss | balance-sheet | cashflow | finance | billing
  start?: string;
  end?: string;
  format?: "pdf" | "xlsx";
}): Promise<Blob> {
  const [tidModule, { getAccessToken }] = await Promise.all([
    params.tenant_id ? Promise.resolve(params.tenant_id) : getTenantId(),
    import("../auth"),
  ]);
  const accessToken = await getAccessToken();

  const search = new URLSearchParams();
  if (tidModule) search.set("tenant_id", String(tidModule));
  if (params.type) search.set("type", params.type);
  if (params.start) search.set("start", params.start);
  if (params.end) search.set("end", params.end);
  if (params.format) search.set("format", params.format);

  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (tidModule) headers["X-Tenant-ID"] = String(tidModule);

  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.reports.export}?${search.toString()}`;
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

// Report history (archives)
export function getReportHistory(params?: {
  tenant_id?: string | number;
}): Promise<ApiResponse<ReportArchive[]>> {
  const search = new URLSearchParams();
  if (params?.tenant_id) search.set("tenant_id", String(params.tenant_id));
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.reports.history}`;
  return api.get<ReportArchive[]>(q ? `${path}?${q}` : path);
}
