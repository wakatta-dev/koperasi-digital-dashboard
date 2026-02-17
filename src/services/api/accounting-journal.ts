/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingJournalAuditLogsQuery,
  AccountingJournalAuditLogsResponse,
  AccountingJournalCreateEntryRequest,
  AccountingJournalCreateEntryResponse,
  AccountingJournalCreatePeriodLockRequest,
  AccountingJournalCreatePeriodLockResponse,
  AccountingJournalCurrentPeriodLockQuery,
  AccountingJournalCurrentPeriodLockResponse,
  AccountingJournalDetailResponse,
  AccountingJournalEntriesQuery,
  AccountingJournalEntriesResponse,
  AccountingJournalEntryAuditLogsQuery,
  AccountingJournalEntryAuditLogsResponse,
  AccountingJournalPdfMetadataResponse,
  AccountingJournalPostEntryRequest,
  AccountingJournalPostEntryResponse,
  AccountingJournalReverseEntryRequest,
  AccountingJournalReverseEntryResponse,
  AccountingJournalOverviewResponse,
  AccountingJournalUpdateEntryRequest,
  AccountingJournalUpdateEntryResponse,
} from "@/types/api/accounting-journal";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingJournal;

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

function buildAccountingJournalErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errors]) => errors)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting journal request failed.";
}

function inferAccountingJournalStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingJournalApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingJournalApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingJournalSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingJournalApiError({
    message: buildAccountingJournalErrorMessage(res),
    statusCode: inferAccountingJournalStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingJournalApiError(err: unknown): AccountingJournalApiError {
  if (err instanceof AccountingJournalApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingJournalApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingJournalApiError({
    message: "Accounting journal request failed.",
    statusCode: 500,
  });
}

export function getAccountingJournalOverview(opts?: { signal?: AbortSignal }) {
  return api.get<AccountingJournalOverviewResponse>(`${API_PREFIX}${E.overview}`, {
    signal: opts?.signal,
  });
}

export function listAccountingJournalEntries(
  params?: AccountingJournalEntriesQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalEntriesResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingJournalEntriesResponse>(`${API_PREFIX}${E.entries}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingJournalEntry(
  payload: AccountingJournalCreateEntryRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingJournalCreateEntryResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingJournalCreateEntryResponse>(
    `${API_PREFIX}${E.entries}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function getAccountingJournalEntryDetail(
  journalNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalDetailResponse>> {
  return api.get<AccountingJournalDetailResponse>(
    `${API_PREFIX}${E.entryDetail(journalNumber)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function updateAccountingJournalEntry(
  journalNumber: string,
  payload: AccountingJournalUpdateEntryRequest
): Promise<ApiResponse<AccountingJournalUpdateEntryResponse>> {
  return api.put<AccountingJournalUpdateEntryResponse>(
    `${API_PREFIX}${E.entryDetail(journalNumber)}`,
    payload
  );
}

export function postAccountingJournalEntry(
  journalNumber: string,
  payload?: AccountingJournalPostEntryRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingJournalPostEntryResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingJournalPostEntryResponse>(
    `${API_PREFIX}${E.entryPost(journalNumber)}`,
    payload ?? {},
    headers ? { headers } : undefined
  );
}

export function reverseAccountingJournalEntry(
  journalNumber: string,
  payload?: AccountingJournalReverseEntryRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingJournalReverseEntryResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingJournalReverseEntryResponse>(
    `${API_PREFIX}${E.entryReverse(journalNumber)}`,
    payload ?? {},
    headers ? { headers } : undefined
  );
}

export function getAccountingJournalEntryPdfMetadata(
  journalNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalPdfMetadataResponse>> {
  return api.get<AccountingJournalPdfMetadataResponse>(
    `${API_PREFIX}${E.entryPdf(journalNumber)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingJournalEntryAuditLogs(
  journalNumber: string,
  params?: AccountingJournalEntryAuditLogsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalEntryAuditLogsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingJournalEntryAuditLogsResponse>(
    `${API_PREFIX}${E.entryAuditLogs(journalNumber)}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingJournalAuditLogs(
  params?: AccountingJournalAuditLogsQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalAuditLogsResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingJournalAuditLogsResponse>(
    `${API_PREFIX}${E.auditLogs}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingJournalPeriodLock(
  payload: AccountingJournalCreatePeriodLockRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingJournalCreatePeriodLockResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingJournalCreatePeriodLockResponse>(
    `${API_PREFIX}${E.periodLocks}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function getAccountingJournalCurrentPeriodLock(
  params?: AccountingJournalCurrentPeriodLockQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingJournalCurrentPeriodLockResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingJournalCurrentPeriodLockResponse>(
    `${API_PREFIX}${E.periodLockCurrent}${query}`,
    {
      signal: opts?.signal,
    }
  );
}
