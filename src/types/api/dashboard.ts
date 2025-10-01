/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type DashboardNotification = {
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

type VendorOverdueInvoice = {
  id: number;
  number: string;
  total: number;
  due_date: Rfc3339String;
};

export type VendorDashboardSummary = {
  active_clients: number;
  inactive_clients: number;
  suspended_clients: number;
  total_revenue: number;
  monthly_revenue: number;
  open_tickets: number;
  activity: VendorActivity[];
  overdue_invoices: VendorOverdueInvoice[];
};

export type KoperasiDashboardSummary = {
  active_members: number;
  total_savings: number;
  total_loans: number;
  running_shu: number;
  graph_data: number[];
  shortcuts: ShortcutItem[];
  installment_notifications: DashboardNotification[];
  application_notifications: DashboardNotification[];
};

export type BumdesDashboardSummary = {
  revenue_per_unit: number[];
  consolidated_revenue: number;
  booking_notifications: DashboardNotification[];
  rental_notifications: DashboardNotification[];
};

export type UmkmDashboardSummary = {
  daily_sales: number;
  daily_orders: number;
  top_products: string[];
  low_stock_notifications: DashboardNotification[];
};

export type DashboardSummary =
  | VendorDashboardSummary
  | KoperasiDashboardSummary
  | BumdesDashboardSummary
  | UmkmDashboardSummary;

export type DashboardResponse = ApiResponse<DashboardSummary>;
export type GetVendorDashboardResponse = ApiResponse<VendorDashboardSummary>;

export type TenantDashboardSummaryMap = {
  vendor: VendorDashboardSummary;
  koperasi: KoperasiDashboardSummary;
  bumdes: BumdesDashboardSummary;
  umkm: UmkmDashboardSummary;
};

export type TenantType = keyof TenantDashboardSummaryMap;
export type DashboardSummaryFor<T extends TenantType> =
  TenantDashboardSummaryMap[T];

// Backward-compatible aliases used across the app
export type VendorDashboard = VendorDashboardSummary;
