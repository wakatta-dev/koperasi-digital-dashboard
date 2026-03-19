/** @format */

import type { Metadata } from "next";

import { InvoicingArCreditNotesPaymentsPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Invoicing Ar - Credit Notes Payments - Koperasi Digital",
  description: "Bumdes - Accounting - Invoicing Ar - Credit Notes Payments page.",
};

export default function AccountingInvoicingCreditNotesPaymentsPage() {
  return <InvoicingArCreditNotesPaymentsPage />;
}
