/** @format */

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface RevenueExpenseData {
  month: string;
  revenue: number;
  expense: number;
}

export default function MultipleBarChart({
  data,
}: {
  data: RevenueExpenseData[];
}) {
  const chartConfig = {
    revenue: {
      label: "Pendapatan",
      color: "hsl(var(--chart-1))",
    },
    expense: {
      label: "Pengeluaran",
      color: "hsl(var(--chart-2))",
    },
  } as const;

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

