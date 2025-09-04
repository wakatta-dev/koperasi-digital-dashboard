/** @format */

import { listTickets } from "@/services/api";
import { VendorTicketsList } from "@/components/feature/vendor/tickets/tickets-list";
import { TicketSlaConfig } from "@/components/feature/vendor/tickets/sla-config";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const res = await listTickets({ limit: 10 }).catch(() => null);
  const initial = res?.data ?? undefined;
  return (
    <div className="space-y-6">
      <VendorTicketsList initialData={initial} limit={10} />
      <TicketSlaConfig />
    </div>
  );
}
