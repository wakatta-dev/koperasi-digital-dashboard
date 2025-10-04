/** @format */

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { ensureSuccess } from "@/lib/api";
import { getVendorFinancialReport } from "@/services/api";
import type { VendorFinancialReport } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVendorDashboardDateParams } from "./vendor-dashboard-hooks";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const chartConfig = {
  mrr: {
    label: "MRR",
    color: "hsl(var(--chart-1))",
  },
  arr: {
    label: "ARR",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const groupByOptions = [
  { label: "Bulanan", value: "month" },
  { label: "Kuartal", value: "quarter" },
];

export function VendorDashboardRecurringRevenue() {
  const { start, end } = useVendorDashboardDateParams();
  const [groupBy, setGroupBy] = useState<string>("month");

  const queryParams = useMemo(
    () => ({ start, end, groupBy }),
    [end, groupBy, start],
  );

  const { data, error, isLoading, isFetching, refetch } = useQuery<VendorFinancialReport>({
    queryKey: ["vendor-dashboard", "financial-report", queryParams],
    queryFn: async () =>
      ensureSuccess(
        await getVendorFinancialReport({
          start_date: start,
          end_date: end,
          group_by: groupBy,
        }),
      ),
    keepPreviousData: true,
  });

  const loading = isLoading && !data;

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>MRR & ARR</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-3">
              <span>Grafik pendapatan berulang tidak dapat dimuat.</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const series = data?.series ?? [];
  const totals = data?.totals ?? { mrr: 0, arr: 0 };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>MRR & ARR</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tren pendapatan berulang berdasarkan rentang tanggal terpilih.
          </p>
        </div>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Kelompokkan" />
          </SelectTrigger>
          <SelectContent>
            {groupByOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isFetching && !isLoading ? (
          <p className="text-xs text-muted-foreground">Memperbarui data…</p>
        ) : null}

        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : series.length ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Total MRR</p>
                <p className="text-lg font-semibold">
                  {currencyFormatter.format(totals.mrr ?? 0)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Total ARR</p>
                <p className="text-lg font-semibold">
                  {currencyFormatter.format(totals.arr ?? 0)}
                </p>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <AreaChart data={series} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => currencyFormatter.format(value).replace(/,00$/, "")}
                  width={90}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        currencyFormatter.format(Number(value)),
                        name,
                      ]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--color-mrr)"
                  fill="var(--color-mrr)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="arr"
                  stroke="var(--color-arr)"
                  fill="var(--color-arr)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </>
        ) : (
          <div className="flex h-[260px] w-full flex-col items-center justify-center gap-2 rounded-lg border text-sm text-muted-foreground">
            Tidak ada data pendapatan berulang untuk rentang ini.
          </div>
        )}

        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Segarkan Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

