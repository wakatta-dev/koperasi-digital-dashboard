/** @format */

import type {
  CreditNoteStatus,
  InvoiceStatus,
  PaymentStatus,
} from "../types/invoicing-ar";

const currencyFormatter = new Intl.NumberFormat("id-ID");

export function formatAccountingArCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Rp 0";
  }

  if (typeof value === "string") {
    if (value.trim().startsWith("Rp")) {
      return value;
    }
    const numeric = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isNaN(numeric)) {
      return value;
    }
    return `Rp ${currencyFormatter.format(numeric)}`;
  }

  return `Rp ${currencyFormatter.format(value)}`;
}

export function formatAccountingArDate(value: string): string {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function normalizeInvoiceStatus(value: string): InvoiceStatus {
  switch (value.trim().toLowerCase()) {
    case "draft":
      return "Draft";
    case "sent":
      return "Sent";
    case "paid":
      return "Paid";
    case "overdue":
      return "Overdue";
    default:
      return "Draft";
  }
}

export function normalizeCreditNoteStatus(value: string): CreditNoteStatus {
  switch (value.trim().toLowerCase()) {
    case "open":
      return "Open";
    case "used":
      return "Used";
    case "refunded":
      return "Refunded";
    default:
      return "Open";
  }
}

export function normalizePaymentStatus(value: string): PaymentStatus {
  switch (value.trim().toLowerCase()) {
    case "pending":
      return "Pending";
    case "cleared":
      return "Cleared";
    default:
      return "Pending";
  }
}
