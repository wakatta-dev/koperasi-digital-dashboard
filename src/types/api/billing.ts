/** @format */

import type { Rfc3339String } from './common';

export interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  module_code: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  // UI optional field retained
  duration_months?: number;
}

export interface TenantSubscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  status: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  plan?: Plan;
}

export interface InvoiceItem { id: number; invoice_id: number; description: string; quantity: number; price: number }

export interface Invoice {
  id: number;
  tenant_id: number;
  number: string;
  issued_at: Rfc3339String;
  due_date: Rfc3339String;
  subscription_id?: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface Payment {
  id: number;
  invoice_id: number;
  method: string;
  proof_url: string;
  amount?: number;
  status: 'pending' | 'verified' | 'rejected';
  gateway?: string;
  external_id?: string;
  paid_at?: Rfc3339String;
  created_at: Rfc3339String;
}

export interface StatusAudit { id: number; entity_type: 'invoice' | 'subscription'; entity_id: number; old_status: string; new_status: string; changed_by: number; changed_at: Rfc3339String }

export type Subscription = TenantSubscription; // alias for existing code
export type SubscriptionSummary = { active: number; suspended: number; overdue: number };
