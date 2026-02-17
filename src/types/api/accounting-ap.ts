/** @format */

export type AccountingApBillStatus = "Draft" | "Approved" | "Paid" | "Overdue";

export type AccountingApBatchStatus = "Draft" | "Scheduled" | "Completed" | "Failed";

export type AccountingApOcrSessionStatus = "Draft" | "Reviewed" | "Confirmed" | "Discarded";

export type AccountingApPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingApOverviewCard = {
  key: string;
  label: string;
  value: string;
  helper_text: string;
  status_tone: "primary" | "warning" | "danger" | "success";
};

export type AccountingApOverviewResponse = {
  cards: AccountingApOverviewCard[];
};

export type AccountingApBillListQuery = {
  q?: string;
  status?: AccountingApBillStatus;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export type AccountingApBillListItem = {
  bill_number: string;
  vendor_name: string;
  bill_date: string;
  due_date: string;
  amount: number;
  status: AccountingApBillStatus;
};

export type AccountingApBillListResponse = {
  items: AccountingApBillListItem[];
  pagination: AccountingApPagination;
};

export type AccountingApBillDetailResponse = {
  bill_number: string;
  status: AccountingApBillStatus;
  created_label: string;
  vendor: {
    name: string;
    address_lines: string[];
    email: string;
  };
  meta: {
    bill_date: string;
    due_date: string;
    due_note?: string;
    reference_number: string;
    currency: string;
  };
  line_items: Array<{
    item_description: string;
    detail: string;
    qty: string;
    unit_price: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    paid_to_date: number;
    balance_due: number;
  };
  internal_note?: string;
};

export type AccountingApCreateBillRequest = {
  vendor_name: string;
  bill_number?: string;
  bill_date: string;
  due_date: string;
  line_items: Array<{
    product_or_service: string;
    description?: string;
    qty: number;
    price: number;
    tax_name?: string;
  }>;
  attachments?: Array<{
    file_name: string;
    storage_key: string;
    mime_type: string;
    file_size_bytes: number;
  }>;
};

export type AccountingApCreateBillResponse = {
  bill_number: string;
  status: AccountingApBillStatus;
  totals: {
    subtotal: number;
    tax_amount: number;
    total_amount: number;
  };
};

export type AccountingApUpdateBillRequest = AccountingApCreateBillRequest;

export type AccountingApUpdateBillStatusRequest = {
  status: Extract<AccountingApBillStatus, "Draft" | "Approved" | "Paid">;
};

export type AccountingApUpdateBillStatusResponse = {
  bill_number: string;
  status: AccountingApBillStatus;
};

export type AccountingApBillPaymentHistoryItem = {
  payment_date: string;
  payment_reference: string;
  payment_method: string;
  amount_paid: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
};

export type AccountingApBillPaymentHistoryResponse = {
  items: AccountingApBillPaymentHistoryItem[];
};

export type AccountingApVendorCreditListQuery = {
  q?: string;
  vendor_name?: string;
  active_only?: boolean;
  page?: number;
  per_page?: number;
};

export type AccountingApVendorCreditListItem = {
  credit_note_number: string;
  vendor_name: string;
  amount: number;
  remaining_amount: number;
  reason: string;
  issued_at: string;
  is_active: boolean;
};

export type AccountingApVendorCreditListResponse = {
  items: AccountingApVendorCreditListItem[];
  pagination: AccountingApPagination;
};

export type AccountingApBatchPreviewRequest = {
  bill_numbers: string[];
  selected_credit_note_numbers?: string[];
  payment_date: string;
  pay_from_account: string;
};

export type AccountingApBatchPreviewResponse = {
  selected_bills: Array<{
    bill_number: string;
    vendor_name: string;
    amount_due: number;
  }>;
  selected_credits: Array<{
    credit_note_number: string;
    amount: number;
  }>;
  totals: {
    total_bills_amount: number;
    credits_applied_amount: number;
    total_to_pay_amount: number;
  };
};

export type AccountingApCreateBatchPaymentRequest = {
  batch_reference: string;
  pay_from_account: string;
  payment_date: string;
  items: Array<{
    bill_number: string;
    payment_amount: number;
  }>;
  selected_credit_note_numbers?: string[];
};

export type AccountingApCreateBatchPaymentResponse = {
  batch_reference: string;
  status: AccountingApBatchStatus;
  total_to_pay_amount: number;
  payment_confirmation: {
    bill_count: number;
    bill_breakdowns: Array<{
      bill_number: string;
      vendor_name: string;
      amount: number;
    }>;
  };
};

export type AccountingApBatchDetailResponse = {
  batch_reference: string;
  status: AccountingApBatchStatus;
  totals: {
    total_bills_amount: number;
    credits_applied_amount: number;
    total_to_pay_amount: number;
  };
  bill_breakdowns: Array<{
    bill_number: string;
    vendor_name: string;
    amount: number;
  }>;
};

export type AccountingApCreateOcrSessionRequest = {
  file_name: string;
  file_size_bytes: number;
  raw_payload: Record<string, unknown>;
};

export type AccountingApCreateOcrSessionResponse = {
  session_id: string;
  status: AccountingApOcrSessionStatus;
  accuracy_percent: number;
  extracted_data: Record<string, unknown>;
};

export type AccountingApUpdateOcrSessionRequest = {
  edited_data: Record<string, unknown>;
  status?: "Reviewed";
};

export type AccountingApUpdateOcrSessionResponse = {
  session_id: string;
  status: AccountingApOcrSessionStatus;
  edited_data: Record<string, unknown>;
};

export type AccountingApConfirmOcrSessionRequest = {
  confirmation_payload?: Record<string, unknown>;
};

export type AccountingApConfirmOcrSessionResponse = {
  session_id: string;
  status: "Confirmed";
  bill_number: string;
};
