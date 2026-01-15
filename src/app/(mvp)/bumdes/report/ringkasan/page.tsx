/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  ReceiptText,
  TrendingUp,
  Wallet,
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
import { ensureSuccess } from "@/lib/api";
import { getBumdesOverviewReport } from "@/services/api";
import type { OverviewReport, RevenueSegment } from "@/modules/bumdes/report/types";

import { ReportFooter } from "@/modules/bumdes/report/components/report-footer";
import { SegmentedControl } from "@/modules/bumdes/report/components/segmented-control";
import { SummaryCard } from "@/modules/bumdes/report/components/summary-card";
import { withRowKeys } from "@/modules/bumdes/report/utils/report-keys";

const presetOptions = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month" },
  { label: "Kustom", value: "custom" },
];

const segmentPositions = [
  "top-10 left-4 text-muted-foreground",
  "bottom-10 right-16 text-muted-foreground",
  "top-1/2 right-2 -translate-y-1/2 text-muted-foreground",
];

export default function RingkasanReportPage() {
  const [activePreset, setActivePreset] = useState("month");
  const [appliedPreset, setAppliedPreset] = useState("month");
  const [report, setReport] = useState<OverviewReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadReport = async () => {
      try {
        const data = ensureSuccess(
          await getBumdesOverviewReport({ preset: appliedPreset, limit: 5 })
        );
        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        console.warn("bumdes overview failed to load", err);
      }
    };
    loadReport();
    return () => {
      cancelled = true;
    };
  }, [appliedPreset]);

  const summaryCards = withRowKeys(
    report?.kpis?.map((kpi) => ({
      title: kpi.title,
      value: kpi.value_display,
      delta: kpi.delta_display ?? "",
      icon:
        kpi.title === "Total Pendapatan"
          ? Wallet
          : kpi.title === "Total Pengeluaran"
            ? ReceiptText
            : kpi.title === "Laba Bersih"
              ? TrendingUp
              : FileText,
      badgeColor: "text-primary",
      badgeBg: "bg-primary/10",
    })) ?? [],
    (card) => [card.title, card.value, card.delta],
    "summary-card"
  );

  const monthlyPerformance = withRowKeys(
    report?.monthly_performance?.map((item) => ({
      label: item.label,
      revenue: item.revenue_pct,
      expense: item.expense_pct,
    })) ?? [],
    (item) => [item.label, item.revenue, item.expense],
    "month"
  );

  const revenueSegments = report?.revenue_segments ?? [];
  const positionedSegments = withRowKeys(
    revenueSegments.map((segment, index) => ({
      label: segment.label_display,
      className: segmentPositions[index] ?? "text-muted-foreground",
      pct: segment.pct,
    })),
    (segment) => [segment.label, segment.pct],
    "segment"
  );
  const revenueGradient = revenueSegments.length
    ? buildRevenueGradient(revenueSegments)
    : "";

  const recentTransactions = withRowKeys(
    report?.recent_transactions?.map((trx) => ({
      date: trx.date_display,
      description: trx.description,
      category: trx.category,
      amount: trx.amount_display,
      colorClass: trx.badge_class ?? "",
    })) ?? [],
    (trx) => [trx.date, trx.description, trx.amount, trx.category],
    "trx"
  );

  const updatedLabel = report?.updated_at
    ? `Terakhir diperbarui: ${report.updated_at}${
        report.period_label ? ` — ${report.period_label}` : ""
      }`
    : "";

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Ringkasan</h1>
        <div className="flex items-center gap-2">
          <SegmentedControl
            options={presetOptions}
            activeValue={activePreset}
            onChange={setActivePreset}
          />
          <Button
            type="button"
            className="hidden sm:inline-flex h-auto px-4 py-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setAppliedPreset(activePreset)}
          >
            Terapkan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ rowKey, ...card }) => (
          <SummaryCard key={rowKey} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Pendapatan vs Pengeluaran</h3>
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-3 py-1.5 text-xs font-medium bg-card border-border text-muted-foreground hover:bg-muted/40"
            >
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Ekspor ke CSV/Excel
            </Button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2">
            {monthlyPerformance.map((month) => (
              <div
                key={month.rowKey}
                className="flex flex-col items-center flex-1 gap-1 h-full justify-end"
              >
                <div className="flex w-full gap-1 h-full items-end justify-center">
                  <div
                    className="w-3 bg-primary rounded-t-sm"
                    style={{ height: `${month.revenue}%` }}
                  />
                  <div
                    className="w-3 bg-secondary rounded-t-sm"
                    style={{ height: `${month.expense}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  {month.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="w-3 h-3 bg-primary rounded-sm mr-2" />
              Pendapatan
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="w-3 h-3 bg-secondary rounded-sm mr-2" />
              Pengeluaran
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Distribusi Pendapatan</h3>
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-3 py-1.5 text-xs font-medium bg-card border-border text-muted-foreground hover:bg-muted/40"
            >
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Export
            </Button>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <div
              className="w-48 h-48 rounded-full p-8 flex items-center justify-center"
              style={{
                background: revenueGradient,
              }}
            >
              <div className="w-24 h-24 bg-card rounded-full" />
            </div>
            {positionedSegments.map((segment) => (
              <div
                key={segment.rowKey}
                className={cn(
                  "absolute text-xs font-medium",
                  segment.className
                )}
              >
                {segment.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold">Transaksi Terakhir</h3>
          <Button
            type="button"
            className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Ekspor ke CSV/Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tanggal
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Deskripsi
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kategori
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Jumlah
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card divide-y divide-border">
              {recentTransactions.map((trx) => (
                <TableRow key={trx.rowKey}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    {trx.date}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    {trx.description}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        trx.colorClass
                      )}
                    >
                      {trx.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {trx.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReportFooter updatedLabel={updatedLabel} />
    </div>
  );
}

function buildRevenueGradient(segments: RevenueSegment[]): string {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
  ];
  let cursor = 0;
  const stops = segments.map((segment, index) => {
    const start = cursor;
    const end = cursor + segment.pct;
    cursor = end;
    const color = colors[index % colors.length];
    return `${color} ${start}% ${end}%`;
  });
  if (cursor < 100) {
    const color = colors[segments.length % colors.length];
    stops.push(`${color} ${cursor}% 100%`);
  }
  return `conic-gradient(${stops.join(", ")})`;
}
