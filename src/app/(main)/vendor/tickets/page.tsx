/** @format */

import { listTickets } from "@/services/api";
import { VendorTicketsList } from "@/components/feature/vendor/tickets/tickets-list";

export const dynamic = "force-dynamic";

// TODO integrate API: verify ticketing endpoints for list/update/reply
export default async function TicketsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const status = typeof searchParams?.status === 'string' ? searchParams?.status : undefined;
  const res = await listTickets({ limit: 10, ...(status ? { status } : {}) }).catch(() => null);
  const initial = res?.data ?? undefined;
  return (
    <div className="space-y-6">
      <VendorTicketsList initialData={initial} limit={10} />
    </div>
  );
}
