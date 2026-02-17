/** @format */

import type { CreditNoteStatus, InvoiceStatus, PaymentStatus } from "../types/invoicing-ar";

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
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Cancelled:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export const PAYMENT_STATUS_BADGE_CLASS: Record<PaymentStatus, string> = {
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};
