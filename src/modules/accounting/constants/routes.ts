/** @format */

export const INVOICING_AR_ROUTES = {
  index: "/bumdes/accounting/invoicing-ar",
  createInvoice: "/bumdes/accounting/invoicing-ar/create",
  invoiceDetail: (invoiceNumber: string) =>
    `/bumdes/accounting/invoicing-ar/${encodeURIComponent(invoiceNumber)}`,
  creditNotesPayments: "/bumdes/accounting/invoicing-ar/credit-notes-payments",
  createCreditNote:
    "/bumdes/accounting/invoicing-ar/credit-notes-payments/credit-notes/create",
  createPayment:
    "/bumdes/accounting/invoicing-ar/credit-notes-payments/payments/create",
} as const;
