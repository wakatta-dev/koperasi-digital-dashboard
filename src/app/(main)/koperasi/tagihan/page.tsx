/** @format */

import { listInvoicesAction } from "@/actions/billing";
import { ClientInvoicesList } from "@/components/feature/client/invoices/client-invoices-list";

export const dynamic = "force-dynamic";

export default async function KoperasiTagihanPage() {
  const invoices = await listInvoicesAction("client");
  return <ClientInvoicesList initialData={invoices ?? []} />;
}
