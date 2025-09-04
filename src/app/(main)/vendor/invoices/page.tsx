/** @format */

import { listInvoicesAction } from "@/actions/billing";
import { VendorInvoicesList } from "@/components/feature/vendor/invoices/invoices-list";
import { WebhookSimulator } from "@/components/feature/vendor/payments/webhook-simulator";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await listInvoicesAction("vendor");
  return (
    <div className="space-y-6">
      <VendorInvoicesList initialData={invoices ?? []} />
      <WebhookSimulator />
    </div>
  );
}
