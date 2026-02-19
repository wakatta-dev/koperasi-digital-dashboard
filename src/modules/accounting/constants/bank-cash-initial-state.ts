/** @format */

import type {
  AddBankAccountDraft,
  BankCashTransactionFilters,
  ImportStatementDraft,
  ReconciliationBalanceCards,
} from "../types/bank-cash";

export const EMPTY_ADD_BANK_ACCOUNT_DRAFT: AddBankAccountDraft = {
  bank_name: "",
  account_name: "",
  account_number: "",
  currency_code: "IDR",
  initial_balance_amount: "",
};

export const EMPTY_IMPORT_STATEMENT_DRAFT: ImportStatementDraft = {
  account_id: "",
  file_name: "",
  file_type: "",
  file_size_bytes: 0,
};

export const INITIAL_BANK_CASH_TRANSACTION_FILTERS: BankCashTransactionFilters = {
  date_range: "Last 30 Days",
  transaction_type: "All Types",
  status: "All Status",
  q: "",
};

export const EMPTY_RECONCILIATION_BALANCE_CARDS: ReconciliationBalanceCards = {
  statement_balance_amount: "Rp 0",
  system_balance_amount: "Rp 0",
  difference_amount: "Rp 0",
};
