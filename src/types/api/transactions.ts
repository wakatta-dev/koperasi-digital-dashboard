/** @format */

export type TransactionType = "CashIn" | "CashOut" | "Transfer";

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
  transaction_date: string;
  type: TransactionType;
  category: string;
  amount: number;
  payment_method: string;
  description?: string | null;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  ledger_entries?: LedgerEntry[];
}

export interface TransactionHistory {
  id: number;
  transaction_id: number;
  field?: string;
  old_value?: string | null;
  new_value?: string | null;
  created_at: string;
}

