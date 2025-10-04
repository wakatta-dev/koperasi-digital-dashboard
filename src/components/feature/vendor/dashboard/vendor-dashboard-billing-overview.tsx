/** @format */

"use client";

import { Pie, PieChart, Cell } from "recharts";

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
import { useVendorBillingReport } from "./vendor-dashboard-hooks";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const chartConfig = {
  paid: {
    label: "Dibayar",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Belum Dibayar",
    color: "hsl(var(--chart-2))",
  },
  overdue: {
    label: "Terlambat",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function VendorDashboardBillingOverview() {
  const { data, error, isLoading, isValidating, mutate } = useVendorBillingReport();

  const loading = isLoading && !data;

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Ikhtisar Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-3">
              <span>
                Tidak dapat memuat ringkasan billing saat ini. Silakan coba lagi.
              </span>
              <Button size="sm" variant="outline" onClick={() => mutate()}>
                Muat ulang
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue =
    (data?.revenue?.subscription ?? 0) + (data?.revenue?.outstanding ?? 0);
  const totalInvoices = data?.total_invoices ?? 0;
  const chartData = (
    [
      {
        name: chartConfig.paid.label,
        value: data?.status_detail?.paid ?? 0,
        key: "paid" as const,
      },
      {
        name: chartConfig.pending.label,
        value: data?.status_detail?.pending ?? 0,
        key: "pending" as const,
      },
      {
        name: chartConfig.overdue.label,
        value: data?.status_detail?.overdue ?? 0,
        key: "overdue" as const,
      },
    ]
  ).filter((item) => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Ikhtisar Billing</CardTitle>
          {isValidating ? (
            <span className="text-xs text-muted-foreground">Memuat...</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="space-y-3">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-10 w-48" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <Skeleton className="aspect-square w-full max-w-[280px] justify-self-center rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pendapatan Bulan Ini
                </p>
                <p className="text-3xl font-semibold">
                  {currencyFormatter.format(totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Termasuk tagihan berlangganan dan outstanding dalam rentang filter.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Tagihan Aktif</p>
                  <p className="text-lg font-semibold">{totalInvoices}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Pendapatan Tertagih</p>
                  <p className="text-lg font-semibold">
                    {currencyFormatter.format(data?.revenue?.subscription ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="text-lg font-semibold">
                    {currencyFormatter.format(data?.revenue?.outstanding ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Invoice Terlambat</p>
                  <p className="text-lg font-semibold">
                    {data?.status_detail?.overdue ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {chartData.length ? (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto h-[240px] w-full max-w-[320px]"
                >
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={`var(--color-${entry.key})`}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [String(value), name]}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[240px] w-full flex-col items-center justify-center gap-2 rounded-lg border text-sm text-muted-foreground">
                  <span>Tidak ada data status invoice pada rentang ini.</span>
                </div>
              )}
              <Button size="sm" variant="outline" onClick={() => mutate()}>
                Segarkan Data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

