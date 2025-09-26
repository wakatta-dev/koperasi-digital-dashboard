/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApplyRequest,
  DisbursementRequest,
  LoanApplication,
  LoanApplicationResponse,
  LoanInstallment,
  LoanInstallmentListResponse,
  LoanInstallmentResponse,
  LoanReleaseLetter,
  LoanReleaseLetterHistoryResponse,
  LoanReleaseLetterResponse,
  PaymentRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function applyLoan(
  payload: ApplyRequest
): Promise<LoanApplicationResponse> {
  return api.post<LoanApplication>(
    `${API_PREFIX}${API_ENDPOINTS.loans.apply}`,
    payload
  );
}

export function approveLoan(
  id: string | number
): Promise<LoanApplicationResponse> {
  return api.post<LoanApplication>(
    `${API_PREFIX}${API_ENDPOINTS.loans.approve(id)}`,
    {}
  );
}

export function disburseLoan(
  id: string | number,
  payload: DisbursementRequest
): Promise<LoanApplicationResponse> {
  return api.post<LoanApplication>(
    `${API_PREFIX}${API_ENDPOINTS.loans.disburse(id)}`,
    payload
  );
}

export function listLoanInstallments(
  id: string | number,
  params?: { term?: string; status?: string; due_date?: string; limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<LoanInstallmentListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.status) search.set("status", params.status);
  if (params?.due_date) search.set("due_date", params.due_date);
  const q = search.toString();
  return api.get<LoanInstallment[]>(
    `${API_PREFIX}${API_ENDPOINTS.loans.installments(id)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function payLoanInstallment(
  installmentId: string | number,
  payload: PaymentRequest
): Promise<LoanInstallmentResponse> {
  return api.post<LoanInstallment>(
    `${API_PREFIX}${API_ENDPOINTS.loans.payInstallment(installmentId)}`,
    payload
  );
}

export function getLoanReleaseLetter(
  id: string | number
): Promise<LoanReleaseLetterResponse> {
  return api.get<LoanReleaseLetter>(
    `${API_PREFIX}${API_ENDPOINTS.loans.releaseLetter(id)}`
  );
}

export function listLoanReleaseLetters(
  id: string | number,
  params?: { limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<LoanReleaseLetterHistoryResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  return api.get<LoanReleaseLetter[]>(
    `${API_PREFIX}${API_ENDPOINTS.loans.releaseLetterHistory(id)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}
