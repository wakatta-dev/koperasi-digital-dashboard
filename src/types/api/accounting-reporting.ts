/** @format */

export type AccountingReportingBaseQuery = {
  preset?: string;
  start?: string;
  end?: string;
  branch?: string;
};

export type AccountingReportingReportContext = {
  requested_preset?: string;
  requested_start?: string;
  requested_end?: string;
  effective_preset?: string;
  effective_start?: string;
  effective_end?: string;
  source_of_truth?: string;
  report_tier?: string;
  auto_fallback_applied: boolean;
  fallback_reason?: string;
};

export type AccountingReportingPagedQuery = AccountingReportingBaseQuery & {
  page?: number;
  page_size?: number;
};

export type AccountingReportingOverviewKpi = {
  title: string;
  value_display: string;
  delta_display?: string;
  is_positive: boolean;
  icon_key?: string;
};

export type AccountingReportingOverviewMonthlyPerformance = {
  label: string;
  revenue_pct: number;
  expense_pct: number;
};

export type AccountingReportingOverviewRevenueSegment = {
  label_display: string;
  pct: number;
};

export type AccountingReportingOverviewRecentTransaction = {
  date_display: string;
  description: string;
  category: string;
  amount_display: string;
  badge_class: string;
};

export type AccountingReportingOverviewResponse = {
  period_label: string;
  updated_at: string;
  kpis: AccountingReportingOverviewKpi[];
  monthly_performance: AccountingReportingOverviewMonthlyPerformance[];
  revenue_segments: AccountingReportingOverviewRevenueSegment[];
  recent_transactions: AccountingReportingOverviewRecentTransaction[];
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
};

export type AccountingReportingTieOutSummary = {
  domain: "marketplace" | "rental" | string;
  label: string;
  operational_total: number;
  gl_total: number;
  delta: number;
  operational_count: number;
  gl_count: number;
  mismatch_count: number;
  status: "balanced" | "mismatch" | string;
};

export type AccountingReportingTieOutMismatch = {
  domain: "marketplace" | "rental" | string;
  source_id?: string;
  source_reference: string;
  source_document_reference?: string;
  operational_amount: number;
  gl_amount: number;
  delta: number;
  mismatch_status: string;
  mismatch_reason: string;
  readiness_status?: string;
  readiness_reason?: string;
  journal_number?: string;
  trace_available: boolean;
};

export type AccountingReportingTieOutFixedAssetItem = {
  asset_id: number;
  asset_name: string;
  asset_reference: string;
  fixed_asset_status?: string;
  fixed_asset_category?: string;
  fixed_asset_reference?: string;
  depreciation_method?: string;
  useful_life_months?: number;
  maintenance_classification?: string;
  maturity_status: string;
  gap_reason?: string;
};

export type AccountingReportingTieOutFixedAssetSummary = {
  qualified_asset_count: number;
  registered_asset_count: number;
  profiled_asset_count: number;
  missing_register_count: number;
  missing_profile_count: number;
  review_items: AccountingReportingTieOutFixedAssetItem[];
};

export type AccountingReportingTieOutResponse = {
  period_label: string;
  summaries: AccountingReportingTieOutSummary[];
  mismatches: AccountingReportingTieOutMismatch[];
  fixed_asset_summary?: AccountingReportingTieOutFixedAssetSummary;
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
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
  report_context: AccountingReportingReportContext;
};
