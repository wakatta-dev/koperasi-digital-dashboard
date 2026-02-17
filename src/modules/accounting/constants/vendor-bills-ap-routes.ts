/** @format */

export const VENDOR_BILLS_AP_ROUTES = {
  index: "/bumdes/accounting/vendor-bills-ap",
  detail: (billNumber: string) =>
    `/bumdes/accounting/vendor-bills-ap/${encodeURIComponent(billNumber)}`,
  batchPayment: "/bumdes/accounting/vendor-bills-ap/batch-payment",
  ocrReview: "/bumdes/accounting/vendor-bills-ap/ocr-review",
  paymentConfirmation: "/bumdes/accounting/vendor-bills-ap/payment-confirmation",
} as const;
