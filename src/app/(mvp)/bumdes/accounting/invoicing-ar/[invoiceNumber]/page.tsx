/** @format */

import { InvoicingArInvoiceDetailPage } from "@/modules/accounting";

type AccountingInvoicingDetailPageProps = {
  params: Promise<{
    invoiceNumber: string;
  }>;
};

export default async function AccountingInvoicingDetailPage({
  params,
}: AccountingInvoicingDetailPageProps) {
  const { invoiceNumber } = await params;

  return <InvoicingArInvoiceDetailPage invoiceNumber={invoiceNumber} />;
}
