/** @format */

import type { CreditNoteStatus, InvoiceStatus, PaymentStatus } from "../types/invoicing-ar";
import type {
  VendorBillStatus,
  VendorBillSummaryMetricTone,
} from "../types/vendor-bills-ap";

export const STITCH_PRIMARY_ACCENT_CLASS = "bg-indigo-600 text-white hover:bg-indigo-700";

export const INVOICE_STATUS_BADGE_CLASS: Record<InvoiceStatus, string> = {
  Draft:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  Sent:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Paid:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Overdue:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const CREDIT_NOTE_STATUS_BADGE_CLASS: Record<CreditNoteStatus, string> = {
  Open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Used: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Refunded: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export const PAYMENT_STATUS_BADGE_CLASS: Record<PaymentStatus, string> = {
  Cleared: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export const VENDOR_BILL_STATUS_BADGE_CLASS: Record<VendorBillStatus, string> = {
  Draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  Approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const VENDOR_BILL_SUMMARY_TONE_CLASS: Record<
  VendorBillSummaryMetricTone,
  {
    icon_wrapper: string;
    icon_color: string;
    helper_text: string;
    card_accent?: string;
  }
> = {
  primary: {
    icon_wrapper: "bg-indigo-50 dark:bg-indigo-900/30",
    icon_color: "text-indigo-600 dark:text-indigo-400",
    helper_text: "text-gray-500 dark:text-gray-400",
  },
  warning: {
    icon_wrapper: "bg-orange-50 dark:bg-orange-900/30",
    icon_color: "text-orange-600 dark:text-orange-400",
    helper_text: "text-orange-500",
  },
  danger: {
    icon_wrapper: "bg-red-50 dark:bg-red-900/30",
    icon_color: "text-red-600 dark:text-red-400",
    helper_text: "text-red-500",
    card_accent: "border-l-4 border-l-red-500 dark:border-l-red-500",
  },
  success: {
    icon_wrapper: "bg-green-50 dark:bg-green-900/30",
    icon_color: "text-green-600 dark:text-green-400",
    helper_text: "text-green-600",
  },
};
