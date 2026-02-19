/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingReportingAccountLedgerQuery,
  AccountingReportingAccountLedgerResponse,
  AccountingReportingBalanceSheetResponse,
  AccountingReportingCashFlowResponse,
  AccountingReportingGeneralLedgerQuery,
  AccountingReportingGeneralLedgerResponse,
  AccountingReportingOverviewResponse,
  AccountingReportingProfitLossComparativeResponse,
  AccountingReportingProfitLossResponse,
  AccountingReportingTrialBalanceResponse,
  AccountingReportingBaseQuery,
} from "@/types/api/accounting-reporting";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingReporting;

function buildQuery(params?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function toQueryParams(params?: AccountingReportingBaseQuery) {
  if (!params) {
    return {};
  }
  return {
    preset: params.preset,
    start: params.start,
    end: params.end,
    branch: params.branch,
  };
}

function buildAccountingReportingErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errs]) => errs)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting reporting request failed.";
}

function inferAccountingReportingStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingReportingApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingReportingApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingReportingSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingReportingApiError({
    message: buildAccountingReportingErrorMessage(res),
    statusCode: inferAccountingReportingStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingReportingApiError(err: unknown): AccountingReportingApiError {
  if (err instanceof AccountingReportingApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingReportingApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingReportingApiError({
    message: "Accounting reporting request failed.",
    statusCode: 500,
  });
}

export function getAccountingReportingProfitLoss(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingProfitLossResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingProfitLossResponse>(`${API_PREFIX}${E.profitLoss}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingReportingOverview(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingOverviewResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingOverviewResponse>(`${API_PREFIX}${E.overview}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingReportingCashFlow(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingCashFlowResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingCashFlowResponse>(`${API_PREFIX}${E.cashFlow}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingReportingBalanceSheet(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingBalanceSheetResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingBalanceSheetResponse>(
    `${API_PREFIX}${E.balanceSheet}${query}`,
    {
      signal: opts?.signal,
    },
  );
}

export function getAccountingReportingProfitLossComparative(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingProfitLossComparativeResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingProfitLossComparativeResponse>(
    `${API_PREFIX}${E.profitLossComparative}${query}`,
    {
      signal: opts?.signal,
    },
  );
}

export function getAccountingReportingTrialBalance(
  params?: AccountingReportingBaseQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingTrialBalanceResponse>> {
  const query = buildQuery(toQueryParams(params));
  return api.get<AccountingReportingTrialBalanceResponse>(`${API_PREFIX}${E.trialBalance}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingReportingGeneralLedger(
  params?: AccountingReportingGeneralLedgerQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingGeneralLedgerResponse>> {
  const query = buildQuery({
    preset: params?.preset,
    start: params?.start,
    end: params?.end,
    branch: params?.branch,
    accountId: params?.accountId,
    page: params?.page,
    page_size: params?.page_size,
    pageSize: params?.page_size,
  });

  return api.get<AccountingReportingGeneralLedgerResponse>(`${API_PREFIX}${E.generalLedger}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingReportingAccountLedger(
  params: AccountingReportingAccountLedgerQuery,
  opts?: { signal?: AbortSignal },
): Promise<ApiResponse<AccountingReportingAccountLedgerResponse>> {
  const query = buildQuery({
    preset: params.preset,
    start: params.start,
    end: params.end,
    branch: params.branch,
    accountId: params.accountId,
    page: params.page,
    page_size: params.page_size,
    pageSize: params.page_size,
    search: params.search,
  });

  return api.get<AccountingReportingAccountLedgerResponse>(`${API_PREFIX}${E.accountLedger}${query}`, {
    signal: opts?.signal,
  });
}
