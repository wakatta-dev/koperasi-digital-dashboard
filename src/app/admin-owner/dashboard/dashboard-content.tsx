/** @format */

"use client";

import type { OwnerSummary } from "@/types/dashboard";

export default function DashboardContent({
  summary,
}: {
  summary: OwnerSummary | null;
}) {
  if (!summary) {
    return <div className="p-4">Data tidak tersedia</div>;
  }

  const {
    clients_per_tier = {},
    open_tickets = 0,
    most_active_client = "",
    top_ticket_product = { name: "", tickets: 0 },
    invoice_status = { lunas: 0, belum_lunas: 0 },
    active_notifications = 0,
  } = summary;

  return (
    <section className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Ringkasan</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Clients per Tier</h3>
          <ul className="list-disc list-inside">
            {Object.entries(clients_per_tier).map(([tier, count]) => (
              <li key={tier}>
                {tier}: {count}
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Open Tickets</h3>
          <p>{open_tickets}</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Most Active Client</h3>
          <p>{most_active_client || "-"}</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Top Ticket Product</h3>
          <p>
            {top_ticket_product.name || "-"} ({top_ticket_product.tickets || 0})
          </p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Invoice Status</h3>
          <ul className="list-disc list-inside">
            <li>Lunas: {invoice_status.lunas || 0}</li>
            <li>Belum Lunas: {invoice_status.belum_lunas || 0}</li>
          </ul>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Active Notifications</h3>
          <p>{active_notifications}</p>
        </div>
      </div>
    </section>
  );
}

