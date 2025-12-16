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
