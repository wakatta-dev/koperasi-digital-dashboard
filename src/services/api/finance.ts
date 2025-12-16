/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import { api, API_PREFIX } from "./base";
import type {
  ChannelsResponse,
  FinanceQuery,
  BalanceSheetResponse,
  CashFlowResponse,
  OverviewResponse,
  ProfitLossResponse,
  SalesSummaryResponse,
  TopProductsResponse,
} from "@/modules/finance/penjualan-rinci/types";
import type { ApiResponse } from "@/types/api";

function buildQuery(params?: FinanceQuery): string {
  const search = new URLSearchParams();
  if (params?.preset) search.set("preset", params.preset);
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.format) search.set("format", params.format);
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getSalesSummary(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<SalesSummaryResponse>> {
  const query = buildQuery(params);
  return api.get<SalesSummaryResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.salesSummary}${query}`,
    { signal: opts?.signal }
  );
}

export function getTopProducts(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<TopProductsResponse>> {
  const query = buildQuery(params);
  return api.get<TopProductsResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.topProducts}${query}`,
    { signal: opts?.signal }
  );
}

export function getChannels(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<ChannelsResponse>> {
  const query = buildQuery(params);
  return api.get<ChannelsResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.channels}${query}`,
    { signal: opts?.signal }
  );
}

export function getExportUrl(
  kind: "products" | "channels",
  params?: FinanceQuery
): string {
  const query = buildQuery(params);
  const path =
    kind === "products"
      ? API_ENDPOINTS.finance.exportProducts
      : API_ENDPOINTS.finance.exportChannels;
  return `${API_PREFIX}${path}${query}`;
}

export function getOverview(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<OverviewResponse>> {
  const query = buildQuery(params);
  return api.get<OverviewResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.overview}${query}`,
    { signal: opts?.signal }
  );
}

export function getProfitLoss(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<ProfitLossResponse>> {
  const query = buildQuery(params);
  return api.get<ProfitLossResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.profitLoss}${query}`,
    { signal: opts?.signal }
  );
}

export function getCashFlow(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<CashFlowResponse>> {
  const query = buildQuery(params);
  return api.get<CashFlowResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.cashFlow}${query}`,
    { signal: opts?.signal }
  );
}

export function getBalanceSheet(
  params?: FinanceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<BalanceSheetResponse>> {
  const query = buildQuery(params);
  return api.get<BalanceSheetResponse>(
    `${API_PREFIX}${API_ENDPOINTS.finance.balanceSheet}${query}`,
    { signal: opts?.signal }
  );
}
