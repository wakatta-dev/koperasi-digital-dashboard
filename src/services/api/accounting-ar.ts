/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AccountingArCreateCreditNoteRequest,
  AccountingArCreateCreditNoteResponse,
  AccountingArCreateInvoiceRequest,
  AccountingArCreateInvoiceResponse,
  AccountingArCreditNoteListQuery,
  AccountingArCreditNoteListResponse,
  AccountingArInvoiceDetailResponse,
  AccountingArInvoiceListQuery,
  AccountingArInvoiceListResponse,
  AccountingArInvoicePdfResponse,
  AccountingArPaymentListQuery,
  AccountingArPaymentListResponse,
  AccountingArRecordPaymentRequest,
  AccountingArRecordPaymentResponse,
  AccountingArSendInvoiceRequest,
  AccountingArSendInvoiceResponse,
} from "@/types/api/accounting-ar";

import { API_PREFIX, api } from "./base";

const E = API_ENDPOINTS.accountingAr;

function buildQuery(params?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

function buildAccountingArErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errs]) => errs)
      .filter(Boolean)
      .join("; ") || "";

  return flattened || res.message || "Accounting AR request failed.";
}

function inferAccountingArStatusCode<T>(res: ApiResponse<T>): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }

  return 500;
}

export class AccountingArApiError extends Error {
  readonly statusCode: number;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "AccountingArApiError";
    this.statusCode = params.statusCode;
    this.response = params.response;
  }
}

export function ensureAccountingArSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  throw new AccountingArApiError({
    message: buildAccountingArErrorMessage(res),
    statusCode: inferAccountingArStatusCode(res),
    response: res as ApiResponse<unknown>,
  });
}

export function toAccountingArApiError(err: unknown): AccountingArApiError {
  if (err instanceof AccountingArApiError) {
    return err;
  }

  if (err instanceof Error) {
    return new AccountingArApiError({
      message: err.message,
      statusCode: 500,
    });
  }

  return new AccountingArApiError({
    message: "Accounting AR request failed.",
    statusCode: 500,
  });
}

export function listAccountingArInvoices(
  params?: AccountingArInvoiceListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingArInvoiceListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingArInvoiceListResponse>(`${API_PREFIX}${E.invoices}${query}`, {
    signal: opts?.signal,
  });
}

export function getAccountingArInvoiceDetail(
  invoiceNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingArInvoiceDetailResponse>> {
  return api.get<AccountingArInvoiceDetailResponse>(
    `${API_PREFIX}${E.invoiceDetail(invoiceNumber)}`,
    {
      signal: opts?.signal,
    }
  );
}

export function createAccountingArInvoice(
  payload: AccountingArCreateInvoiceRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingArCreateInvoiceResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingArCreateInvoiceResponse>(
    `${API_PREFIX}${E.invoices}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function sendAccountingArInvoice(
  invoiceNumber: string,
  payload: AccountingArSendInvoiceRequest
): Promise<ApiResponse<AccountingArSendInvoiceResponse>> {
  return api.post<AccountingArSendInvoiceResponse>(
    `${API_PREFIX}${E.invoiceSend(invoiceNumber)}`,
    payload
  );
}

export function getAccountingArInvoicePdf(
  invoiceNumber: string
): Promise<ApiResponse<AccountingArInvoicePdfResponse>> {
  return api.get<AccountingArInvoicePdfResponse>(`${API_PREFIX}${E.invoicePdf(invoiceNumber)}`);
}

export function listAccountingArCreditNotes(
  params?: AccountingArCreditNoteListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingArCreditNoteListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingArCreditNoteListResponse>(`${API_PREFIX}${E.creditNotes}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingArCreditNote(
  payload: AccountingArCreateCreditNoteRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingArCreateCreditNoteResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingArCreateCreditNoteResponse>(
    `${API_PREFIX}${E.creditNotes}`,
    payload,
    headers ? { headers } : undefined
  );
}

export function listAccountingArPayments(
  params?: AccountingArPaymentListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<AccountingArPaymentListResponse>> {
  const query = buildQuery(params);
  return api.get<AccountingArPaymentListResponse>(`${API_PREFIX}${E.payments}${query}`, {
    signal: opts?.signal,
  });
}

export function createAccountingArPayment(
  payload: AccountingArRecordPaymentRequest,
  opts?: { idempotencyKey?: string }
): Promise<ApiResponse<AccountingArRecordPaymentResponse>> {
  const headers = opts?.idempotencyKey
    ? {
        "Idempotency-Key": opts.idempotencyKey,
      }
    : undefined;

  return api.post<AccountingArRecordPaymentResponse>(
    `${API_PREFIX}${E.payments}`,
    payload,
    headers ? { headers } : undefined
  );
}
