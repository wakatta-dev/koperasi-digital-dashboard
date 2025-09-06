/** @format */

import { listTickets } from "@/services/api";
import { VendorTicketsList } from "@/components/feature/vendor/tickets/tickets-list";

export const dynamic = "force-dynamic";

// TODO integrate API: verify ticketing endpoints for list/update/reply
export default async function TicketsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = (await searchParams) ?? undefined;
  const status = typeof sp?.status === 'string' ? sp.status : undefined;
  const res = await listTickets({ limit: 10, ...(status ? { status } : {}) }).catch(() => null);
  const initial = res?.data ?? undefined;
  return (
    <div className="space-y-6">
      <VendorTicketsList initialData={initial} limit={10} />
    </div>
  );
}
