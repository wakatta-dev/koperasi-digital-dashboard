/** @format */

import type { Metadata } from "next";

import { InvoicingArPaymentCreatePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Invoicing Ar - Credit Notes Payments - Payments - Create - Koperasi Digital",
  description: "Bumdes - Accounting - Invoicing Ar - Credit Notes Payments - Payments - Create page.",
};

export default function AccountingInvoicingPaymentCreatePage() {
  return <InvoicingArPaymentCreatePage />;
}
