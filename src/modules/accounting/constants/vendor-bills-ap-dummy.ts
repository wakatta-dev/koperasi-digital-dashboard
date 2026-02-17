/** @format */

import type {
  BatchPaymentBillItem,
  BatchPaymentDraft,
  CreateVendorBillDraft,
  VendorBillDetailModel,
  VendorBillListItem,
  VendorBillSummaryMetric,
  VendorCreditNoteItem,
  OcrExtractionSession,
  PaymentConfirmationModel,
} from "../types/vendor-bills-ap";

export const DUMMY_VENDOR_BILL_SUMMARY_METRICS: VendorBillSummaryMetric[] = [
  {
    key: "total-outstanding",
    label: "Total Outstanding",
    value: "Rp 245.5M",
    helper_text: "Across 18 vendors",
    status_tone: "primary",
  },
  {
    key: "due-this-week",
    label: "Due This Week",
    value: "Rp 42.1M",
    helper_text: "8 bills requiring attention",
    status_tone: "warning",
  },
  {
    key: "overdue-bills",
    label: "Overdue Bills",
    value: "Rp 12.8M",
    helper_text: "4 bills past due date",
    status_tone: "danger",
  },
  {
    key: "vendor-credits",
    label: "Vendor Credits",
    value: "Rp 5.2M",
    helper_text: "Available to apply",
    status_tone: "success",
  },
];

export const DUMMY_VENDOR_BILLS: VendorBillListItem[] = [
  {
    bill_number: "BILL-2023-089",
    vendor_name: "PT. Pemasok Jaya",
    vendor_initial: "P",
    vendor_initial_class_name:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    bill_date: "Oct 25, 2023",
    due_date: "Nov 24, 2023",
    amount: "Rp 12.500.000",
    status: "Overdue",
    is_selectable: true,
  },
  {
    bill_number: "BILL-2023-092",
    vendor_name: "CV. Makmur Abadi",
    vendor_initial: "C",
    vendor_initial_class_name:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    bill_date: "Nov 10, 2023",
    due_date: "Dec 10, 2023",
    amount: "Rp 8.250.000",
    status: "Approved",
    is_selectable: true,
  },
  {
    bill_number: "BILL-2023-094",
    vendor_name: "Global Tech Solutions",
    vendor_initial: "G",
    vendor_initial_class_name:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    bill_date: "Nov 12, 2023",
    due_date: "Dec 12, 2023",
    amount: "Rp 45.000.000",
    status: "Draft",
    is_selectable: true,
  },
  {
    bill_number: "BILL-2023-085",
    vendor_name: "Logistics Plus Inc.",
    vendor_initial: "L",
    vendor_initial_class_name:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    bill_date: "Oct 15, 2023",
    due_date: "Nov 15, 2023",
    amount: "Rp 3.500.000",
    status: "Paid",
    is_selectable: false,
  },
  {
    bill_number: "BILL-2023-095",
    vendor_name: "Studio Design House",
    vendor_initial: "S",
    vendor_initial_class_name:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    bill_date: "Nov 14, 2023",
    due_date: "Dec 14, 2023",
    amount: "Rp 2.100.000",
    status: "Approved",
    is_selectable: true,
  },
];

const BILL_2023_089_DETAIL: VendorBillDetailModel = {
  overview: {
    bill_number: "BILL-2023-089",
    status: "Overdue",
    created_label: "Created on Oct 25, 2023 by System OCR",
    vendor: {
      name: "PT. Pemasok Jaya",
      address_lines: [
        "Jl. Industri Raya No. 45, Kawasan Industri Jababeka",
        "Bekasi, Jawa Barat 17530",
      ],
      email: "billing@pemasokjaya.co.id",
      avatar_initial: "P",
      avatar_tone_class_name:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    },
    meta: {
      bill_date: "Oct 25, 2023",
      due_date: "Nov 24, 2023",
      due_note: "15 days overdue",
      reference_number: "INV/PJ/2023/1029",
      currency: "IDR - Indonesian Rupiah",
    },
  },
  line_items: [
    {
      id: "line-1",
      item_description: "Raw Material - Grade A Silicon",
      detail: "Batch #8829-X, sourced from internal mining",
      qty: "500 kg",
      unit_price: "Rp 15.000",
      total: "Rp 7.500.000",
    },
    {
      id: "line-2",
      item_description: "Packaging Boxes (Large)",
      detail: "Double-walled corrugated cardboard",
      qty: "200 units",
      unit_price: "Rp 25.000",
      total: "Rp 5.000.000",
    },
  ],
  totals: {
    subtotal: "Rp 12.500.000",
    tax_amount: "Rp 1.375.000",
    total_amount: "Rp 13.875.000",
    paid_to_date: "- Rp 5.000.000",
    balance_due: "Rp 8.875.000",
  },
  payment_history: [
    {
      payment_date: "Nov 05, 2023",
      payment_reference: "PAY-002341",
      payment_method: "Bank Transfer (BCA)",
      amount_paid: "Rp 5.000.000",
      status: "SUCCESS",
    },
  ],
  internal_note:
    "The remaining balance of Rp 8.875.000 is scheduled for payment in the next batch (Friday, Dec 1st). Approval pending from Finance Head.",
};

export const DUMMY_VENDOR_BILL_DETAIL = BILL_2023_089_DETAIL;

export const DUMMY_VENDOR_BILL_DETAILS_BY_NUMBER: Record<string, VendorBillDetailModel> = {
  "BILL-2023-089": BILL_2023_089_DETAIL,
};

export const DUMMY_CREATE_VENDOR_BILL_DRAFT: CreateVendorBillDraft = {
  vendor_name: "",
  bill_number: "",
  status: "Draft",
  bill_date: "",
  due_date: "",
  line_items: [
    {
      id: "draft-line-1",
      product_or_service: "",
      description: "",
      qty: "1",
      price: "",
      tax_name: "VAT 11%",
      amount: "0.00",
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

export const DUMMY_BATCH_PAYMENT_BILLS: BatchPaymentBillItem[] = [
  {
    bill_number: "BILL-2023-089",
    vendor_name: "PT. Global Teknologi",
    vendor_id_label: "ID: VND-0012",
    reference: "INV/2023/11/001",
    due_state: "Due Today",
    due_state_tone: "warning",
    amount_due: "Rp 45.000.000",
    payment_amount: "Rp 45.000.000",
    is_selected: true,
  },
  {
    bill_number: "BILL-2023-092",
    vendor_name: "CV. Maju Mundur",
    vendor_id_label: "ID: VND-0045",
    reference: "INV/2023/11/056",
    due_state: "Nov 18, 2023",
    due_state_tone: "normal",
    amount_due: "Rp 12.500.000",
    payment_amount: "Rp 12.500.000",
    is_selected: true,
  },
  {
    bill_number: "BILL-2023-097",
    vendor_name: "PT. Sinar Jaya",
    vendor_id_label: "ID: VND-0088",
    reference: "INV/2023/10/992",
    due_state: "Overdue 15d",
    due_state_tone: "danger",
    amount_due: "Rp 8.200.000",
    payment_amount: "Rp 8.200.000",
    is_selected: true,
  },
  {
    bill_number: "BILL-2023-102",
    vendor_name: "Alpha Services Ltd.",
    vendor_id_label: "ID: VND-0003",
    reference: "INV/2023/11/112",
    due_state: "Nov 20, 2023",
    due_state_tone: "normal",
    amount_due: "Rp 150.000.000",
    payment_amount: "Rp 150.000.000",
    is_selected: true,
  },
];

export const DUMMY_BATCH_PAYMENT_DRAFT: BatchPaymentDraft = {
  pay_from: "BCA Corporate - 8821xxxx",
  payment_date: "2023-11-15",
  reference_number: "BATCH-092",
  total_bills_label: "Total Bills (4)",
  total_bills_amount: "Rp 215.700.000",
  credits_applied_amount: "- Rp 7.500.000",
  total_to_pay_amount: "Rp 208.200.000",
};

export const DUMMY_VENDOR_CREDIT_NOTES: VendorCreditNoteItem[] = [
  {
    credit_note_number: "CN-2023-001",
    vendor_name: "PT. Global Teknologi",
    amount: "Rp 5.0M",
    reason: "Refund barang rusak",
    issued_at: "Issued: 10 Nov 2023",
    is_selected: true,
  },
  {
    credit_note_number: "CN-2023-004",
    vendor_name: "Alpha Services Ltd.",
    amount: "Rp 2.5M",
    reason: "Overpayment adj.",
    issued_at: "Issued: 12 Nov 2023",
    is_selected: true,
  },
];

export const DUMMY_OCR_SESSION: OcrExtractionSession = {
  session_id: "OCR-882",
  file_name: "vendor_bill_scan_882.pdf",
  file_size_label: "2.4 MB",
  zoom_percent_label: "100%",
  accuracy_score: 88,
  general_info: {
    vendor_name: "Global Tech Solutions",
    bill_number: "INV-2023-882",
    vendor_confidence_label: "99%",
    bill_number_confidence_label: "65%",
    bill_date: "2023-10-25",
    due_date: "2023-11-24",
  },
  financials: {
    total_amount: "12,500,000",
  },
  line_items: [
    {
      id: "ocr-line-1",
      description: "Cloud Infrastructure Services (Monthly)",
      qty: "1",
      price: "8,500,000",
      highlight_price: false,
    },
    {
      id: "ocr-line-2",
      description: "Security Compliance Audit Fee",
      qty: "1",
      price: "4,000,000",
      highlight_price: true,
    },
  ],
};

export const DUMMY_PAYMENT_CONFIRMATION: PaymentConfirmationModel = {
  total_paid: "Rp 208.200.000",
  bill_count_label: "4 bills",
  bill_breakdowns: [
    {
      bill_number: "BILL-2023-089",
      vendor_name: "PT. Pemasok Jaya",
      amount: "Rp 12.500.000",
    },
    {
      bill_number: "BILL-2023-092",
      vendor_name: "CV. Makmur Abadi",
      amount: "Rp 8.250.000",
    },
    {
      bill_number: "BILL-2023-097",
      vendor_name: "Indo Trading Corp",
      amount: "Rp 142.450.000",
    },
    {
      bill_number: "BILL-2023-102",
      vendor_name: "Global Tech Solutions",
      amount: "Rp 45.000.000",
    },
  ],
  security_note: "Transaction secured with end-to-end encryption",
};
