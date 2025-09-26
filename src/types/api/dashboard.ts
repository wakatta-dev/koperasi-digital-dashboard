/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type Notification = {
  id: string;
  title: string;
  type: string;
  created_at: Rfc3339String;
};

export type ShortcutItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

export type VendorActivity = {
  type: string;
  reference_id: string;
  title: string;
  status?: string;
  amount?: number;
  due_date?: Rfc3339String;
  timestamp: Rfc3339String;
};

export type VendorDashboardSummary = {
  active_clients: number;
  inactive_clients: number;
  suspended_clients: number;
  total_revenue: number;
  monthly_revenue: number;
  open_tickets: number;
  activity: VendorActivity[];
};

export type KoperasiDashboardSummary = {
  active_members: number;
  total_savings: number;
  total_loans: number;
  running_shu: number;
  graph_data: number[];
  shortcuts: ShortcutItem[];
  installment_notifications: Notification[];
  application_notifications: Notification[];
};

export type BumdesDashboardSummary = {
  revenue_per_unit: number[];
  consolidated_revenue: number;
  booking_notifications: Notification[];
  rental_notifications: Notification[];
};

export type UmkmDashboardSummary = {
  daily_sales: number;
  daily_orders: number;
  top_products: string[];
  low_stock_notifications: Notification[];
};

export type DashboardSummary =
  | VendorDashboardSummary
  | KoperasiDashboardSummary
  | BumdesDashboardSummary
  | UmkmDashboardSummary;

export type DashboardResponse = ApiResponse<DashboardSummary>;
export type GetVendorDashboardResponse = ApiResponse<VendorDashboardSummary>;

// Backward-compatible aliases used across the app
export type VendorDashboard = VendorDashboardSummary;
