/** @format */

import type {
  BatchPaymentBillItem,
  BatchPaymentDraft,
  CreateVendorBillDraft,
  OcrExtractionSession,
  PaymentConfirmationModel,
  VendorBillDetailModel,
  VendorBillListItem,
  VendorBillSummaryMetric,
  VendorCreditNoteItem,
} from "../types/vendor-bills-ap";

export const EMPTY_VENDOR_BILL_SUMMARY_METRICS: VendorBillSummaryMetric[] = [];
export const EMPTY_VENDOR_BILLS: VendorBillListItem[] = [];
export const EMPTY_BATCH_PAYMENT_BILLS: BatchPaymentBillItem[] = [];
export const EMPTY_VENDOR_CREDITS: VendorCreditNoteItem[] = [];

export function buildInitialBatchPaymentDraft(now = new Date()): BatchPaymentDraft {
  return {
    pay_from: "",
    payment_date: now.toISOString().slice(0, 10),
    reference_number: "",
    total_bills_label: "Total Bills (0)",
    total_bills_amount: "Rp 0",
    credits_applied_amount: "Rp 0",
    total_to_pay_amount: "Rp 0",
  };
}

export const INITIAL_CREATE_VENDOR_BILL_DRAFT: CreateVendorBillDraft = {
  vendor_name: "",
  bill_number: "",
  status: "Draft",
  bill_date: "",
  due_date: "",
  line_items: [
    {
      id: "vendor-bill-line-1",
      product_or_service: "",
      description: "",
      qty: "1",
      price: "",
      tax_name: "",
      amount: "0",
    },
  ],
  attachments: {
    label: "Click to upload or drag and drop",
    helper_text: "PDF, JPG, PNG up to 10MB",
  },
  subtotal: "Rp 0",
  tax_total: "Rp 0",
  grand_total: "Rp 0",
};

export const EMPTY_VENDOR_BILL_DETAIL: VendorBillDetailModel = {
  overview: {
    bill_number: "",
    status: "Draft",
    created_label: "",
    vendor: {
      name: "",
      address_lines: [],
      email: "",
      avatar_initial: "V",
      avatar_tone_class_name:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    meta: {
      bill_date: "",
      due_date: "",
      due_note: "",
      reference_number: "",
      currency: "",
    },
  },
  line_items: [],
  totals: {
    subtotal: "Rp 0",
    tax_amount: "Rp 0",
    total_amount: "Rp 0",
    paid_to_date: "Rp 0",
    balance_due: "Rp 0",
  },
  payment_history: [],
  internal_note: "",
};

export const EMPTY_OCR_SESSION: OcrExtractionSession = {
  session_id: "",
  file_name: "",
  file_size_label: "",
  zoom_percent_label: "100%",
  accuracy_score: 0,
  general_info: {
    vendor_name: "",
    bill_number: "",
    vendor_confidence_label: "",
    bill_number_confidence_label: "",
    bill_date: "",
    due_date: "",
  },
  financials: {
    total_amount: "",
  },
  line_items: [],
};

export const EMPTY_PAYMENT_CONFIRMATION: PaymentConfirmationModel = {
  total_paid: "Rp 0",
  bill_count_label: "0 bills",
  bill_breakdowns: [],
  security_note: "",
};
