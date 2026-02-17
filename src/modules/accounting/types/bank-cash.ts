/** @format */

export type BankCashStatus = "Active" | "Inactive";

export type BankCashSummaryTone = "primary" | "warning" | "success";

export type BankCashSummaryCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
  tone: BankCashSummaryTone;
};

export type BankAccountCardItem = {
  account_id: string;
  bank_badge: string;
  bank_badge_class_name: string;
  bank_name: string;
  account_name: string;
  masked_account_number: string;
  available_balance: string;
  last_sync_label: string;
  unreconciled_count: number;
  status: BankCashStatus;
};

export type UnreconciledTransactionItem = {
  id: string;
  date: string;
  description: string;
  source: string;
  amount: string;
  direction: "Credit" | "Debit";
  can_match: boolean;
};

export type CashRegisterItem = {
  id: string;
  register_name: string;
  register_type: string;
  balance_label: string;
  status_label: string;
};

export type ReconciliationStatus = "Draft" | "Matched" | "Confirmed";

export type ReconciliationBalanceCards = {
  statement_balance_amount: string;
  system_balance_amount: string;
  difference_amount: string;
};

export type ReconciliationSessionView = {
  account_id: string;
  session_reference: string;
  account_title: string;
  account_meta: string;
  status: ReconciliationStatus;
  can_confirm: boolean;
  can_open_detail: boolean;
  cards: ReconciliationBalanceCards;
};

export type BankStatementLineItem = {
  line_id: string;
  date: string;
  description: string;
  reference_no?: string;
  amount: string;
  direction: "Credit" | "Debit";
  is_selected: boolean;
  is_matched: boolean;
};

export type SystemLedgerLineItem = {
  line_id: string;
  date: string;
  partner_or_ref: string;
  document_ref?: string;
  amount: string;
  direction: "Credit" | "Debit";
  is_selected: boolean;
  is_matched: boolean;
};

export type AccountTransactionStatus = "Reconciled" | "Unreconciled";

export type BankAccountTransactionItem = {
  transaction_id: string;
  date: string;
  description: string;
  reference_label: string;
  amount: string;
  direction: "Credit" | "Debit";
  status: AccountTransactionStatus;
};

export type BankAccountTransactionSummary = {
  current_balance: string;
  current_balance_delta_label: string;
  last_synced_at: string;
};

export type BankCashTransactionFilters = {
  date_range: string;
  transaction_type: "All Types" | "Debit (Outgoing)" | "Credit (Incoming)";
  status: "All Status" | "Reconciled" | "Unreconciled";
  q: string;
};

export type AddBankAccountDraft = {
  bank_name: string;
  account_name: string;
  account_number: string;
  currency_code: string;
  initial_balance_amount: string;
};

export type ImportStatementDraft = {
  account_id: string;
  file_name: string;
  file_type: "csv" | "xls" | "xlsx" | "";
  file_size_bytes: number;
};

export type ReconciliationMatchPair = {
  bank_statement_line_id: string;
  system_ledger_line_id: string;
};
