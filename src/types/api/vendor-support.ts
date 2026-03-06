/** @format */

export type VendorSupportQueueCategory = "billing" | "tenant_ops" | "audit";
export type VendorSupportQueuePriority = "high" | "medium" | "low";
export type VendorSupportQueueStatus = "open" | "pending" | "watch";
export type VendorSupportQueueSource =
  | "overdue_invoice"
  | "deactivated_tenant"
  | "activity_signal";

export type VendorSupportQueueItem = {
  id: string;
  source: VendorSupportQueueSource;
  category: VendorSupportQueueCategory;
  priority: VendorSupportQueuePriority;
  status: VendorSupportQueueStatus;
  title: string;
  summary: string;
  tenant_id?: number;
  tenant_label: string;
  reference: string;
  occurred_at: string;
  sla_target_hours: number;
  age_hours: number;
  metadata?: Record<string, unknown>;
};

export type VendorSupportAnalytics = {
  total_open: number;
  total_high_priority: number;
  sla_breaches: number;
  billing_cases: number;
  tenant_ops_cases: number;
  audit_cases: number;
};

export type VendorSupportQueueSummary = {
  items: VendorSupportQueueItem[];
  analytics: VendorSupportAnalytics;
};
