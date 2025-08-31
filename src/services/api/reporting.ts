/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  FinanceReportResponse,
  BillingReportResponse,
  CashflowReportResponse,
  ProfitLossReportResponse,
  BalanceSheetReportResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

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
