/** @format */

"use client";

import SummaryCard, {
  type DashboardSummary,
} from "@/components/feature/dashboard/summary-card";
import MultipleBarChart, {
  type RevenueExpenseData,
} from "@/components/shared/multiple-bar-chart";
import { useState } from "react";

export default function DashboardContent({
  summary,
  chartData,
}: {
  summary: DashboardSummary | null;
  chartData: RevenueExpenseData[];
}) {
  const [period, setPeriod] = useState(6);
  const filtered = Array.isArray(chartData)
    ? chartData.slice(-period)
    : [];

  return (
    <section className="space-y-4">
      <SummaryCard summary={summary} />
      <div className="flex justify-end">
        <select
          className="border rounded p-1 text-sm"
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
        >
          <option value={6}>6 Bulan Terakhir</option>
          <option value={12}>12 Bulan Terakhir</option>
        </select>
      </div>
      <MultipleBarChart data={filtered} />
    </section>
  );
}
