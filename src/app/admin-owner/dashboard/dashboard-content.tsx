/** @format */

"use client";

import SummaryCard from "@/components/feature/dashboard/summary-card";
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
    // open_tickets = 0,
    // most_active_client = "",
    // top_ticket_product = { name: "", tickets: 0 },
    // invoice_status = { lunas: 0, belum_lunas: 0 },
    // active_notifications = 0,
  } = summary;

  const result = Object.entries(clients_per_tier).map(
    ([key, { current, prev }]) => {
      const change =
        prev === 0 ? 0 : Number((((current - prev) / prev) * 100).toFixed(2));
      return {
        key,
        value: current,
        change,
      };
    }
  );

  return (
    <section className="space-y-4 p-4">
      <SummaryCard data={result} />
    </section>
  );
}
