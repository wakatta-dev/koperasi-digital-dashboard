/** @format */

"use client";

import SummaryCard, {
  type DashboardSummary,
} from "@/components/feature/dashboard/summary-card";
import { BarChartCard } from "@/components/shared/multiple-bar-chart";
import { RevenueExpenseData } from "@/types/dashboard";

import { useState } from "react";

const chartSeries = [
  { dataKey: "revenue", label: "Revenue" },
  { dataKey: "expense", label: "Expense" },
];

export default function DashboardContent({
  summary,
  chartData = [],
}: {
  summary: DashboardSummary | null;
  chartData?: RevenueExpenseData[];
}) {
  const [period, setPeriod] = useState(6);

  return (
    <section className="space-y-4">
      <SummaryCard summary={summary} />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="px-4 space-y-2 flex-1">
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
          <BarChartCard
            title="Pendapatan vs Pengeluaran"
            description="January - June 2024"
            data={chartData}
            xKey="month"
            xTickFormatter={(v) => String(v).slice(0, 3)}
            series={chartSeries}
            tooltipIndicator="dashed"
            footer={{
              primary: <>Trending up by 5.2% this month</>,
              secondary: "Showing total visitors for the last 6 months",
              showTrendingIcon: true,
            }}
          />
        </div>

        <div className="px-4 space-y-2 flex-1">
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
          <BarChartCard
            title="Bar Chart - Multiple"
            description="January - June 2024"
            data={chartData}
            xKey="month"
            xTickFormatter={(v) => String(v).slice(0, 3)}
            series={chartSeries}
            tooltipIndicator="dashed"
            footer={{
              primary: <>Trending up by 5.2% this month</>,
              secondary: "Showing total visitors for the last 6 months",
              showTrendingIcon: true,
            }}
          />
        </div>
      </div>
    </section>
  );
}
