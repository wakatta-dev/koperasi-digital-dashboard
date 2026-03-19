/** @format */

import type { Metadata } from "next";

import { InvoicingArCreateInvoicePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Invoicing Ar - Create - Koperasi Digital",
  description: "Bumdes - Accounting - Invoicing Ar - Create page.",
};

export default function AccountingInvoicingCreatePage() {
  return <InvoicingArCreateInvoicePage />;
}
