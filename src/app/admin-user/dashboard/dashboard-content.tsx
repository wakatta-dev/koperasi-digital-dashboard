/** @format */

"use client";

import type { ClientSummary } from "@/types/dashboard";

function formatCurrency(value: number) {
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

export default function DashboardContent({
  summary,
}: {
  summary: ClientSummary | null;
}) {
  const cards: { title: string; key: keyof ClientSummary }[] = [
    { title: "Anggota Aktif", key: "active_members" },
    { title: "Total Simpanan", key: "total_savings" },
    { title: "Pinjaman Aktif", key: "active_loans" },
    { title: "SHU Tahun Berjalan", key: "current_year_shu" },
  ];

  return (
    <section className="space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, key }) => {
          const data = summary?.[key];
          const amount = data?.amount ?? 0;
          const change = data?.change ?? 0;
          return (
            <div key={key} className="border rounded p-4">
              <h3 className="font-medium">{title}</h3>
              <p className="text-lg font-semibold">
                {formatCurrency(amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {change >= 0 ? "+" : ""}
                {change}%
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

