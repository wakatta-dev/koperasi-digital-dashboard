/** @format */

import type { Metadata } from "next";

import { VendorInvoiceDetailPage } from "@/modules/vendor";

type VendorInvoiceDetailRouteProps = {
  params: Promise<{
    invoiceNumber: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Invoices - Detail - Koperasi Digital",
  description: "Vendor - Invoices - Detail page.",
};

export default async function VendorInvoiceDetailRoute({
  params,
}: VendorInvoiceDetailRouteProps) {
  const { invoiceNumber } = await params;
  return <VendorInvoiceDetailPage invoiceNumber={invoiceNumber} />;
}
