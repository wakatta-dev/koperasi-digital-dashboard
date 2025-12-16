/** @format */

"use client";

import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DateRangeControls } from "@/modules/finance/penjualan-rinci/components/DateRangeControls";
import { useDateRange } from "@/modules/finance/penjualan-rinci/hooks/useDateRange";
import { cn } from "@/lib/utils";

const kpis = [
  {
    title: "Total Pendapatan",
    value: "Rp 456.789.000",
    delta: "+12,5% dari bulan lalu",
    positive: true,
  },
  {
    title: "Laba Kotor",
    value: "Rp 218.450.000",
    delta: "+8,3% dari bulan lalu",
    positive: true,
  },
  {
    title: "Margin Kotor",
    value: "47,8%",
    delta: "+3,2% dari bulan lalu",
    positive: true,
  },
  {
    title: "Total Biaya",
    value: "Rp 98.500.000",
    delta: "-2,1% dari bulan lalu",
    positive: false,
  },
];

const revenueBreakdown = [
  { label: "Produk A", value: 159_600_000, pct: 35 },
  { label: "Produk B", value: 126_300_000, pct: 28 },
  { label: "Produk C", value: 86_700_000, pct: 19 },
  { label: "Produk D", value: 55_800_000, pct: 12 },
  { label: "Produk E", value: 27_600_000, pct: 6 },
];

const channelBreakdown = [
  { label: "Kasir (POS)", value: 319_752_300, pct: 70, color: "bg-blue-500" },
  {
    label: "Marketplace",
    value: 137_036_700,
    pct: 30,
    color: "bg-emerald-500",
  },
];

export default function RingkasanReportPage() {
  const { value, setPreset, setCustomRange } = useDateRange("month");
  const params = useMemo(
    () => ({
      preset: value.preset,
      start: value.start,
      end: value.end,
    }),
    [value.end, value.preset, value.start]
  );

  return (
    <div className="flex flex-col gap-6 bg-background p-4 sm:p-6 rounded-xl border border-border/60 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="/bumdes/dashboard">BUMDes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/bumdes/report">
                Laporan Keuangan
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ringkasan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">
          Periode: {value.label ?? "Pilih rentang"} ({params.start} -{" "}
          {params.end})
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DateRangeControls
            value={{ ...value, label: value.label }}
            onPresetChange={setPreset}
            onCustomApply={setCustomRange}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Terapkan</Button>
            <Button size="sm" variant="outline">
              Ekspor PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-foreground">
                {kpi.value}
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full inline-flex",
                  kpi.positive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                )}
              >
                {kpi.delta}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Pendapatan per Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueBreakdown.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {row.label}
                  </span>
                  <span className="font-semibold text-foreground">
                    Rp {row.value.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-foreground font-medium">
                    {row.pct}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Pendapatan per Channel
            </CardTitle>
            <Button size="sm" variant="outline">
              Ekspor
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {channelBreakdown.map((ch) => (
                <div
                  key={ch.label}
                  className="rounded-lg border border-border/60 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {ch.label}
                    </span>
                    <span className="text-foreground font-semibold">
                      {ch.pct}%
                    </span>
                  </div>
                  <div
                    className={cn("h-2 rounded-full bg-muted", ch.color)}
                    style={{ width: `${ch.pct}%` }}
                  />
                  <div className="text-xs text-muted-foreground">
                    Rp {ch.value.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
                <span>Arus Kas</span>
                <span>Rp 182.450.000</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                Kas meningkat +6,2% dari bulan lalu.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
