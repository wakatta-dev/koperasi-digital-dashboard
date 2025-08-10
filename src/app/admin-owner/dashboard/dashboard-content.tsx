/** @format */

"use client";

import NotificationCard from "@/components/feature/dashboard/notification-card";
import SummaryCard from "@/components/feature/dashboard/summary-card";
import type { NotificationItem, OwnerSummary } from "@/types/dashboard";

export default function DashboardContent({
  summary,
  notifications = [],
}: {
  summary: OwnerSummary | null;
  notifications?: NotificationItem[];
}) {
  if (!summary) {
    return <div className="p-4">Data tidak tersedia</div>;
  }

  const result = Object.entries(summary).map(([key, { current, prev }]) => {
    const change =
      prev === 0 ? 0 : Number((((current - prev) / prev) * 100).toFixed(2));
    return {
      key,
      value: current,
      change,
    };
  });

  return (
    <section className="space-y-4 px-4">
      <SummaryCard data={result} />
      <NotificationCard data={notifications} />
    </section>
  );
}
