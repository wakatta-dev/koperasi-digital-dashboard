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
  created_at: string;
}
