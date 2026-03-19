/** @format */

import type { Metadata } from "next";

import { InvoicingArInvoiceDetailPage } from "@/modules/accounting";

type AccountingInvoicingDetailPageProps = {
  params: Promise<{
    invoiceNumber: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Invoicing Ar - Detail - Koperasi Digital",
  description: "Bumdes - Accounting - Invoicing Ar - Detail page.",
};

export default async function AccountingInvoicingDetailPage({
  params,
}: AccountingInvoicingDetailPageProps) {
  const { invoiceNumber } = await params;

  return <InvoicingArInvoiceDetailPage invoiceNumber={invoiceNumber} />;
}
