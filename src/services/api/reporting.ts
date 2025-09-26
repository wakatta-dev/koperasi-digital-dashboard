/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  FinanceReportResponse,
  BillingReportResponse,
  CashflowReport,
  CashflowReportResponse,
  ProfitLossReport,
  ProfitLossReportResponse,
  BalanceSheetReport,
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
  start?: string;
  end?: string;
}): Promise<CashflowReportResponse> {
  const search = new URLSearchParams();
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiReports.cashflow}`;
  return api.get<CashflowReport>(q ? `${path}?${q}` : path);
}

export function getProfitLossReport(params?: {
  start?: string;
  end?: string;
}): Promise<ProfitLossReportResponse> {
  const search = new URLSearchParams();
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiReports.profitLoss}`;
  return api.get<ProfitLossReport>(q ? `${path}?${q}` : path);
}

export function getBalanceSheetReport(params?: {
  start?: string;
  end?: string;
}): Promise<BalanceSheetReportResponse> {
  const search = new URLSearchParams();
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.koperasiReports.balanceSheet}`;
  return api.get<BalanceSheetReport>(q ? `${path}?${q}` : path);
}

// Tenant report export (binary)
export async function exportReportRaw(params: {
  type: 'balance-sheet' | 'profit-loss' | 'cash-flow';
  start?: string;
  end?: string;
  format?: 'pdf' | 'xlsx';
}): Promise<Blob> {
  const [tenantId, { getAccessToken }] = await Promise.all([
    getTenantId(),
    import("../auth"),
  ]);
  const accessToken = await getAccessToken();

  const search = new URLSearchParams();
  search.set("type", params.type);
  if (params.start) search.set("start", params.start);
  if (params.end) search.set("end", params.end);
  if (params.format) search.set("format", params.format);

  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (tenantId) headers['X-Tenant-ID'] = tenantId;

  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.koperasiReports.export}?${search.toString()}`;
  const res = await fetch(url, { method: 'GET', headers });
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
