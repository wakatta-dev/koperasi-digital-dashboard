/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  Wallet,
  ReceiptText,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { ReportFooter } from "@/modules/bumdes/report/components/report-footer";
import { SegmentedControl } from "@/modules/bumdes/report/components/segmented-control";
import { ensureSuccess } from "@/lib/api";
import { getBumdesSalesDetailReport } from "@/services/api";
import type { SalesDetailReport } from "@/modules/bumdes/report/types";
import { withRowKeys } from "@/modules/bumdes/report/utils/report-keys";

const presets = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month", active: true },
  { label: "Kustom", value: "custom" },
];


export default function PenjualanRinciReportPage() {
  const [activePreset, setActivePreset] = useState(
    presets.find((preset) => preset.active)?.value ?? presets[0].value
  );
  const [appliedPreset, setAppliedPreset] = useState(
    presets.find((preset) => preset.active)?.value ?? presets[0].value
  );
  const [report, setReport] = useState<SalesDetailReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadReport = async () => {
      try {
        const data = ensureSuccess(
          await getBumdesSalesDetailReport({ preset: appliedPreset, limit: 10 })
        );
        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        console.warn("bumdes sales-detail failed to load", err);
      }
    };
    loadReport();
    return () => {
      cancelled = true;
    };
  }, [appliedPreset]);

  const summaryCards = withRowKeys(
    report?.summary_cards?.map((card) => ({
      title: card.title,
      value: card.value_display,
      delta: card.delta_display ?? "",
      icon:
        card.title === "Omzet Total"
          ? Wallet
          : card.title === "Jumlah Transaksi"
            ? ReceiptText
            : BarChart3,
    })) ?? [],
    (card) => [card.title, card.value, card.delta],
    "summary-card"
  );

  const topProducts = withRowKeys(
    report?.top_products?.map((product) => ({
      name: product.name,
      units: product.units_display,
      revenue: product.revenue_display,
      pct: product.pct,
    })) ?? [],
    (product) => [product.name, product.units, product.revenue],
    "product"
  );

  const channelBreakdown = report?.channel_breakdown ?? [];
  const channelTable = withRowKeys(
    channelBreakdown.map((row) => ({
      label: row.label,
      revenue: row.revenue_display,
      pct: row.pct_display,
      color: row.color_key ?? "",
      transactions: row.transactions,
      average: row.average_ticket_display,
    })),
    (row) => [row.label, row.revenue, row.pct, row.transactions],
    "channel"
  );

  const comparisonItems = report?.channel_comparison ?? [];
  const comparisonMap = new Map(
    comparisonItems.map((item) => [item.label, item])
  );
  const primaryChannel = channelBreakdown[0];
  const secondaryChannel = channelBreakdown[1];
  const primaryLabel =
    primaryChannel?.label ?? comparisonItems[0]?.label ?? "";
  const secondaryLabel =
    secondaryChannel?.label ?? comparisonItems[1]?.label ?? "";
  const primaryPct = parsePercentage(primaryChannel?.pct_display);
  const secondaryPct = parsePercentage(secondaryChannel?.pct_display);
  const primaryComparison = comparisonMap.get(primaryLabel);
  const secondaryComparison = comparisonMap.get(secondaryLabel);
  const updatedLabel = report?.updated_at
    ? `Terakhir diperbarui: ${report.updated_at}${
        report.period_label ? ` — ${report.period_label}` : ""
      }`
    : "";
  const periodLabel = report?.period_label ?? "";

  const primaryChannelColor = primaryChannel?.color_key ?? "";
  const secondaryChannelColor = secondaryChannel?.color_key ?? "";

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Penjualan Rinci</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
        <div className="flex flex-wrap gap-2">
          <SegmentedControl
            options={presets}
            activeValue={activePreset}
            onChange={setActivePreset}
            className="bg-muted/40 border-0 rounded-lg p-1 overflow-hidden"
            buttonClassName="px-4"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium">
            {periodLabel}
          </span>
          <Button
            type="button"
            className="inline-flex h-auto items-center px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setAppliedPreset(activePreset)}
          >
            Terapkan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ringkasan Penjualan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <div
              key={card.rowKey}
              className="bg-card rounded-xl p-6 shadow-sm border border-border flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold mb-2">{card.value}</h3>
                <div className="flex items-center text-sm font-medium text-primary">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {card.delta}
                </div>
              </div>
              <div className="bg-muted/40 p-2.5 rounded-lg">
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold">Produk Terlaris</h2>
          <Button
            type="button"
            className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor ke CSV/Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Nama Produk
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah Terjual
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Pendapatan
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  % Kontribusi
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-48">
                  Visualisasi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card divide-y divide-border">
              {topProducts.map((product) => (
                <TableRow key={product.rowKey}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                    {product.units}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    {product.revenue}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                    {product.pct}%
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="w-full bg-muted/40 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${product.pct}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-lg font-bold">Penjualan per Channel</h2>
            <Button
              type="button"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor ke CSV/Excel
            </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
            <div
              className="donut-chart mb-4"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `conic-gradient(hsl(var(--secondary)) 0% ${secondaryPct}%, hsl(var(--primary)) ${secondaryPct}% ${Math.min(secondaryPct + primaryPct, 100)}%)`,
                position: "relative",
              }}
            >
              <div
                className="donut-hole bg-card"
                style={{
                  width: "70%",
                  height: "70%",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
            {primaryLabel ? (
              <div className="absolute top-10 left-10 lg:left-15 text-muted-foreground font-medium text-sm">
                {primaryLabel} {primaryPct}%
              </div>
            ) : null}
            {secondaryLabel ? (
              <div className="absolute top-10 right-10 lg:right-15 text-muted-foreground font-medium text-sm">
                {secondaryLabel} {secondaryPct}%
              </div>
            ) : null}
            <div className="flex gap-6 mt-4">
              {primaryLabel ? (
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-sm", primaryChannelColor)} />
                  <span className="text-sm text-muted-foreground font-medium">
                    {primaryLabel}
                  </span>
                </div>
              ) : null}
              {secondaryLabel ? (
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-sm", secondaryChannelColor)} />
                  <span className="text-sm text-muted-foreground font-medium">
                    {secondaryLabel}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table className="min-w-full divide-y divide-border">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Channel
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Pendapatan
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Persentase
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-card divide-y divide-border">
                  {channelTable.map((row) => (
                    <TableRow key={row.rowKey}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                        <div
                          className={cn("w-2.5 h-2.5 rounded-full", row.color)}
                        />
                        {row.label}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        {row.revenue}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        {row.pct}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">
                Perbandingan Channel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    Jumlah Transaksi
                  </p>
                  {primaryLabel ? (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{primaryLabel}</span>
                      <span className="text-sm font-bold">
                        {primaryComparison?.transaction_count?.toString() ?? ""}
                      </span>
                    </div>
                  ) : null}
                  {secondaryLabel ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{secondaryLabel}</span>
                      <span className="text-sm font-bold">
                        {secondaryComparison?.transaction_count?.toString() ?? ""}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    Rata-rata Transaksi
                  </p>
                  {primaryLabel ? (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{primaryLabel}</span>
                      <span className="text-sm font-bold">
                        {primaryComparison?.average_ticket_display ?? ""}
                      </span>
                    </div>
                  ) : null}
                  {secondaryLabel ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{secondaryLabel}</span>
                      <span className="text-sm font-bold">
                        {secondaryComparison?.average_ticket_display ?? ""}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportFooter updatedLabel={updatedLabel} />
    </div>
  );
}

function parsePercentage(value?: string): number {
  if (!value) return 0;
  const numeric = Number(value.replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}
