/** @format */

export interface Plan {
  id: number;
  name: string;
  price: number;
  duration_months?: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  price: number;
  subscription_id?: number;
}

export interface Invoice {
  id: number;
  tenant_id: number;
  number: string;
  issued_at: string;
  due_date?: string | null;
  total: number;
  status: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
  subscription_id?: number;
}

export interface Payment {
  id: number;
  invoice_id: number;
  method: string;
  proof_url: string;
  status: string;
  gateway?: string;
  external_id?: string;
  created_at: string;
}

// Additional types to cover docs/modules/billing.md
export interface SubscriptionSummary {
  active: number;
  suspended: number;
  overdue: number;
}

export interface StatusAudit {
  id: number;
  entity: string; // e.g., "invoice" | "subscription"
  entity_id: number;
  old_status?: string | null;
  new_status: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date?: string | null;
  plan?: Plan;
}
