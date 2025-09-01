/** @format */

import { getTicket } from "@/services/api";
import { VendorTicketDetail } from "@/components/feature/vendor/tickets/ticket-detail";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getTicket(id).catch(() => null);
  const ticket = res?.data;

  return (
    <div className="space-y-4 p-2">
      <Link href="/vendor/tickets" className="text-sm text-muted-foreground">← Back</Link>
      <VendorTicketDetail id={id} initialTicket={ticket ?? undefined} />
    </div>
  );
}

