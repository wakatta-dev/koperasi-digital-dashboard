/** @format */

"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { KoperasiTrendPoint } from "@/types/api";

export function TrendChart({ data }: { data: KoperasiTrendPoint[] }) {
  const config = {
    savings: { label: "Simpanan", color: "hsl(var(--chart-1))" },
    loans: { label: "Pinjaman", color: "hsl(var(--chart-2))" },
  } as const;

  return (
    <ChartContainer config={config} className="w-full">
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="savings" stroke="var(--color-savings)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="loans" stroke="var(--color-loans)" dot={false} strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}
