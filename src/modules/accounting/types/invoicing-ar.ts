/** @format */

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export type CreditNoteStatus = "Open" | "Applied" | "Cancelled";

export type PaymentStatus = "Completed" | "Pending" | "Failed";

export type InvoiceStepperStatus = "Draft" | "Sent" | "Paid";

export type InvoiceListItem = {
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  status: InvoiceStatus;
};

export type InvoiceLineItem = {
  id: string;
  product_or_service: string;
  description: string;
  qty: number;
  price: string;
  tax: string;
  line_total: string;
};

export type InvoiceDraftForm = {
  customer_query: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  internal_notes: string;
  subtotal: string;
  tax_total: string;
  grand_total: string;
};

export type CreditNoteDraftForm = {
  customer: string;
  credit_note_date: string;
  original_invoice_reference: string;
  reason_for_credit: string;
  credited_items: InvoiceLineItem[];
  subtotal: string;
  tax_total: string;
  total_credit: string;
};

export type PaymentReceiptDraft = {
  customer: string;
  payment_date: string;
  payment_method: string;
  destination_account: string;
  amount_received: string;
  selected_invoice_numbers: string[];
};

export type CreditNoteListItem = {
  date: string;
  credit_note_number: string;
  invoice_number: string;
  customer: string;
  amount: string;
  status: CreditNoteStatus;
};

export type PaymentListItem = {
  date: string;
  payment_number: string;
  invoice_number: string;
  customer: string;
  method: string;
  amount: string;
  status: PaymentStatus;
};

export type InvoiceDetailModel = {
  current_step: InvoiceStepperStatus;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_identity: {
    name: string;
    address_lines: string[];
  };
  detail_rows: InvoiceLineItem[];
  summary_totals: {
    subtotal: string;
    tax: string;
    total: string;
  };
};
