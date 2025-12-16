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
import { DateRangeControls } from "./components/DateRangeControls";
import { useDateRange } from "./hooks/useDateRange";
import { KpiSection } from "./containers/KpiSection";
import type { FinancePreset } from "./types";

export function FinanceSalesReportPage() {
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
    console.info("telemetry:finance_range_change", {
      preset,
      start: value.start,
      end: value.end,
    });
  };

  const handleCustomApply = (start: string, end: string) => {
    setCustomRange(start, end);
    console.info("telemetry:finance_range_change", {
      preset: "custom",
      start,
      end,
    });
  };

  return (
    <div className="flex flex-col gap-6 bg-background p-4 sm:p-6 rounded-xl border border-border/60 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Keuangan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Penjualan Rinci</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">
          Laporan penjualan terpilih
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Filter Periode
          </CardTitle>
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
        <Card className="lg:col-span-2 border border-dashed border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Produk Terlaris (akan datang)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Bagian ini akan menampilkan tabel produk terlaris sesuai rentang
            tanggal.
          </CardContent>
        </Card>
        <Card className="border border-dashed border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Penjualan per Channel (akan datang)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Visualisasi channel akan ditempatkan di sini.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
