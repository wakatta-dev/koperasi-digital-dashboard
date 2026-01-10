/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import { api, API_PREFIX } from "./base";
import type { ApiResponse } from "@/types/api";
import type {
  BalanceSheetReport,
  BumdesReportQuery,
  CashFlowReport,
  OverviewReport,
  ProfitLossReport,
  SalesDetailReport,
} from "@/modules/bumdes/report/types";

function buildQuery(params?: BumdesReportQuery): string {
  const search = new URLSearchParams();
  if (params?.preset) search.set("preset", params.preset);
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  if (params?.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getBumdesOverviewReport(
  params?: BumdesReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<OverviewReport>> {
  const query = buildQuery(params);
  return api.get<OverviewReport>(
    `${API_PREFIX}${API_ENDPOINTS.bumdesReport.overview}${query}`,
    { signal: opts?.signal }
  );
}

export function getBumdesProfitLossReport(
  params?: BumdesReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<ProfitLossReport>> {
  const query = buildQuery(params);
  return api.get<ProfitLossReport>(
    `${API_PREFIX}${API_ENDPOINTS.bumdesReport.profitLoss}${query}`,
    { signal: opts?.signal }
  );
}

export function getBumdesBalanceSheetReport(
  params?: BumdesReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<BalanceSheetReport>> {
  const query = buildQuery(params);
  return api.get<BalanceSheetReport>(
    `${API_PREFIX}${API_ENDPOINTS.bumdesReport.balanceSheet}${query}`,
    { signal: opts?.signal }
  );
}

export function getBumdesCashFlowReport(
  params?: BumdesReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<CashFlowReport>> {
  const query = buildQuery(params);
  return api.get<CashFlowReport>(
    `${API_PREFIX}${API_ENDPOINTS.bumdesReport.cashFlow}${query}`,
    { signal: opts?.signal }
  );
}

export function getBumdesSalesDetailReport(
  params?: BumdesReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<SalesDetailReport>> {
  const query = buildQuery(params);
  return api.get<SalesDetailReport>(
    `${API_PREFIX}${API_ENDPOINTS.bumdesReport.salesDetail}${query}`,
    { signal: opts?.signal }
  );
}
