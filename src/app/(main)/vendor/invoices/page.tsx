/** @format */

import { listVendorInvoices } from "@/services/api";
import { VendorInvoicesList } from "@/components/feature/vendor/invoices/invoices-list";
import { WebhookSimulator } from "@/components/feature/vendor/payments/webhook-simulator";

export const dynamic = "force-dynamic";

// TODO integrate API: verify invoice listing and actions endpoints
export default async function InvoicesPage() {
  const res = await listVendorInvoices({ limit: 10 }).catch(() => null);
  const invoices = res?.data ?? [];
  const initialCursor = (res?.meta?.pagination as any)?.next_cursor as
    | string
    | undefined;
  return (
    <div className="space-y-6">
      <VendorInvoicesList
        initialData={invoices ?? []}
        initialCursor={initialCursor}
      />
      <WebhookSimulator />
    </div>
  );
}

