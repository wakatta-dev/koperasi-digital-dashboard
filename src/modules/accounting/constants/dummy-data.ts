/** @format */

import type {
  CreditNoteDraftForm,
  CreditNoteListItem,
  InvoiceDetailModel,
  InvoiceDraftForm,
  InvoiceListItem,
  InvoiceLineItem,
  PaymentListItem,
  PaymentReceiptDraft,
} from "../types/invoicing-ar";

export const DUMMY_INVOICE_ITEMS: InvoiceListItem[] = [
  {
    invoice_number: "INV-2023-1024",
    customer_name: "PT. Sumber Makmur",
    invoice_date: "Nov 14, 2023",
    due_date: "Dec 14, 2023",
    total_amount: "Rp 25.500.000",
    status: "Sent",
  },
  {
    invoice_number: "INV-2023-1023",
    customer_name: "CV. Teknologi Maju",
    invoice_date: "Nov 12, 2023",
    due_date: "Dec 12, 2023",
    total_amount: "Rp 8.250.000",
    status: "Paid",
  },
  {
    invoice_number: "INV-2023-1022",
    customer_name: "PT. Global Niaga",
    invoice_date: "Oct 28, 2023",
    due_date: "Nov 10, 2023",
    total_amount: "Rp 15.000.000",
    status: "Overdue",
  },
  {
    invoice_number: "INV-2023-1021",
    customer_name: "Toko Berkah Jaya",
    invoice_date: "Nov 14, 2023",
    due_date: "-",
    total_amount: "Rp 4.500.000",
    status: "Draft",
  },
];

export const DUMMY_CREDIT_NOTES: CreditNoteListItem[] = [
  {
    date: "Nov 14, 2023",
    credit_note_number: "CN-2023-042",
    invoice_number: "INV-2023-108",
    customer: "PT. Suka Maju",
    amount: "Rp 2.500.000",
    status: "Open",
  },
  {
    date: "Nov 08, 2023",
    credit_note_number: "CN-2023-041",
    invoice_number: "INV-2023-101",
    customer: "CV. Abadi Jaya",
    amount: "Rp 1.200.000",
    status: "Applied",
  },
];

export const DUMMY_PAYMENTS: PaymentListItem[] = [
  {
    date: "Nov 15, 2023",
    payment_number: "PAY-2023-332",
    invoice_number: "INV-2023-112",
    customer: "PT. Maju Bersama",
    method: "Bank Transfer",
    amount: "Rp 25.000.000",
    status: "Completed",
  },
  {
    date: "Nov 12, 2023",
    payment_number: "PAY-2023-330",
    invoice_number: "INV-2023-098",
    customer: "CV. Abadi Jaya",
    method: "Cash",
    amount: "Rp 12.450.000",
    status: "Pending",
  },
];

export const DUMMY_LINE_ITEMS: InvoiceLineItem[] = [
  {
    id: "line-1",
    product_or_service: "Cloud Infrastructure - Tier 2",
    description: "Monthly subscription fee for Enterprise Cluster",
    qty: 1,
    price: "12,500,000",
    tax: "11%",
    line_total: "13,875,000",
  },
  {
    id: "line-2",
    product_or_service: "Onboarding Support",
    description: "Professional services - 20 hours",
    qty: 20,
    price: "250,000",
    tax: "11%",
    line_total: "5,550,000",
  },
];

export const DUMMY_INVOICE_DRAFT: InvoiceDraftForm = {
  customer_query: "",
  invoice_number: "INV-2023-1025",
  invoice_date: "",
  due_date: "",
  line_items: DUMMY_LINE_ITEMS,
  internal_notes: "",
  subtotal: "17,500,000",
  tax_total: "1,925,000",
  grand_total: "19,425,000",
};

export const DUMMY_CREDIT_NOTE_DRAFT: CreditNoteDraftForm = {
  customer: "",
  credit_note_date: "2023-11-15",
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
      line_total: "Rp 0",
    },
  ],
  subtotal: "Rp 0",
  tax_total: "Rp 0",
  total_credit: "Rp 0",
};

export const DUMMY_PAYMENT_DRAFT: PaymentReceiptDraft = {
  customer: "PT. Maju Bersama",
  payment_date: "2023-11-15",
  payment_method: "Bank Transfer",
  destination_account: "Bank Central Asia - 12209301",
  amount_received: "25.000.000",
  selected_invoice_numbers: ["INV-2023-112"],
};

export const DUMMY_INVOICE_DETAIL: InvoiceDetailModel = {
  current_step: "Sent",
  invoice_number: "INV-2023-1024",
  invoice_date: "Nov 14, 2023",
  due_date: "Nov 28, 2023",
  customer_identity: {
    name: "PT. Suka Maju Bersama",
    address_lines: [
      "Jl. Jenderal Sudirman No. 123",
      "Kebayoran Baru, Jakarta Selatan",
      "DKI Jakarta, 12190",
    ],
  },
  detail_rows: [
    {
      id: "detail-1",
      product_or_service: "Cloud Infrastructure Monthly Subscription",
      description: "Enterprise Tier Plan - November Period",
      qty: 1,
      price: "Rp 8.500.000",
      tax: "11%",
      line_total: "Rp 8.500.000",
    },
    {
      id: "detail-2",
      product_or_service: "Cybersecurity Audit & Report",
      description: "Vulnerability assessment for internal servers",
      qty: 1,
      price: "Rp 4.000.000",
      tax: "11%",
      line_total: "Rp 4.000.000",
    },
    {
      id: "detail-3",
      product_or_service: "Managed Support SLA",
      description: "24/7 Priority technical support",
      qty: 1,
      price: "Rp 2.500.000",
      tax: "11%",
      line_total: "Rp 2.500.000",
    },
  ],
  summary_totals: {
    subtotal: "Rp 15.000.000",
    tax: "Rp 1.650.000",
    total: "Rp 16.650.000",
  },
};
