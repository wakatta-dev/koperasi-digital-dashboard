/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// Loans module client wrappers (per docs/modules/loan.md)

export function applyLoan(
  payload: any
): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.loans.apply}`, payload);
}

export function approveLoan(
  id: string | number,
  payload?: any
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.loans.approve(id)}`,
    payload
  );
}

export function disburseLoan(
  id: string | number,
  payload?: any
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.loans.disburse(id)}`,
    payload
  );
}

export function listLoanInstallments(
  id: string | number
): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(
    `${API_PREFIX}${API_ENDPOINTS.loans.installments(id)}`
  );
}

export function payLoanInstallment(
  installmentId: string | number,
  payload?: any
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.loans.payInstallment(installmentId)}`,
    payload
  );
}

export function getLoanReleaseLetter(
  id: string | number
): Promise<ApiResponse<any>> {
  return api.get<any>(
    `${API_PREFIX}${API_ENDPOINTS.loans.releaseLetter(id)}`
  );
}

