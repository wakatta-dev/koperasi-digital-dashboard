/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingApBatchDetailResponse,
  AccountingApBatchPreviewRequest,
  AccountingApBatchPreviewResponse,
  AccountingApBillDetailResponse,
  AccountingApBillListQuery,
  AccountingApBillListResponse,
  AccountingApBillPaymentHistoryResponse,
  AccountingApConfirmOcrSessionRequest,
  AccountingApConfirmOcrSessionResponse,
  AccountingApCreateBatchPaymentRequest,
  AccountingApCreateBatchPaymentResponse,
  AccountingApCreateBillRequest,
  AccountingApCreateBillResponse,
  AccountingApCreateOcrSessionRequest,
  AccountingApCreateOcrSessionResponse,
  AccountingApOverviewResponse,
  AccountingApUpdateBillRequest,
  AccountingApUpdateBillStatusRequest,
  AccountingApUpdateBillStatusResponse,
  AccountingApUpdateOcrSessionRequest,
  AccountingApUpdateOcrSessionResponse,
  AccountingApVendorCreditListQuery,
  AccountingApVendorCreditListResponse,
} from "@/types/api/accounting-ap";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingAp;

function buildQuery(params?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)));
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function buildAccountingApErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errors]) => errors)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting AP request failed.";
}

function inferAccountingApStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingApApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingApApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingApSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingApApiError({
    message: buildAccountingApErrorMessage(res),
    statusCode: inferAccountingApStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingApApiError(err: unknown): AccountingApApiError {
  if (err instanceof AccountingApApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingApApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingApApiError({
    message: "Accounting AP request failed.",
    statusCode: 500,
  });
}

export function listAccountingApOverview(opts?: { signal?: AbortSignal }) {
  return api.get<AccountingApOverviewResponse>(`${API_PREFIX}${E.overview}`, {
    signal: opts?.signal,
  });
}

export function listAccountingApBills(
  params?: AccountingApBillListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingApBillListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingApBillListResponse>(`${API_PREFIX}${E.bills}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingApBillDetail(
  billNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingApBillDetailResponse>> {
  return api.get<AccountingApBillDetailResponse>(`${API_PREFIX}${E.billDetail(billNumber)}`, {
    signal: opts?.signal,
  });
}

export function createAccountingApBill(
  payload: AccountingApCreateBillRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingApCreateBillResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingApCreateBillResponse>(
    `${API_PREFIX}${E.bills}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingApBill(
  billNumber: string,
  payload: AccountingApUpdateBillRequest
): Promise<ApiResponse<AccountingApCreateBillResponse>> {
  return api.put<AccountingApCreateBillResponse>(
    `${API_PREFIX}${E.billDetail(billNumber)}`,
    payload
  );
}

export function updateAccountingApBillStatus(
  billNumber: string,
  payload: AccountingApUpdateBillStatusRequest
): Promise<ApiResponse<AccountingApUpdateBillStatusResponse>> {
  return api.patch<AccountingApUpdateBillStatusResponse>(
    `${API_PREFIX}${E.billStatus(billNumber)}`,
    payload
  );
}

export function listAccountingApBillPayments(
  billNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingApBillPaymentHistoryResponse>> {
  return api.get<AccountingApBillPaymentHistoryResponse>(
    `${API_PREFIX}${E.billPayments(billNumber)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function listAccountingApVendorCredits(
  params?: AccountingApVendorCreditListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingApVendorCreditListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingApVendorCreditListResponse>(
    `${API_PREFIX}${E.vendorCredits}${query}`,
    {
      signal: opts?.signal,
    }
  );
}

export function previewAccountingApBatchPayment(
  payload: AccountingApBatchPreviewRequest
): Promise<ApiResponse<AccountingApBatchPreviewResponse>> {
  return api.post<AccountingApBatchPreviewResponse>(
    `${API_PREFIX}${E.batchPreview}`,
    payload
  );
}

export function createAccountingApBatchPayment(
  payload: AccountingApCreateBatchPaymentRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingApCreateBatchPaymentResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingApCreateBatchPaymentResponse>(
    `${API_PREFIX}${E.batchPayments}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function getAccountingApBatchPaymentDetail(
  batchReference: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingApBatchDetailResponse>> {
  return api.get<AccountingApBatchDetailResponse>(
    `${API_PREFIX}${E.batchPaymentDetail(batchReference)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingApOcrSession(
  payload: AccountingApCreateOcrSessionRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingApCreateOcrSessionResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingApCreateOcrSessionResponse>(
    `${API_PREFIX}${E.ocrSessions}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function updateAccountingApOcrSession(
  sessionId: string,
  payload: AccountingApUpdateOcrSessionRequest
): Promise<ApiResponse<AccountingApUpdateOcrSessionResponse>> {
  return api.patch<AccountingApUpdateOcrSessionResponse>(
    `${API_PREFIX}${E.ocrSession(sessionId)}`,
    payload
  );
}

export function confirmAccountingApOcrSession(
  sessionId: string,
  payload?: AccountingApConfirmOcrSessionRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingApConfirmOcrSessionResponse>> {
  const headers = opts?.idempotencyKey
    ? { "Idempotency-Key": opts.idempotencyKey }
    : undefined;

  return api.post<AccountingApConfirmOcrSessionResponse>(
    `${API_PREFIX}${E.ocrConfirm(sessionId)}`,
    payload ?? {},
    headers ? { headers } : undefined
  );
}
