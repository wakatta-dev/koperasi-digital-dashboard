/** @format */

import { ensureSuccess } from "@/lib/api";
import type {
  SupportActivityLogItem,
  VendorDashboardSummary,
} from "@/types/api";
import { listAccountingArInvoices } from "./accounting-ar";
import { listAdminTenants } from "./admin-tenants";
import { getNotificationMetrics } from "./notifications";
import { listSupportActivityLogs } from "./support-activity-logs";

function normalizeActivityItems(items: SupportActivityLogItem[] | undefined) {
  return (items ?? []).slice(0, 5);
}

export async function getVendorDashboardSummary(): Promise<VendorDashboardSummary> {
  const [tenantsRes, invoicesRes, notificationMetricsRes, activityLogsRes] =
    await Promise.all([
      listAdminTenants({ limit: 100 }),
      listAccountingArInvoices({ page: 1, per_page: 100 }),
      getNotificationMetrics(),
      listSupportActivityLogs({ limit: 5 }),
    ]);

  const tenants = ensureSuccess(tenantsRes).items;
  const invoices = ensureSuccess(invoicesRes).items;
  const notificationMetrics = ensureSuccess(notificationMetricsRes);
  const activityPayload = activityLogsRes.success
    ? activityLogsRes.data
    : { items: [] };

  const activeTenants = tenants.filter((tenant) => tenant.is_active).length;
  const inactiveTenants = tenants.length - activeTenants;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "Overdue");

  const tenantBreakdownMap = new Map<string, number>();
  tenants.forEach((tenant) => {
    const key = tenant.business_type || "unknown";
    tenantBreakdownMap.set(key, (tenantBreakdownMap.get(key) ?? 0) + 1);
  });

  return {
    kpis: [
      {
        id: "total_tenants",
        label: "Total Tenant",
        value: tenants.length,
        helper: "Seluruh klien SaaS terdaftar",
      },
      {
        id: "active_tenants",
        label: "Tenant Aktif",
        value: activeTenants,
        helper: "Tenant dengan status aktif",
      },
      {
        id: "inactive_tenants",
        label: "Tenant Nonaktif",
        value: inactiveTenants,
        helper: "Perlu follow-up aktivasi",
      },
      {
        id: "overdue_invoices",
        label: "Invoice Overdue",
        value: overdueInvoices.length,
        helper: "Tagihan belum terselesaikan",
      },
      {
        id: "notification_failures",
        label: "Gagal Notifikasi",
        value: notificationMetrics.total_failures,
        helper: "Akumulasi kegagalan delivery",
      },
    ],
    tenant_breakdown: Array.from(tenantBreakdownMap.entries()).map(
      ([type, total]) => ({
        type,
        total,
      })
    ),
    recent_activity: normalizeActivityItems(activityPayload?.items),
    invoice_alerts: overdueInvoices.slice(0, 5).map((invoice) => ({
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customer_name,
      due_date: invoice.due_date,
      total_amount: invoice.total_amount,
      status: invoice.status,
    })),
    notification_channels: notificationMetrics.channel_summaries,
  };
}
