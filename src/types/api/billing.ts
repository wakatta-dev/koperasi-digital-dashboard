/** @format */

import type { Rfc3339String } from "./common";

export type Plan = {
  id: number;
  name: string;
  type: "package" | "addon";
  price: number;
  status: "active" | "inactive";
  module_code?: string;
  module_ids?: string[];
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  duration_months?: number;
};

export type InvoiceItem = {
  id: number;
  invoice_id: number;
  plan_id?: number;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  number: string;
  issued_at: Rfc3339String;
  due_date: Rfc3339String;
  subscription_id?: number;
  total: number;
  status: "draft" | "issued" | "paid" | "overdue";
  note?: string;
  items: InvoiceItem[];
  subscription?: TenantSubscription;
};

export type Payment = {
  id: number;
  invoice_id: number;
  business_unit_id?: number;
  method: string;
  proof_url: string;
  amount?: number;
  status: "pending" | "verified" | "rejected";
  gateway?: "midtrans";
  external_id?: string;
  paid_at?: Rfc3339String;
  created_at: Rfc3339String;
};

export type TenantSubscription = {
  id: number;
  tenant_id: number;
  business_unit_id?: number;
  plan_id: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  next_billing_date?: Rfc3339String;
  status: "active" | "pending" | "overdue" | "paused" | "terminated";
  plan?: Plan;
};

export type StatusAudit = {
  id: number;
  entity: string;
  ref_id: number;
  from_status: string;
  to_status: string;
  note?: string;
  actor_id?: number;
  created_at: Rfc3339String;
};

export type Subscription = TenantSubscription;
export type SubscriptionSummary = Record<string, number>;
