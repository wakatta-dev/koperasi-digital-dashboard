/** @format */

export type FinancePreset = "today" | "7d" | "month" | "custom";

export type TimeRange = {
  start?: string;
  end?: string;
  preset?: FinancePreset;
  display_label?: string;
};

export type SalesKpi = {
  total_revenue: number;
  transaction_count: number;
  average_ticket: number;
  delta_label?: string;
  delta_direction?: "up" | "down" | "flat";
  comparison_period?: string;
  last_updated?: string;
};

export type ProductPerformance = {
  product_id: string;
  name: string;
  units_sold: number;
  revenue: number;
  contribution_pct: number;
};

export type ChannelPerformance = {
  channel_id: string;
  name: string;
  revenue: number;
  share_pct: number;
  transactions: number;
  average_ticket: number;
  color_token?: string;
};

export type SalesSummaryResponse = {
  total_revenue: any;
  transaction_count: number;
  average_ticket: number;
  delta_label: string | undefined;
  delta_direction: "up" | "down" | "flat" | undefined;
  comparison_period: string | undefined;
  last_updated: string | undefined;
  range: TimeRange;
  kpis: SalesKpi;
};

export type TopProductsResponse = {
  items: ProductPerformance[];
  meta?: { last_updated?: string };
};

export type ChannelsResponse = {
  items: ChannelPerformance[];
  meta?: { last_updated?: string };
};

export type FinanceQuery = {
  start?: string;
  end?: string;
  preset?: FinancePreset;
  limit?: number;
  format?: "csv" | "xlsx";
};

export type OverviewKpi = {
  title: string;
  value: string;
  delta?: string;
  positive?: boolean;
};

export type RevenueBreakdown = {
  label: string;
  value: number;
  pct: number;
};

export type ChannelBreakdown = {
  id: string;
  name: string;
  value: number;
  pct: number;
  transactions?: number;
  average_ticket?: number;
  color_token?: string;
};

export type OverviewResponse = {
  range: TimeRange;
  kpis: OverviewKpi[];
  revenue_breakdown: RevenueBreakdown[];
  channel_breakdown: ChannelBreakdown[];
};

export type ProfitLossRow = {
  label: string;
  value: number;
  level?: number;
  highlight?: boolean;
};

export type ProfitLossResponse = {
  range: TimeRange;
  summary: OverviewKpi[];
  rows: ProfitLossRow[];
};

export type CashFlowSection = {
  title: string;
  items: { label: string; value: number }[];
};

export type CashFlowRow = {
  category: string;
  subcategory?: string;
  description?: string;
  amount: number;
  highlight?: boolean;
};

export type CashFlowResponse = {
  range: TimeRange;
  sections: CashFlowSection[];
  rows?: CashFlowRow[];
};

export type BalanceRow = { label: string; value: number };

export type BalanceSheetResponse = {
  range: TimeRange;
  assets: BalanceRow[];
  liabilities: BalanceRow[];
  equity: BalanceRow[];
};
