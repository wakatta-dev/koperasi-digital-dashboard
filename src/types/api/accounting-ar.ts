/** @format */

export type AccountingArInvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export type AccountingArCreditNoteStatus = "Open" | "Used" | "Refunded";

export type AccountingArPaymentStatus = "Pending" | "Cleared";

export type AccountingArPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingArInvoiceListQuery = {
  q?: string;
  status?: AccountingArInvoiceStatus;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export type AccountingArInvoiceListItem = {
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  status: AccountingArInvoiceStatus;
};

export type AccountingArInvoiceListResponse = {
  items: AccountingArInvoiceListItem[];
  pagination: AccountingArPagination;
};

export type AccountingArInvoiceDetailLineItem = {
  product_or_service: string;
  description?: string;
  qty: number;
  price: number;
  tax_percent: number;
  line_total: number;
};

export type AccountingArInvoiceDetailResponse = {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: AccountingArInvoiceStatus;
  current_step: "Draft" | "Sent" | "Paid";
  customer: {
    customer_id?: number;
    customer_name: string;
    recipient_email?: string;
    address_lines?: string[];
  };
  line_items: AccountingArInvoiceDetailLineItem[];
  totals: {
    subtotal: number;
    tax_amount: number;
    grand_total: number;
    outstanding_amount: number;
  };
  notes?: string;
};

export type AccountingArCreateInvoiceRequest = {
  customer_id?: number;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  line_items: Array<{
    product_or_service: string;
    description?: string;
    qty: number;
    price: number;
    tax_percent: number;
  }>;
  notes?: string;
};

export type AccountingArCreateInvoiceResponse = {
  invoice_number: string;
  status: "Draft";
  totals: {
    subtotal: number;
    tax_amount: number;
    grand_total: number;
  };
};

export type AccountingArSendInvoiceRequest = {
  channel: "email";
  recipient_email: string;
  subject?: string;
};

export type AccountingArSendInvoiceResponse = {
  invoice_number: string;
  status: "Sent";
  send_state: "queued" | "sent";
  queued_at: string;
};

export type AccountingArInvoicePdfResponse = {
  invoice_number: string;
  download_url: string;
  expires_at: string;
};

export type AccountingArCreditNoteListQuery = {
  q?: string;
  status?: AccountingArCreditNoteStatus;
  page?: number;
  per_page?: number;
};

export type AccountingArCreditNoteListItem = {
  date: string;
  credit_note_number: string;
  invoice_number: string;
  customer: string;
  amount: number;
  status: AccountingArCreditNoteStatus;
};

export type AccountingArCreditNoteListResponse = {
  items: AccountingArCreditNoteListItem[];
  pagination: AccountingArPagination;
};

export type AccountingArCreateCreditNoteRequest = {
  customer_id?: number;
  customer_name: string;
  credit_note_date: string;
  original_invoice_reference?: string;
  reason_for_credit: string;
  items: Array<{
    item_name: string;
    qty: number;
    rate: number;
  }>;
};

export type AccountingArCreateCreditNoteResponse = {
  credit_note_number: string;
  status: "Open";
  total_credit: number;
};

export type AccountingArPaymentListQuery = {
  q?: string;
  status?: AccountingArPaymentStatus;
  page?: number;
  per_page?: number;
};

export type AccountingArPaymentListItem = {
  date: string;
  payment_number: string;
  customer: string;
  method: string;
  amount: number;
  status: AccountingArPaymentStatus;
  invoice_number: string;
};

export type AccountingArPaymentListResponse = {
  items: AccountingArPaymentListItem[];
  pagination: AccountingArPagination;
};

export type AccountingArRecordPaymentRequest = {
  customer_id?: number;
  customer_name: string;
  payment_date: string;
  payment_method: string;
  destination_account: string;
  amount_received: number;
  allocations: Array<{
    invoice_number: string;
    amount_applied: number;
  }>;
};

export type AccountingArRecordPaymentResponse = {
  payment_number: string;
  status: AccountingArPaymentStatus;
  applied_invoices: string[];
};
