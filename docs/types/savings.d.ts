import type { APIResponse, Rfc3339String } from './index';

export interface SavingsAccount { id: number; member_id: number; type: string; balance: number; created_at: Rfc3339String; updated_at: Rfc3339String }
export interface SavingsTransaction { id: number; account_id: number; amount: number; method: string; status: 'pending' | 'verified' | 'approved'; type: string; proof_url: string; created_at: Rfc3339String }

export interface DepositRequest { type: string; amount: number; method: string; fee?: number }
export interface WithdrawalRequest { type: string; amount: number; method: string; fee?: number }

export type DepositResponse = SavingsTransaction;
export type VerifyDepositResponse = SavingsTransaction;
export type WithdrawResponse = SavingsTransaction;
export type ApproveWithdrawalResponse = SavingsTransaction;
export type ListSavingsTransactionsResponse = APIResponse<SavingsTransaction[]>;
export type GetProofResponse = APIResponse<string>;

