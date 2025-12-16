/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AnalyticsRange = "today" | "7d" | "30d" | "custom";

export type AnalyticsKpiId =
  | "sales_today"
  | "transactions_today"
  | "active_orders"
  | "low_stock_count";

export type TrendDirection = "up" | "down" | "flat";

export type Severity = "info" | "warn" | "error";

export type AnalyticsKpi = {
  id: AnalyticsKpiId;
  label: string;
  value: number;
  currency?: string;
  prior_value?: number;
  trend_direction?: TrendDirection;
  trend_delta_pct?: number;
  timeframe: AnalyticsRange;
  last_updated?: Rfc3339String;
  severity?: Severity;
};

export type OverviewPoint = {
  period: string;
  metric: "revenue" | "transactions";
  value: number;
  comparison_value?: number;
};

export type ProductPerformance = {
  product_id: string;
  name: string;
  units_sold: number;
  stock_available: number;
  reorder_point?: number | null;
  tenant_default_reorder_point?: number | null;
};

export type AnalyticsNotification = {
  id: string;
  type: "order" | "payment" | "stock" | "shipment" | string;
  message: string;
  severity: Severity;
  timestamp: Rfc3339String;
  read: boolean;
  cleared: boolean;
  action_path?: string;
};

export type AnalyticsQuickAction = {
  id: "new_sale" | "add_product" | "log_expense" | string;
  label: string;
  target_path: string;
  enabled: boolean;
};

export type AnalyticsResponseData = {
  kpis: AnalyticsKpi[];
  overview: {
    series: OverviewPoint[];
  };
  top_products: ProductPerformance[];
  notifications: AnalyticsNotification[];
  quick_actions: AnalyticsQuickAction[];
  meta: {
    last_updated?: Rfc3339String;
  };
};

export type AnalyticsResponse = ApiResponse<AnalyticsResponseData>;

export type AnalyticsQuery = {
  range?: AnalyticsRange;
  start?: string;
  end?: string;
  limit_top_products?: number;
};
