/** @format */

import { listInvoicesAction } from "@/actions/billing";
import { VendorInvoicesList } from "@/components/feature/vendor/invoices/invoices-list";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await listInvoicesAction("vendor");
  return <VendorInvoicesList initialData={invoices ?? []} />;
}
