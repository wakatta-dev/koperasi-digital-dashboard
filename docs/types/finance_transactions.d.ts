import type { APIResponse, Rfc3339String } from './index';

export type TransactionType = 'CashIn' | 'CashOut' | 'Transfer';

export interface LedgerEntry {
  id: number;
  transaction_id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  id: number;
  tenant_id: number;
  transaction_date: Rfc3339String;
  type: TransactionType;
  category: string;
  amount: number;
  payment_method: string;
  description: string;
  ledger_entries: LedgerEntry[];
  created_by: number;
  updated_by: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TransactionHistory {
  id: number;
  transaction_id: number;
  changed_by: number;
  old_values: string;
  new_values: string;
  changed_at: Rfc3339String;
}

export interface CreateTransactionRequest {
  transaction_date: Rfc3339String;
  type: TransactionType;
  category: string;
  amount: number;
  payment_method: string;
  description?: string;
  debit_account_code: string;
  debit_account_name: string;
  credit_account_code: string;
  credit_account_name: string;
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export interface ListTransactionsQuery {
  start?: string;
  end?: string;
  type?: TransactionType;
  category?: string;
  min_amount?: number;
  max_amount?: number;
  limit: number;
  cursor?: string;
}

export type CreateTransactionResponse = APIResponse<Transaction>;
export type ListTransactionsResponse = APIResponse<Transaction[]>;
export type GetTransactionHistoryResponse = APIResponse<TransactionHistory[]>;
export type UpdateTransactionResponse = APIResponse<Transaction>;
export type DeleteTransactionResponse = APIResponse<{ id: number }>;

