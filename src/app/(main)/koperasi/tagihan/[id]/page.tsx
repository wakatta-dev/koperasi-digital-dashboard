/** @format */

import { getClientInvoiceAction, listClientInvoiceAuditsAction } from "@/actions/billing";
import { ClientInvoiceDetail } from "@/components/feature/client/invoices/client-invoice-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getClientInvoiceAction(id).catch(() => null);
  const audits = await listClientInvoiceAuditsAction(id, { limit: 50 }).catch(() => []);
  return (
    <ClientInvoiceDetail id={id} initialInvoice={invoice ?? undefined} initialAudits={audits ?? []} />
  );
}

