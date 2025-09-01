/** @format */

export type SummaryItem = {
  amount: number;
  change: number;
};

export interface ClientSummary {
  active_members: SummaryItem;
  total_savings: SummaryItem;
  active_loans: SummaryItem;
  current_year_shu: SummaryItem;
}

export interface OwnerSummaryItem {
  current: number;
  prev: number;
}
export interface OwnerSummary {
  monthly_active_client: OwnerSummaryItem;
  yearly_revenue: OwnerSummaryItem;
  monthly_revenue: OwnerSummaryItem;
  open_ticket: OwnerSummaryItem;
}

export interface NotificationItem {
  message: string;
  time: string;
}

// Minimal vendor dashboard DTO per docs/test-case/vendor/02_dashboard_vendor.md
export interface VendorDashboard {
  tenants_total: number;
  active_subscriptions: number;
  overdue_invoices: number;
  // allow additional metrics without breaking typing
  [key: string]: any;
}
