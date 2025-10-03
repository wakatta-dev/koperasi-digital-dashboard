/** @format */

import { listVendorTicketsPage } from "@/actions/tickets";
import { VendorTicketsList } from "@/components/feature/vendor/tickets/tickets-list";
import type { Ticket } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: verify ticketing endpoints for list/update/reply
export default async function TicketsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = (await searchParams) ?? undefined;
  const status = typeof sp?.status === 'string' ? sp.status : undefined;
  const { data } = await listVendorTicketsPage({ limit: 10, ...(status ? { status } : {}) });
  const initial = (data ?? []) as Ticket[] | undefined;
  return (
    <div className="space-y-6">
      <VendorTicketsList initialData={initial} limit={10} />
    </div>
  );
}
