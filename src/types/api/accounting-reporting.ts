/** @format */

export type AccountingReportingBaseQuery = {
  preset?: string;
  start?: string;
  end?: string;
  branch?: string;
};

export type AccountingReportingPagedQuery = AccountingReportingBaseQuery & {
  page?: number;
  page_size?: number;
};

export type AccountingReportingProfitLossRow = {
  type: "section" | "row" | "total" | "gross" | "net";
  label: string;
  code_display?: string;
  value_display?: string;
};

export type AccountingReportingProfitLossSummaryCard = {
  title: string;
  value_display: string;
  delta_display?: string;
  icon_key?: string;
};

export type AccountingReportingProfitLossResponse = {
  period_label: string;
  updated_at: string;
  summary_cards: AccountingReportingProfitLossSummaryCard[];
  rows: AccountingReportingProfitLossRow[];
  notes: string[];
};

export type AccountingReportingCashFlowRow = {
  type:
    | "section"
    | "label"
    | "item"
    | "total"
    | "netPrimary"
    | "summaryGray"
    | "plainBold"
    | "finalPrimary";
  label: string;
  value_display?: string;
  indent?: number;
};

export type AccountingReportingCashFlowResponse = {
  period_label: string;
  updated_at: string;
  rows: AccountingReportingCashFlowRow[];
  notes: string[];
};

export type AccountingReportingBalanceLine = {
  label: string;
  value_display: string;
};

export type AccountingReportingBalanceSheetResponse = {
  period_label: string;
  updated_at: string;
  assets: AccountingReportingBalanceLine[];
  liabilities: AccountingReportingBalanceLine[];
  equity: AccountingReportingBalanceLine[];
  asset_total_display: string;
  liab_equity_total_display: string;
  asset_info: AccountingReportingBalanceLine[];
  liability_info: AccountingReportingBalanceLine[];
  status_label: string;
  notes: string[];
};

export type AccountingReportingProfitLossComparativeRow = {
  type: "section" | "item" | "total";
  label: string;
  current_value: number;
  previous_value: number;
  variance_value: number;
  variance_pct: number;
};

export type AccountingReportingProfitLossComparativeResponse = {
  period_label: string;
  compare_label: string;
  rows: AccountingReportingProfitLossComparativeRow[];
  meta: {
    generated_at: string;
    currency: string;
  };
};

export type AccountingReportingTrialBalanceRow = {
  group: string;
  account_code: string;
  account_name: string;
  initial_balance: number;
  debit: number;
  credit: number;
  ending_balance: number;
};

export type AccountingReportingTrialBalanceResponse = {
  period_label: string;
  rows: AccountingReportingTrialBalanceRow[];
  totals: {
    initial_balance: number;
    debit: number;
    credit: number;
    ending_balance: number;
  };
};

export type AccountingReportingLedgerEntry = {
  date: string;
  reference: string;
  partner: string;
  label: string;
  debit: number;
  credit: number;
  balance: number;
};

export type AccountingReportingAccountLedgerEntry = {
  date: string;
  journal: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
};

export type AccountingReportingGeneralLedgerGroup = {
  account_id: string;
  account_code: string;
  account_name: string;
  initial_balance: number;
  entries: AccountingReportingLedgerEntry[];
  subtotal_debit: number;
  subtotal_credit: number;
  ending_balance: number;
};

export type AccountingReportingGeneralLedgerQuery = AccountingReportingPagedQuery & {
  accountId?: string;
};

export type AccountingReportingGeneralLedgerResponse = {
  period_label: string;
  groups: AccountingReportingGeneralLedgerGroup[];
  pagination: {
    page: number;
    page_size: number;
    total_accounts: number;
  };
};

export type AccountingReportingAccountLedgerQuery = AccountingReportingPagedQuery & {
  accountId: string;
  search?: string;
};

export type AccountingReportingAccountLedgerResponse = {
  account: {
    id: string;
    code: string;
    name: string;
  };
  summary: {
    total_debit: number;
    total_credit: number;
    current_balance: number;
  };
  entries: AccountingReportingAccountLedgerEntry[];
  totals: {
    debit: number;
    credit: number;
  };
  pagination: {
    page: number;
    page_size: number;
    total_entries: number;
  };
};
