/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Transaction, TransactionHistory } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listTransactions(
  params?: Record<string, string | number>
): Promise<ApiResponse<Transaction[]>> {
  const search = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return api.get<Transaction[]>(
    `${API_PREFIX}${API_ENDPOINTS.transactions.list}${search}`
  );
}

export function createTransaction(
  payload: Partial<Transaction> & {
    debit_account_code: string;
    debit_account_name: string;
    credit_account_code: string;
    credit_account_name: string;
  }
): Promise<ApiResponse<Transaction>> {
  return api.post<Transaction>(
    `${API_PREFIX}${API_ENDPOINTS.transactions.list}`,
    payload
  );
}

export function updateTransaction(
  id: string | number,
  payload: Partial<Transaction>
): Promise<ApiResponse<Transaction>> {
  return api.patch<Transaction>(
    `${API_PREFIX}${API_ENDPOINTS.transactions.detail(id)}`,
    payload
  );
}

export function deleteTransaction(
  id: string | number
): Promise<ApiResponse<{ id: number }>> {
  return api.delete<{ id: number }>(
    `${API_PREFIX}${API_ENDPOINTS.transactions.detail(id)}`
  );
}

export function getTransactionHistory(
  id: string | number
): Promise<ApiResponse<TransactionHistory[]>> {
  return api.get<TransactionHistory[]>(
    `${API_PREFIX}${API_ENDPOINTS.transactions.history(id)}`
  );
}

// Helper: export URL (client should fetch with auth headers)
export function getTransactionsExportPath(params?: Record<string, string | number>) {
  const search = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";
  return `${API_PREFIX}${API_ENDPOINTS.transactions.export}${search}`;
}

