/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  DepositRequest,
  SavingsProofResponse,
  SavingsTransaction,
  SavingsTransactionListResponse,
  SavingsTransactionResponse,
  WithdrawalRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function depositSavings(
  memberId: string | number,
  payload: DepositRequest
): Promise<SavingsTransactionResponse> {
  return api.post<SavingsTransaction>(
    `${API_PREFIX}${API_ENDPOINTS.savings.deposit(memberId)}`,
    payload
  );
}

export function verifySavingsDeposit(
  transactionId: string | number
): Promise<SavingsTransactionResponse> {
  return api.post<SavingsTransaction>(
    `${API_PREFIX}${API_ENDPOINTS.savings.verify(transactionId)}`,
    {}
  );
}

export function withdrawSavings(
  memberId: string | number,
  payload: WithdrawalRequest
): Promise<SavingsTransactionResponse> {
  return api.post<SavingsTransaction>(
    `${API_PREFIX}${API_ENDPOINTS.savings.withdraw(memberId)}`,
    payload
  );
}

export function approveSavingsWithdrawal(
  transactionId: string | number
): Promise<SavingsTransactionResponse> {
  return api.post<SavingsTransaction>(
    `${API_PREFIX}${API_ENDPOINTS.savings.approve(transactionId)}`,
    {}
  );
}

export function listSavingsTransactions(
  memberId: string | number,
  params?: {
    term?: string;
    type?: 'setoran' | 'penarikan';
    start?: string;
    end?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<SavingsTransactionListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.type) search.set("type", params.type);
  if (params?.start) search.set("start", params.start);
  if (params?.end) search.set("end", params.end);
  const q = search.toString();
  return api.get<SavingsTransaction[]>(
    `${API_PREFIX}${API_ENDPOINTS.savings.transactions(memberId)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function getSavingsProof(
  transactionId: string | number
): Promise<SavingsProofResponse> {
  return api.get<{ proof: string }>(
    `${API_PREFIX}${API_ENDPOINTS.savings.proof(transactionId)}`
  );
}
