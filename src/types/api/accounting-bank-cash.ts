/** @format */

export type AccountingBankCashPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingBankCashSummaryCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
  tone: "primary" | "warning" | "success";
};

export type AccountingBankCashOverviewResponse = {
  cards: AccountingBankCashSummaryCard[];
  cash_register_summary: Array<{
    register_id: string;
    register_name: string;
    register_type: string;
    balance_amount: number;
    status: string;
  }>;
};

export type AccountingBankCashAccountStatus = "Active" | "Inactive";

export type AccountingBankCashAccountsQuery = {
  q?: string;
  status?: AccountingBankCashAccountStatus;
  page?: number;
  per_page?: number;
};

export type AccountingBankCashAccountItem = {
  account_id: string;
  bank_name: string;
  account_name: string;
  masked_account_number: string;
  currency_code: string;
  available_balance: number;
  last_sync_at?: string;
  unreconciled_count: number;
  status: AccountingBankCashAccountStatus;
};

export type AccountingBankCashAccountsResponse = {
  items: AccountingBankCashAccountItem[];
  pagination: AccountingBankCashPagination;
};

export type AccountingBankCashCreateAccountRequest = {
  bank_name: string;
  account_name: string;
  account_number: string;
  currency_code: string;
  initial_balance_amount: number;
};

export type AccountingBankCashCreateAccountResponse = {
  account_id: string;
  masked_account_number: string;
  status: AccountingBankCashAccountStatus;
};

export type AccountingBankCashUnreconciledQuery = {
  q?: string;
  account_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export type AccountingBankCashUnreconciledItem = {
  date: string;
  description: string;
  source: string;
  amount: number;
  direction: "Credit" | "Debit";
  can_match: boolean;
};

export type AccountingBankCashUnreconciledResponse = {
  items: AccountingBankCashUnreconciledItem[];
  pagination: AccountingBankCashPagination;
};

export type AccountingBankCashImportStatementRequest = {
  account_id: string;
  file_name: string;
  file_type: "csv" | "xls" | "xlsx";
  file_size_bytes: number;
  storage_key: string;
};

export type AccountingBankCashImportStatementResponse = {
  job_reference: string;
  status: "Queued" | "Processing" | "Completed";
};

export type AccountingBankCashReconciliationSessionResponse = {
  session_reference: string;
  statement_balance_amount: number;
  system_balance_amount: number;
  difference_amount: number;
  status: "Draft" | "Matched" | "Confirmed" | "Cancelled";
  can_confirm: boolean;
  can_open_detail: boolean;
};

export type AccountingBankCashReconciliationLinesQuery = {
  q?: string;
  selected_only?: boolean;
  page?: number;
  per_page?: number;
};

export type AccountingBankCashBankLineItem = {
  line_id: string;
  date: string;
  description: string;
  reference_no?: string;
  amount: number;
  direction: "Credit" | "Debit";
  is_selected: boolean;
  is_matched: boolean;
};

export type AccountingBankCashSystemLineItem = {
  line_id: string;
  date: string;
  partner_or_ref: string;
  document_ref?: string;
  amount: number;
  direction: "Credit" | "Debit";
  is_selected: boolean;
  is_matched: boolean;
};

export type AccountingBankCashBankLinesResponse = {
  items: AccountingBankCashBankLineItem[];
  pagination: AccountingBankCashPagination;
};

export type AccountingBankCashSystemLinesResponse = {
  items: AccountingBankCashSystemLineItem[];
  pagination: AccountingBankCashPagination;
};

export type AccountingBankCashCreateMatchesRequest = {
  session_reference: string;
  pairs: Array<{
    bank_statement_line_id: string;
    system_ledger_line_id: string;
  }>;
};

export type AccountingBankCashCreateMatchesResponse = {
  applied_matches: number;
  difference_amount: number;
  can_confirm: boolean;
};

export type AccountingBankCashSuggestMatchesRequest = {
  session_reference: string;
};

export type AccountingBankCashSuggestMatchesResponse = {
  suggestions: Array<{
    bank_statement_line_id: string;
    system_ledger_line_id: string;
    score: number;
  }>;
  estimated_difference_amount: number;
};

export type AccountingBankCashConfirmReconciliationRequest = {
  session_reference: string;
};

export type AccountingBankCashConfirmReconciliationResponse = {
  session_reference: string;
  status: "Confirmed";
  confirmed_at: string;
  detail_cta: {
    account_id: string;
    href: string;
  };
};

export type AccountingBankCashTransactionsQuery = {
  date_range?: string;
  transaction_type?: "Credit" | "Debit";
  status?: "Reconciled" | "Unreconciled";
  q?: string;
  page?: number;
  per_page?: number;
};

export type AccountingBankCashTransactionItem = {
  transaction_id: string;
  date: string;
  description: string;
  reference_label: string;
  amount: number;
  direction: "Credit" | "Debit";
  status: "Reconciled" | "Unreconciled";
};

export type AccountingBankCashTransactionsResponse = {
  summary: {
    current_balance: number;
    last_synced_at: string;
  };
  items: AccountingBankCashTransactionItem[];
  pagination: AccountingBankCashPagination;
};

export type AccountingBankCashManualTransactionRequest = {
  transaction_date: string;
  description: string;
  amount: number;
  direction: "Credit" | "Debit";
  reference_label?: string;
};

export type AccountingBankCashManualTransactionResponse = {
  transaction_id: string;
  status: "Reconciled" | "Unreconciled";
};

export type AccountingBankCashExportTransactionsQuery =
  AccountingBankCashTransactionsQuery & {
    format: "csv" | "xlsx" | "pdf";
  };

export type AccountingBankCashExportTransactionsResponse = {
  export_reference: string;
  download_url: string;
  expires_at: string;
};
