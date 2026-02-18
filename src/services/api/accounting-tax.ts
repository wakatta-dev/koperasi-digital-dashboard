/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingTaxComplianceQuery,
  AccountingTaxComplianceResponse,
  AccountingTaxDownloadFileResponse,
  AccountingTaxEfakturExportRequest,
  AccountingTaxEfakturExportResponse,
  AccountingTaxEfakturReadyQuery,
  AccountingTaxEfakturReadyResponse,
  AccountingTaxExportHistoryQuery,
  AccountingTaxExportHistoryResponse,
  AccountingTaxExportPphReportRequest,
  AccountingTaxExportPphReportResponse,
  AccountingTaxExportPpnRecapRequest,
  AccountingTaxExportPpnRecapResponse,
  AccountingTaxGenerateReportRequest,
  AccountingTaxGenerateReportResponse,
  AccountingTaxIncomeTaxReportQuery,
  AccountingTaxIncomeTaxReportResponse,
  AccountingTaxOverviewResponse,
  AccountingTaxPeriodsQuery,
  AccountingTaxPeriodsResponse,
  AccountingTaxPphRecordsQuery,
  AccountingTaxPphRecordsResponse,
  AccountingTaxRetryExportResponse,
  AccountingTaxVatTransactionsQuery,
  AccountingTaxVatTransactionsResponse,
} from "@/types/api/accounting-tax";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingTax;

function buildQuery(params?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)));
      continue;
    }
    if (typeof value === "boolean") {
      search.set(key, value ? "true" : "false");
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function buildAccountingTaxErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errs]) => errs)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting tax request failed.";
}

function inferAccountingTaxStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingTaxApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingTaxApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingTaxSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingTaxApiError({
    message: buildAccountingTaxErrorMessage(res),
    statusCode: inferAccountingTaxStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingTaxApiError(err: unknown): AccountingTaxApiError {
  if (err instanceof AccountingTaxApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingTaxApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingTaxApiError({
    message: "Accounting tax request failed.",
    statusCode: 500,
  });
}

export function getAccountingTaxOverview(opts?: { signal?: AbortSignal }) {
  return api.get<AccountingTaxOverviewResponse>(`${API_PREFIX}${E.overview}`, {
    signal: opts?.signal,
  });
}

export function listAccountingTaxPeriods(
  params?: AccountingTaxPeriodsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxPeriodsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxPeriodsResponse>(`${API_PREFIX}${E.periods}${query}`, {
    signal: opts?.signal,
  });
}

export function listAccountingTaxVatTransactions(
  params?: AccountingTaxVatTransactionsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxVatTransactionsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxVatTransactionsResponse>(
    `${API_PREFIX}${E.vatTransactions}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingTaxPphRecords(
  params?: AccountingTaxPphRecordsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxPphRecordsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxPphRecordsResponse>(`${API_PREFIX}${E.pphRecords}${query}`, {
    signal: opts?.signal,
  });
}

export function listAccountingTaxExportHistory(
  params?: AccountingTaxExportHistoryQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxExportHistoryResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxExportHistoryResponse>(
    `${API_PREFIX}${E.exportHistory}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function retryAccountingTaxExportHistory(
  exportId: string,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingTaxRetryExportResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingTaxRetryExportResponse>(
    `${API_PREFIX}${E.exportHistoryRetry(exportId)}`,
    {},
    headers ? { headers } : undefined
  );
}

export function generateAccountingTaxReport(
  payload: AccountingTaxGenerateReportRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingTaxGenerateReportResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingTaxGenerateReportResponse>(
    `${API_PREFIX}${E.reportsGenerate}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function exportAccountingTaxPphReport(
  payload: AccountingTaxExportPphReportRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingTaxExportPphReportResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingTaxExportPphReportResponse>(
    `${API_PREFIX}${E.reportsPphExport}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function exportAccountingTaxPpnRecap(
  payload: AccountingTaxExportPpnRecapRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingTaxExportPpnRecapResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingTaxExportPpnRecapResponse>(
    `${API_PREFIX}${E.reportsPpnRecapExport}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function listAccountingTaxEfakturReady(
  params?: AccountingTaxEfakturReadyQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxEfakturReadyResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxEfakturReadyResponse>(`${API_PREFIX}${E.efakturReady}${query}`, {
    signal: opts?.signal,
  });
}

export function exportAccountingTaxEfaktur(
  payload: AccountingTaxEfakturExportRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingTaxEfakturExportResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingTaxEfakturExportResponse>(
    `${API_PREFIX}${E.efakturExport}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function getAccountingTaxIncomeTaxReport(
  params?: AccountingTaxIncomeTaxReportQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxIncomeTaxReportResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxIncomeTaxReportResponse>(
    `${API_PREFIX}${E.reportsIncomeTax}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function getAccountingTaxCompliance(
  params?: AccountingTaxComplianceQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxComplianceResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingTaxComplianceResponse>(`${API_PREFIX}${E.compliance}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingTaxFileDownload(
  fileId: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingTaxDownloadFileResponse>> {
  return api.get<AccountingTaxDownloadFileResponse>(
    `${API_PREFIX}${E.fileDownload(fileId)}`,
    {
      signal: opts?.signal,
    }
  );
}
