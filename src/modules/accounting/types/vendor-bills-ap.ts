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
