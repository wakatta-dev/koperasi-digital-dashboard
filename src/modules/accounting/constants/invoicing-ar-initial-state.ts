/** @format */

import type {
  CreditNoteDraftForm,
  CreditNoteListItem,
  InvoiceDetailModel,
  InvoiceDraftForm,
  InvoiceLineItem,
  InvoiceListItem,
  PaymentListItem,
  PaymentReceiptDraft,
} from "../types/invoicing-ar";

export const INITIAL_INVOICE_LINE_ITEM: InvoiceLineItem = {
  id: "invoice-line-1",
  product_or_service: "",
  description: "",
  qty: 1,
  price: "",
  tax: "11%",
  line_total: "0",
};

export const INITIAL_INVOICE_DRAFT: InvoiceDraftForm = {
  customer_query: "",
  invoice_number: "",
  invoice_date: "",
  due_date: "",
  line_items: [INITIAL_INVOICE_LINE_ITEM],
  internal_notes: "",
  subtotal: "0",
  tax_total: "0",
  grand_total: "0",
};

export const INITIAL_CREDIT_NOTE_DRAFT: CreditNoteDraftForm = {
  customer: "",
  credit_note_date: "",
  original_invoice_reference: "",
  reason_for_credit: "",
  credited_items: [
    {
      id: "credit-line-1",
      product_or_service: "",
      description: "",
      qty: 1,
      price: "",
      tax: "11%",
      line_total: "0",
    },
  ],
  subtotal: "0",
  tax_total: "0",
  total_credit: "0",
};

export const INITIAL_PAYMENT_DRAFT: PaymentReceiptDraft = {
  customer: "",
  payment_date: "",
  payment_method: "",
  destination_account: "",
  amount_received: "",
  selected_invoice_numbers: [],
};

export const EMPTY_INVOICE_DETAIL: InvoiceDetailModel = {
  current_step: "Draft",
  invoice_number: "",
  invoice_date: "",
  due_date: "",
  customer_identity: {
    name: "",
    address_lines: [],
  },
  detail_rows: [],
  summary_totals: {
    subtotal: "Rp 0",
    tax: "Rp 0",
    total: "Rp 0",
  },
};

export const EMPTY_INVOICE_ITEMS: InvoiceListItem[] = [];
export const EMPTY_CREDIT_NOTES: CreditNoteListItem[] = [];
export const EMPTY_PAYMENTS: PaymentListItem[] = [];
