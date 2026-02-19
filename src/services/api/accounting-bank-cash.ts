/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingBankCashAccountsQuery,
  AccountingBankCashAccountsResponse,
  AccountingBankCashBankLinesResponse,
  AccountingBankCashConfirmReconciliationRequest,
  AccountingBankCashConfirmReconciliationResponse,
  AccountingBankCashCreateAccountRequest,
  AccountingBankCashCreateAccountResponse,
  AccountingBankCashCreateMatchesRequest,
  AccountingBankCashCreateMatchesResponse,
  AccountingBankCashExportTransactionsQuery,
  AccountingBankCashExportTransactionsResponse,
  AccountingBankCashImportStatementRequest,
  AccountingBankCashImportStatementResponse,
  AccountingBankCashManualTransactionRequest,
  AccountingBankCashManualTransactionResponse,
  AccountingBankCashOverviewResponse,
  AccountingBankCashReconciliationLinesQuery,
  AccountingBankCashReconciliationSessionResponse,
  AccountingBankCashSuggestMatchesRequest,
  AccountingBankCashSuggestMatchesResponse,
  AccountingBankCashSystemLinesResponse,
  AccountingBankCashTransactionsQuery,
  AccountingBankCashTransactionsResponse,
  AccountingBankCashUnreconciledQuery,
  AccountingBankCashUnreconciledResponse,
} from "@/types/api/accounting-bank-cash";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingBankCash;

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

function buildAccountingBankCashErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errors]) => errors)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting bank cash request failed.";
}

function inferAccountingBankCashStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingBankCashApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingBankCashApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingBankCashSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingBankCashApiError({
    message: buildAccountingBankCashErrorMessage(res),
    statusCode: inferAccountingBankCashStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingBankCashApiError(err: unknown): AccountingBankCashApiError {
  if (err instanceof AccountingBankCashApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingBankCashApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingBankCashApiError({
    message: "Accounting bank cash request failed.",
    statusCode: 500,
  });
}

export function getAccountingBankCashOverview(opts?: { signal?: AbortSignal }) {
  return api.get<AccountingBankCashOverviewResponse>(`${API_PREFIX}${E.overview}`, {
    signal: opts?.signal,
  });
}

export function listAccountingBankCashAccounts(
  params?: AccountingBankCashAccountsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashAccountsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashAccountsResponse>(`${API_PREFIX}${E.accounts}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingBankCashAccount(
  payload: AccountingBankCashCreateAccountRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingBankCashCreateAccountResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingBankCashCreateAccountResponse>(
    `${API_PREFIX}${E.accounts}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function listAccountingBankCashUnreconciledTransactions(
  params?: AccountingBankCashUnreconciledQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashUnreconciledResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashUnreconciledResponse>(
    `${API_PREFIX}${E.unreconciledTransactions}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function importAccountingBankCashStatement(
  payload: AccountingBankCashImportStatementRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingBankCashImportStatementResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingBankCashImportStatementResponse>(
    `${API_PREFIX}${E.statementImport}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function getAccountingBankCashReconciliationSession(
  accountId: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashReconciliationSessionResponse>> {
  return api.get<AccountingBankCashReconciliationSessionResponse>(
    `${API_PREFIX}${E.reconciliationCurrent(accountId)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingBankCashBankLines(
  accountId: string,
  params?: AccountingBankCashReconciliationLinesQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashBankLinesResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashBankLinesResponse>(
    `${API_PREFIX}${E.reconciliationBankLines(accountId)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingBankCashSystemLines(
  accountId: string,
  params?: AccountingBankCashReconciliationLinesQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashSystemLinesResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashSystemLinesResponse>(
    `${API_PREFIX}${E.reconciliationSystemLines(accountId)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingBankCashMatches(
  accountId: string,
  payload: AccountingBankCashCreateMatchesRequest
): Promise<ApiResponse<AccountingBankCashCreateMatchesResponse>> {
  return api.post<AccountingBankCashCreateMatchesResponse>(
    `${API_PREFIX}${E.reconciliationMatches(accountId)}`,
    payload
  );
}

export function suggestAccountingBankCashMatches(
  accountId: string,
  payload: AccountingBankCashSuggestMatchesRequest
): Promise<ApiResponse<AccountingBankCashSuggestMatchesResponse>> {
  return api.post<AccountingBankCashSuggestMatchesResponse>(
    `${API_PREFIX}${E.reconciliationSuggest(accountId)}`,
    payload
  );
}

export function confirmAccountingBankCashReconciliation(
  accountId: string,
  payload: AccountingBankCashConfirmReconciliationRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingBankCashConfirmReconciliationResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingBankCashConfirmReconciliationResponse>(
    `${API_PREFIX}${E.reconciliationConfirm(accountId)}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function listAccountingBankCashAccountTransactions(
  accountId: string,
  params?: AccountingBankCashTransactionsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashTransactionsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashTransactionsResponse>(
    `${API_PREFIX}${E.accountTransactions(accountId)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingBankCashManualTransaction(
  accountId: string,
  payload: AccountingBankCashManualTransactionRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingBankCashManualTransactionResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingBankCashManualTransactionResponse>(
    `${API_PREFIX}${E.accountTransactionsManual(accountId)}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function exportAccountingBankCashAccountTransactions(
  accountId: string,
  params: AccountingBankCashExportTransactionsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingBankCashExportTransactionsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingBankCashExportTransactionsResponse>(
    `${API_PREFIX}${E.accountTransactionsExport(accountId)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}
