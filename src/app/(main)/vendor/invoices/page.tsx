/** @format */

import { listVendorInvoicesPage } from "@/actions/billing";
import type { Invoice } from "@/types/api";
import { VendorInvoicesList } from "@/components/feature/vendor/invoices/invoices-list";

export const dynamic = "force-dynamic";

// TODO integrate API: verify invoice listing and actions endpoints
export default async function InvoicesPage() {
  const { data, meta } = await listVendorInvoicesPage({ limit: 10 });
  const invoices = (data ?? []) as Invoice[];
  const initialCursor = meta?.pagination?.next_cursor;
  return (
    <div className="space-y-6">
      <VendorInvoicesList
        initialData={invoices ?? []}
        initialCursor={initialCursor}
      />
    </div>
  );
}
