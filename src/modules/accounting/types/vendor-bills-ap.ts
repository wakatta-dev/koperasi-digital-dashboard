/** @format */

export type VendorBillStatus = "Draft" | "Approved" | "Paid" | "Overdue";

export type VendorBillSummaryMetricTone = "primary" | "warning" | "danger" | "success";

export type VendorBillSummaryMetric = {
  key: string;
  label: string;
  value: string;
  helper_text: string;
  status_tone: VendorBillSummaryMetricTone;
};

export type VendorBillListItem = {
  bill_number: string;
  vendor_name: string;
  vendor_initial: string;
  vendor_initial_class_name: string;
  bill_date: string;
  due_date: string;
  amount: string;
  status: VendorBillStatus;
  is_selectable: boolean;
};

export type VendorBillDetailOverviewModel = {
  bill_number: string;
  status: VendorBillStatus;
  created_label: string;
  vendor: {
    name: string;
    address_lines: string[];
    email: string;
    avatar_initial: string;
    avatar_tone_class_name: string;
  };
  meta: {
    bill_date: string;
    due_date: string;
    due_note: string;
    reference_number: string;
    currency: string;
  };
};

export type VendorBillLineItem = {
  id: string;
  item_description: string;
  detail: string;
  qty: string;
  unit_price: string;
  total: string;
};

export type VendorBillTotals = {
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  paid_to_date: string;
  balance_due: string;
};

export type VendorBillPaymentHistoryItem = {
  payment_date: string;
  payment_reference: string;
  payment_method: string;
  amount_paid: string;
  status: "SUCCESS";
};

export type VendorBillDetailModel = {
  overview: VendorBillDetailOverviewModel;
  line_items: VendorBillLineItem[];
  totals: VendorBillTotals;
  payment_history: VendorBillPaymentHistoryItem[];
  internal_note: string;
};

export type CreateVendorBillLineItem = {
  id: string;
  product_or_service: string;
  description: string;
  qty: string;
  price: string;
  tax_name: string;
  amount: string;
};

export type CreateVendorBillDraft = {
  vendor_name: string;
  bill_number: string;
  status: "Draft";
  bill_date: string;
  due_date: string;
  line_items: CreateVendorBillLineItem[];
  attachments: {
    label: string;
    helper_text: string;
  };
  subtotal: string;
  tax_total: string;
  grand_total: string;
};

export type BatchPaymentBillItem = {
  bill_number: string;
  vendor_name: string;
  vendor_id_label: string;
  reference: string;
  due_state: string;
  due_state_tone: "normal" | "warning" | "danger";
  amount_due: string;
  payment_amount: string;
  is_selected: boolean;
};

export type BatchPaymentDraft = {
  pay_from: string;
  payment_date: string;
  reference_number: string;
  total_bills_label: string;
  total_bills_amount: string;
  credits_applied_amount: string;
  total_to_pay_amount: string;
};

export type VendorCreditNoteItem = {
  credit_note_number: string;
  vendor_name: string;
  amount: string;
  reason: string;
  issued_at: string;
  is_selected: boolean;
};

export type OcrExtractionSession = {
  session_id: string;
  file_name: string;
  file_size_label: string;
  zoom_percent_label: string;
  accuracy_score: number;
  general_info: {
    vendor_name: string;
    bill_number: string;
    vendor_confidence_label: string;
    bill_number_confidence_label: string;
    bill_date: string;
    due_date: string;
  };
  financials: {
    total_amount: string;
  };
  line_items: {
    id: string;
    description: string;
    qty: string;
    price: string;
    highlight_price: boolean;
  }[];
};

export type PaymentConfirmationModel = {
  total_paid: string;
  bill_count_label: string;
  bill_breakdowns: {
    bill_number: string;
    vendor_name: string;
    amount: string;
  }[];
  security_note: string;
};
