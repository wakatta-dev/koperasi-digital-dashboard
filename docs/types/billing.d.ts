import type { APIResponse, Rfc3339String } from './index';

export interface Plan { id: number; name: string; type: string; price: number; status: string; module_code: string; created_at: Rfc3339String; updated_at: Rfc3339String }

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

export interface UpdatePlanStatusRequest { status: string }
export interface UpdateInvoiceStatusRequest { status: 'pending' | 'paid' | 'overdue'; note?: string }
export interface PaymentRequest { method: string; proof_url: string; gateway?: string; external_id?: string }
export interface VerifyPaymentRequest { status: 'verified' | 'rejected'; gateway?: string; external_id?: string }

export type ListPlansResponse = APIResponse<Plan[]>;
export type CreatePlanResponse = APIResponse<Plan>;
export type GetPlanResponse = APIResponse<Plan>;
export type UpdatePlanResponse = APIResponse<Plan>;
export type UpdatePlanStatusResponse = APIResponse<Plan>;
export type DeletePlanResponse = APIResponse<{ id: number }>;

export type ListInvoicesResponse = APIResponse<Invoice[]>;
export type CreateInvoiceResponse = APIResponse<Invoice>;
export type GetInvoiceResponse = APIResponse<Invoice>;
export type UpdateInvoiceResponse = APIResponse<Invoice>;
export type UpdateInvoiceStatusResponse = APIResponse<Invoice>;
export type DeleteInvoiceResponse = APIResponse<{ id: number }>;
export type CreatePaymentResponse = APIResponse<Payment>;
export type VerifyPaymentResponse = APIResponse<Payment>;

export type ListClientInvoicesResponse = APIResponse<Invoice[]>;
export type GetClientInvoiceResponse = APIResponse<Invoice>;
export type GetClientInvoiceAuditsResponse = APIResponse<StatusAudit[]>;
export type GetClientSubscriptionResponse = APIResponse<TenantSubscription>;

export type ListSubscriptionsResponse = APIResponse<TenantSubscription[]>;
export type UpdateSubscriptionStatusResponse = APIResponse<TenantSubscription>;
export type GetSubscriptionsSummaryResponse = APIResponse<{ active: number; suspended: number; overdue: number }>;
export type ListStatusAuditsResponse = APIResponse<StatusAudit[]>;

