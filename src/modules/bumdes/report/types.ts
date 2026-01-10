/** @format */

export type BumdesReportQuery = {
  preset?: string;
  start?: string;
  end?: string;
  limit?: number;
};

export type OverviewKPI = {
  title: string;
  value_display: string;
  delta_display?: string;
  is_positive: boolean;
  icon_key?: string;
};

export type MonthlyPerformance = {
  label: string;
  revenue_pct: number;
  expense_pct: number;
};

export type RevenueSegment = {
  label_display: string;
  pct: number;
};

export type RecentTransaction = {
  date_display: string;
  description: string;
  category: string;
  amount_display: string;
  badge_class: string;
};

export type OverviewReport = {
  period_label: string;
  updated_at: string;
  kpis: OverviewKPI[];
  monthly_performance: MonthlyPerformance[];
  revenue_segments: RevenueSegment[];
  recent_transactions: RecentTransaction[];
};

export type SummaryCard = {
  title: string;
  value_display: string;
  delta_display?: string;
  icon_key?: string;
};

export type ProfitLossRow = {
  type: "section" | "row" | "total" | "gross" | "net";
  label: string;
  value_display?: string;
};

export type ProfitLossReport = {
  period_label: string;
  updated_at: string;
  summary_cards: SummaryCard[];
  rows: ProfitLossRow[];
  notes: string[];
};

export type BalanceLine = {
  label: string;
  value_display: string;
};

export type BalanceSheetReport = {
  period_label: string;
  updated_at: string;
  assets: BalanceLine[];
  liabilities: BalanceLine[];
  equity: BalanceLine[];
  asset_total_display: string;
  liab_equity_total_display: string;
  asset_info: BalanceLine[];
  liability_info: BalanceLine[];
  status_label: string;
  notes: string[];
};

export type CashFlowRow = {
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

export type CashFlowReport = {
  period_label: string;
  updated_at: string;
  rows: CashFlowRow[];
  notes: string[];
};

export type ProductPerformance = {
  name: string;
  units_display: string;
  revenue_display: string;
  pct: number;
};

export type ChannelPerformance = {
  label: string;
  revenue_display: string;
  pct_display: string;
  color_key: string;
  transactions: number;
  average_ticket_display: string;
};

export type ChannelComparison = {
  label: string;
  transaction_count: number;
  average_ticket_display: string;
};

export type SalesDetailReport = {
  period_label: string;
  updated_at: string;
  summary_cards: SummaryCard[];
  top_products: ProductPerformance[];
  channel_breakdown: ChannelPerformance[];
  channel_comparison: ChannelComparison[];
};
