/** @format */

"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OverviewPoint } from "@/types/api";
import { ChartContainer, ChartLegendContent, ChartTooltipContent, createBarLineChartConfig } from "@/components/ui/chart";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/feedback/async-states";

type Props = {
  series?: OverviewPoint[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

const config = createBarLineChartConfig({
  barKey: "revenue",
  barLabel: "Pendapatan",
  lineKey: "transactions",
  lineLabel: "Transaksi",
});

export function OverviewChart({ series, isLoading, isError, onRetry }: Props) {
  if (isLoading) return <LoadingState lines={6} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!series?.length)
    return (
      <EmptyState
        description="Tambahkan transaksi atau ubah rentang tanggal untuk melihat data."
        onRetry={onRetry}
      />
    );

  const chartData = series.map((point) => ({
    name: point.period,
    revenue: point.metric === "revenue" ? point.value : null,
    transactions: point.metric === "transactions" ? point.value : null,
  }));

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">Overview</h3>
        <p className="text-xs text-muted-foreground">Pendapatan & transaksi per periode.</p>
      </div>
    <ChartContainer config={config} className="w-full rounded-lg border border-border/60 bg-card p-2">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span className="font-medium text-foreground">
                    {typeof value === "number" ? value.toLocaleString() : "-"}
                    <span className="ml-1 text-muted-foreground">{name}</span>
                  </span>
                )}
              />
            }
          />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="var(--color-transactions)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
    </div>
  );
}
