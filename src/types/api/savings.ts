/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type SavingsAccount = {
  id: number;
  member_id: number;
  type: string;
  balance: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type SavingsTransaction = {
  id: number;
  account_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'verified' | 'approved';
  type: 'setoran' | 'penarikan';
  fee: number;
  proof_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type DepositRequest = {
  type: string;
  amount: number;
  method: string;
  fee?: number;
};

export type WithdrawalRequest = {
  type: 'simpanan_sukarela';
  amount: number;
  method: string;
  fee?: number;
};

export type SavingsTransactionResponse = ApiResponse<SavingsTransaction>;
export type SavingsTransactionListResponse = ApiResponse<SavingsTransaction[]>;
export type SavingsProofResponse = ApiResponse<{ proof: string }>;
