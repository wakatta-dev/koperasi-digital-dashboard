/** @format */

import type { Metadata } from "next";

import { InvoicingArIndexPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Invoicing Ar - Koperasi Digital",
  description: "Bumdes - Accounting - Invoicing Ar page.",
};

export default function AccountingInvoicingPage() {
  return <InvoicingArIndexPage />;
}
