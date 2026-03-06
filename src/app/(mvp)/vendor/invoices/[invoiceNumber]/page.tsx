/** @format */

import { VendorInvoiceDetailPage } from "@/modules/vendor";

type VendorInvoiceDetailRouteProps = {
  params: Promise<{
    invoiceNumber: string;
  }>;
};

export default async function VendorInvoiceDetailRoute({
  params,
}: VendorInvoiceDetailRouteProps) {
  const { invoiceNumber } = await params;
  return <VendorInvoiceDetailPage invoiceNumber={invoiceNumber} />;
}
