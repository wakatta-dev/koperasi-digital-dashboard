/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Printer,
  TrendingUp,
  Wallet,
  DollarSign,
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

import { ReportFooter } from "../_components/report-footer";
import { SegmentedControl } from "../_components/segmented-control";
import { SummaryCard } from "../_components/summary-card";
import { ensureSuccess } from "@/lib/api";
import { getBumdesProfitLossReport } from "@/services/api";
import type { ProfitLossReport } from "@/modules/bumdes/report/types";

const presetOptions = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month" },
  { label: "Kustom", value: "custom" },
];


type ProfitRow =
  | { type: "section"; label: string }
  | { type: "row"; label: string; value: string }
  | { type: "total"; label: string; value: string }
  | { type: "gross"; label: string; value: string }
  | { type: "net"; label: string; value: string };


const renderProfitRow = (row: ProfitRow) => {
  if (row.type === "section") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell
          className="px-6 py-3 whitespace-nowrap text-sm font-bold"
          colSpan={2}
        >
          {row.label}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "gross") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold">
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "net") {
    return (
      <TableRow key={row.label} className="bg-primary text-primary-foreground">
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold">
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "total") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm font-bold">
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={row.label}>
      <TableCell className="px-6 py-3 pl-10 whitespace-nowrap text-sm">
        {row.label}
      </TableCell>
      <TableCell className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
        {row.value}
      </TableCell>
    </TableRow>
  );
};

export default function LabaRugiReportPage() {
  const [activePreset, setActivePreset] = useState("month");
  const [appliedPreset, setAppliedPreset] = useState("month");
  const [report, setReport] = useState<ProfitLossReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadReport = async () => {
      try {
        const data = ensureSuccess(
          await getBumdesProfitLossReport({ preset: appliedPreset })
        );
        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        console.warn("bumdes profit-loss failed to load", err);
      }
    };
    loadReport();
    return () => {
      cancelled = true;
    };
  }, [appliedPreset]);

  const summaryCards = report?.summary_cards?.map((card) => ({
    title: card.title,
    value: card.value_display,
    delta: card.delta_display ?? "",
    icon:
      card.title === "Total Pendapatan"
        ? Wallet
        : card.title === "Total HPP"
          ? DollarSign
          : card.title === "Laba Kotor"
            ? TrendingUp
            : FileText,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  })) ?? [];

  const profitRows: ProfitRow[] = report?.rows?.map((row) => {
    switch (row.type) {
      case "section":
        return { type: "section", label: row.label };
      case "row":
        return { type: "row", label: row.label, value: row.value_display ?? "" };
      case "total":
        return { type: "total", label: row.label, value: row.value_display ?? "" };
      case "gross":
        return { type: "gross", label: row.label, value: row.value_display ?? "" };
      default:
        return { type: "net", label: row.label, value: row.value_display ?? "" };
    }
  }) ?? [];

  const notes = report?.notes ?? [];
  const periodLabel = report?.period_label ?? "";

  const updatedLabel = report?.updated_at
    ? `Terakhir diperbarui: ${report.updated_at}${
        report.period_label ? ` — ${report.period_label}` : ""
      }`
    : "";

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Laba/Rugi</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
            {periodLabel}
          </span>
          <SegmentedControl
            options={presetOptions}
            activeValue={activePreset}
            onChange={setActivePreset}
          />
          <Button
            type="button"
            className="hidden sm:inline-flex h-auto items-center px-4 py-2 ml-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setAppliedPreset(activePreset)}
          >
            Terapkan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            className="relative overflow-hidden"
            {...card}
          />
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold">Laporan Laba/Rugi</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium bg-card border-border text-muted-foreground hover:bg-muted/40"
            >
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              Cetak Laporan
            </Button>
            <Button
              type="button"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Ekspor ke Excel
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Keterangan
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah (Rp)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card divide-y divide-border">
              {profitRows.map((row) => renderProfitRow(row))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-sm font-bold mb-3">Catatan Laporan:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <ReportFooter updatedLabel={updatedLabel} />
    </div>
  );
}
