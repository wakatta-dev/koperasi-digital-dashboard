/** @format */

import type { ChannelSummary } from "./notification";
import type { SupportActivityLogItem } from "./support";

export type VendorDashboardKpi = {
  id:
    | "total_tenants"
    | "active_tenants"
    | "inactive_tenants"
    | "overdue_invoices"
    | "notification_failures";
  label: string;
  value: number;
  helper: string;
};

export type VendorDashboardTenantBreakdown = {
  type: string;
  total: number;
};

export type VendorDashboardInvoiceAlert = {
  invoice_number: string;
  customer_name: string;
  due_date: string;
  total_amount: number;
  status: string;
};

export type VendorDashboardSummary = {
  kpis: VendorDashboardKpi[];
  tenant_breakdown: VendorDashboardTenantBreakdown[];
  recent_activity: SupportActivityLogItem[];
  invoice_alerts: VendorDashboardInvoiceAlert[];
  notification_channels: ChannelSummary[];
};
