/** @format */

"use client";

import { useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DateRangeControls } from "@/modules/finance/penjualan-rinci/components/DateRangeControls";
import { useDateRange } from "@/modules/finance/penjualan-rinci/hooks/useDateRange";
import { KpiSection } from "@/modules/finance/penjualan-rinci/containers/KpiSection";
import type { FinancePreset } from "@/modules/finance/penjualan-rinci/types";

const products = [
  { name: "Produk A", units: 532, revenue: 159_600_000, pct: 35 },
  { name: "Produk B", units: 421, revenue: 126_300_000, pct: 28 },
  { name: "Produk C", units: 289, revenue: 86_700_000, pct: 19 },
  { name: "Produk D", units: 186, revenue: 55_800_000, pct: 12 },
  { name: "Produk E", units: 92, revenue: 27_600_000, pct: 6 },
];

const channels = [
  {
    id: "pos",
    name: "Kasir (POS)",
    revenue: 319_752_300,
    share: 70,
    transactions: 876,
    avg: 365_014,
    color: "bg-blue-500",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    revenue: 137_036_700,
    share: 30,
    transactions: 358,
    avg: 382_784,
    color: "bg-emerald-500",
  },
];

export default function PenjualanRinciReportPage() {
  const { value, setPreset, setCustomRange } = useDateRange("month");
  const params = useMemo(
    () => ({
      preset: value.preset,
      start: value.start,
      end: value.end,
    }),
    [value.end, value.preset, value.start]
  );

  const handlePresetChange = (preset: FinancePreset) => {
    setPreset(preset);
    console.info("telemetry:finance_range_change", { preset, start: value.start, end: value.end });
  };

  const handleCustomApply = (start: string, end: string) => {
    setCustomRange(start, end);
    console.info("telemetry:finance_range_change", { preset: "custom", start, end });
  };

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
              <BreadcrumbLink href="/bumdes/report">Laporan Keuangan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Penjualan Rinci</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">Laporan penjualan rinci</div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Filter Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeControls
            value={{ ...value, label: value.label }}
            onPresetChange={handlePresetChange}
            onCustomApply={handleCustomApply}
          />
        </CardContent>
      </Card>

      <KpiSection params={params} rangeLabel={value.label} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold">Produk Terlaris</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Ekspor CSV
                </Button>
                <Button size="sm">Ekspor Excel</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Nama Produk</th>
                    <th className="px-4 py-3 text-right font-semibold">Jumlah Terjual</th>
                    <th className="px-4 py-3 text-right font-semibold">Total Pendapatan</th>
                    <th className="px-4 py-3 text-right font-semibold">% Kontribusi</th>
                    <th className="px-4 py-3 text-left font-semibold">Visualisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p.name} className="bg-background">
                      <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{p.units} unit</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        Rp {p.revenue.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{p.pct}%</td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${p.pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold">Penjualan per Channel</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Ekspor CSV
                </Button>
                <Button size="sm">Ekspor Excel</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${ch.color}`} />
                      <span className="font-medium text-foreground">{ch.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold text-foreground">Rp {ch.revenue.toLocaleString("id-ID")}</div>
                      <div className="text-muted-foreground text-xs">{ch.share}%</div>
                    </div>
                  </div>
                  <Progress value={ch.share} className="h-2" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Channel</th>
                    <th className="px-4 py-3 text-right font-semibold">Pendapatan</th>
                    <th className="px-4 py-3 text-right font-semibold">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {channels.map((ch) => (
                    <tr key={ch.id}>
                      <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${ch.color}`} />
                        {ch.name}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground font-semibold">
                        Rp {ch.revenue.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground font-semibold">{ch.share}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground mb-2">Jumlah Transaksi</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Kasir (POS)</span>
                  <span className="text-sm font-bold text-foreground">{channels[0].transactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Marketplace</span>
                  <span className="text-sm font-bold text-foreground">{channels[1].transactions}</span>
                </div>
              </div>
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground mb-2">Rata-rata Transaksi</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Kasir (POS)</span>
                  <span className="text-sm font-bold text-foreground">Rp {channels[0].avg.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Marketplace</span>
                  <span className="text-sm font-bold text-foreground">Rp {channels[1].avg.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
