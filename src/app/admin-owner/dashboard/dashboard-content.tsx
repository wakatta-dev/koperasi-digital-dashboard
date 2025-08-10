/** @format */

"use client";

import SummaryCard, {
  type DashboardSummary,
} from "@/components/feature/dashboard/summary-card";

export default function DashboardContent({
  summary,
}: {
  summary: DashboardSummary | null;
}) {
  return (
    <section>
      <SummaryCard summary={summary} />
    </section>
  );
}
