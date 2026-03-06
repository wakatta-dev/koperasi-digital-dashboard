/** @format */

import { ensureSuccess } from "@/lib/api";
import type {
  AccountingArInvoiceListItem,
  AdminTenantListItem,
  SupportActivityLogItem,
  VendorSupportQueueItem,
  VendorSupportQueueSummary,
} from "@/types/api";
import { listAccountingArInvoices } from "./accounting-ar";
import { listAdminTenants } from "./admin-tenants";
import { listSupportActivityLogs } from "./support-activity-logs";

function diffHours(value?: string | null) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.round((Date.now() - time) / (1000 * 60 * 60)));
}

function normalizeTenantLabel(tenant?: Partial<AdminTenantListItem> | null) {
  if (!tenant) return "Unknown Tenant";
  return tenant.display_name || tenant.name || tenant.tenant_code || "Unknown Tenant";
}

function findTenantByName(
  tenants: AdminTenantListItem[],
  customerName?: string | null
) {
  const normalized = (customerName ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  return tenants.find((tenant) => {
    const candidates = [
      tenant.display_name,
      tenant.name,
      tenant.tenant_code,
      tenant.contact_email,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());
    return candidates.includes(normalized);
  });
}

function buildOverdueInvoiceCases(
  tenants: AdminTenantListItem[],
  invoices: AccountingArInvoiceListItem[]
): VendorSupportQueueItem[] {
  return invoices
    .filter((invoice) => invoice.status === "Overdue")
    .map((invoice) => {
      const tenant = findTenantByName(tenants, invoice.customer_name);
      return {
        id: `invoice-${invoice.invoice_number}`,
        source: "overdue_invoice",
        category: "billing",
        priority: "high",
        status: "open",
        title: `Invoice overdue ${invoice.invoice_number}`,
        summary: `Tagihan untuk ${invoice.customer_name} melewati due date dan perlu follow-up.`,
        tenant_id: tenant?.id,
        tenant_label: tenant ? normalizeTenantLabel(tenant) : invoice.customer_name || "Unknown Customer",
        reference: invoice.invoice_number,
        occurred_at: invoice.due_date,
        sla_target_hours: 24,
        age_hours: diffHours(invoice.due_date),
        metadata: {
          customer_name: invoice.customer_name,
          total_amount: invoice.total_amount,
          status: invoice.status,
        },
      };
    });
}

function buildDeactivatedTenantCases(
  tenants: AdminTenantListItem[]
): VendorSupportQueueItem[] {
  return tenants
    .filter((tenant) => !tenant.is_active)
    .map((tenant) => ({
      id: `tenant-${tenant.id}`,
      source: "deactivated_tenant",
      category: "tenant_ops",
      priority: "medium",
      status: "pending",
      title: `Tenant nonaktif ${normalizeTenantLabel(tenant)}`,
      summary: "Tenant berada dalam status nonaktif dan perlu investigasi aktivasi atau billing.",
      tenant_id: tenant.id,
      tenant_label: normalizeTenantLabel(tenant),
      reference: tenant.tenant_code,
      occurred_at: tenant.updated_at,
      sla_target_hours: 48,
      age_hours: diffHours(tenant.updated_at),
      metadata: {
        business_type: tenant.business_type,
        status: tenant.status,
        contact_email: tenant.contact_email,
      },
    }));
}

function buildActivityCases(
  tenants: AdminTenantListItem[],
  logs: SupportActivityLogItem[]
): VendorSupportQueueItem[] {
  return logs.slice(0, 12).map((log) => {
    const tenant = tenants.find((item) => item.id === log.entity_id);
    const newStatus = log.new_status?.toLowerCase() ?? "";
    return {
      id: `activity-${log.id}`,
      source: "activity_signal",
      category: "audit",
      priority:
        newStatus.includes("fail") || newStatus.includes("deactivated") ? "high" : "low",
      status: "watch",
      title: `${log.module} / ${log.action}`,
      summary: log.reason || `Perubahan ${log.entity_type} terdeteksi di activity log.`,
      tenant_id: tenant?.id,
      tenant_label: tenant ? normalizeTenantLabel(tenant) : log.actor_label || "System",
      reference: `${log.entity_type}#${log.entity_id}`,
      occurred_at: log.timestamp,
      sla_target_hours: 72,
      age_hours: diffHours(log.timestamp),
      metadata: {
        actor: log.actor_label,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        old_status: log.old_status,
        new_status: log.new_status,
        module: log.module,
      },
    };
  });
}

export async function getVendorSupportQueueSummary(): Promise<VendorSupportQueueSummary> {
  const [tenantsRes, invoicesRes, activityLogsRes] = await Promise.all([
    listAdminTenants({ limit: 100 }),
    listAccountingArInvoices({ page: 1, per_page: 100 }),
    listSupportActivityLogs({ limit: 50 }),
  ]);

  const tenants = ensureSuccess(tenantsRes).items;
  const invoices = ensureSuccess(invoicesRes).items;
  const activityLogs =
    activityLogsRes.success && activityLogsRes.data
      ? activityLogsRes.data.items
      : [];

  const items = [
    ...buildOverdueInvoiceCases(tenants, invoices),
    ...buildDeactivatedTenantCases(tenants),
    ...buildActivityCases(tenants, activityLogs),
  ].sort((left, right) => {
    const leftTime = new Date(left.occurred_at).getTime();
    const rightTime = new Date(right.occurred_at).getTime();
    return rightTime - leftTime;
  });

  return {
    items,
    analytics: {
      total_open: items.filter((item) => item.status === "open").length,
      total_high_priority: items.filter((item) => item.priority === "high").length,
      sla_breaches: items.filter((item) => item.age_hours > item.sla_target_hours).length,
      billing_cases: items.filter((item) => item.category === "billing").length,
      tenant_ops_cases: items.filter((item) => item.category === "tenant_ops").length,
      audit_cases: items.filter((item) => item.category === "audit").length,
    },
  };
}
