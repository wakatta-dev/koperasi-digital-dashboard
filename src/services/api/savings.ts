/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// Savings module client wrappers (per docs/modules/savings.md)

export function depositSavings(
  memberId: string | number,
  payload: { type: string; amount: number; method: string; fee?: number }
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.savings.deposit(memberId)}`,
    payload
  );
}

export function verifySavingsDeposit(
  transactionId: string | number
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.savings.verify(transactionId)}`
  );
}

export function withdrawSavings(
  memberId: string | number,
  payload: { type: string; amount: number; method: string; fee?: number }
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.savings.withdraw(memberId)}`,
    payload
  );
}

export function approveSavingsWithdrawal(
  transactionId: string | number
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.savings.approve(transactionId)}`
  );
}

export function listSavingsTransactions(
  memberId: string | number
): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(
    `${API_PREFIX}${API_ENDPOINTS.savings.transactions(memberId)}`
  );
}

export function getSavingsProof(
  transactionId: string | number
): Promise<ApiResponse<{ proof: string }>> {
  return api.get<{ proof: string }>(
    `${API_PREFIX}${API_ENDPOINTS.savings.proof(transactionId)}`
  );
}

