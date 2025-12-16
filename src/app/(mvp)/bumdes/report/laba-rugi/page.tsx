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
import { DateRangeControls } from "@/modules/finance/penjualan-rinci/components/DateRangeControls";
import { useDateRange } from "@/modules/finance/penjualan-rinci/hooks/useDateRange";
import { cn } from "@/lib/utils";

const summary = [
  { title: "Pendapatan", value: "Rp 456.789.000", delta: "+12,5%", positive: true },
  { title: "HPP", value: "Rp 238.339.000", delta: "-3,1%", positive: true },
  { title: "Laba Kotor", value: "Rp 218.450.000", delta: "+8,3%", positive: true },
  { title: "Laba Bersih", value: "Rp 118.450.000", delta: "+6,7%", positive: true },
];

const labaRugiRows = [
  { label: "Pendapatan", value: 456_789_000, level: 0, highlight: true },
  { label: "Beban Pokok Penjualan (HPP)", value: -238_339_000, level: 0 },
  { label: "Laba Kotor", value: 218_450_000, level: 0, highlight: true },
  { label: "Beban Operasional", value: -82_300_000, level: 0 },
  { label: "Beban Pemasaran", value: -9_750_000, level: 1 },
  { label: "Beban Administrasi", value: -12_500_000, level: 1 },
  { label: "Gaji & Tunjangan", value: -45_000_000, level: 1 },
  { label: "Lain-lain", value: -15_050_000, level: 1 },
  { label: "Laba Operasional", value: 136_150_000, level: 0, highlight: true },
  { label: "Pendapatan/Beban Lain", value: -17_700_000, level: 0 },
  { label: "Laba Bersih", value: 118_450_000, level: 0, highlight: true },
];

export default function LabaRugiReportPage() {
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
              <BreadcrumbLink href="/bumdes/report">Laporan Keuangan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laba/Rugi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">
          Periode: {value.label ?? "Pilih rentang"} ({params.start} - {params.end})
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Filter Periode</CardTitle>
          <Button size="sm" variant="outline">
            Ekspor PDF
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <DateRangeControls
            value={{ ...value, label: value.label }}
            onPresetChange={setPreset}
            onCustomApply={setCustomRange}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item) => (
          <Card key={item.title} className="border border-border/60 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full inline-flex",
                  item.positive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                )}
              >
                {item.delta}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Laporan Laba/Rugi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Akun</th>
                <th className="text-right px-4 py-3 font-semibold">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {labaRugiRows.map((row) => (
                <tr key={row.label} className={cn(row.highlight && "bg-primary/5")}>
                  <td className={cn("px-4 py-3 text-foreground", row.level > 0 && "pl-8 text-muted-foreground")}>
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {row.value < 0 ? "-" : ""}
                    Rp {Math.abs(row.value).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
