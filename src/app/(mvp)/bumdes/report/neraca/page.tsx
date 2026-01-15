/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  HelpCircle,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ReportFooter } from "@/modules/bumdes/report/components/report-footer";
import { SegmentedControl } from "@/modules/bumdes/report/components/segmented-control";
import { ensureSuccess } from "@/lib/api";
import { getBumdesBalanceSheetReport } from "@/services/api";
import type { BalanceSheetReport } from "@/modules/bumdes/report/types";

const periodPresets = [
  { label: "Bulanan", value: "month", active: false },
  { label: "Kuartalan", value: "quarter", active: true },
  { label: "Tahunan", value: "year", active: false },
];


export default function NeracaReportPage() {
  const [activePeriod, setActivePeriod] = useState(
    periodPresets.find((preset) => preset.active)?.value ?? periodPresets[0].value
  );
  const [report, setReport] = useState<BalanceSheetReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadReport = async () => {
      try {
        const data = ensureSuccess(
          await getBumdesBalanceSheetReport({ preset: activePeriod })
        );
        if (!cancelled) {
          setReport(data);
        }
      } catch (err) {
        console.warn("bumdes balance-sheet failed to load", err);
      }
    };
    loadReport();
    return () => {
      cancelled = true;
    };
  }, [activePeriod]);

  const assets =
    report?.assets?.map((item) => ({
      label: item.label,
      value: item.value_display,
    })) ?? [];
  const liabilities =
    report?.liabilities?.map((item) => ({
      label: item.label,
      value: item.value_display,
    })) ?? [];
  const equity =
    report?.equity?.map((item) => ({
      label: item.label,
      value: item.value_display,
    })) ?? [];
  const assetInfo =
    report?.asset_info?.map((item) => ({
      label: item.label,
      value: item.value_display,
    })) ?? [];
  const liabilityInfo =
    report?.liability_info?.map((item) => ({
      label: item.label,
      value: item.value_display,
    })) ?? [];

  const totalAssetsDisplay = report?.asset_total_display ?? "";
  const totalLEDisplay = report?.liab_equity_total_display ?? "";
  const totalLiabilitiesDisplay = report
    ? formatCurrencyID(sumDisplayValues(liabilities))
    : "";
  const totalEquityDisplay = report ? formatCurrencyID(sumDisplayValues(equity)) : "";
  const statusLabel = report?.status_label ?? "";
  const perLabel = report?.period_label
    ? report.period_label.includes(" - ")
      ? report.period_label.split(" - ").slice(-1)[0]
      : report.period_label
      : "";
  const updatedLabel = report?.updated_at
    ? `Terakhir diperbarui: ${report.updated_at}${
        report.period_label ? ` — ${report.period_label}` : ""
      }`
    : "";

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Neraca Sederhana</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <SegmentedControl
            options={periodPresets}
            activeValue={activePeriod}
            onChange={setActivePeriod}
          />
          <Button
            type="button"
            variant="outline"
            className="hidden sm:inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium bg-card text-foreground border-border shadow-sm hover:bg-muted/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            {perLabel}
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-3 py-2 text-sm font-medium bg-card border border-border text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor PDF
            </Button>
            <Button
              type="button"
              className="inline-flex h-auto items-center gap-0 px-3 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h3 className="text-lg font-bold">Laporan Posisi Keuangan</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0">
            <Info className="h-5 w-5 mr-1" />
            Per: {perLabel}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Aset
              </h4>
              <div className="space-y-4">
                {assets.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="font-bold">Total Aset</span>
                <span className="font-bold">{totalAssetsDisplay}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Liabilitas
                </h4>
                <div className="space-y-4">
                  {liabilities.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold">Total Liabilitas</span>
                  <span className="font-bold">{totalLiabilitiesDisplay}</span>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Ekuitas
                </h4>
                <div className="space-y-4">
                  {equity.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold">Total Ekuitas</span>
                  <span className="font-bold">{totalEquityDisplay}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="font-bold">Total Liabilitas dan Ekuitas</span>
                <span className="font-bold">{totalLEDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted/30 p-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-8 font-bold">
              <span>Total Aset</span>
              <span>{totalAssetsDisplay}</span>
              <span>=</span>
              <span>Total Liabilitas + Ekuitas</span>
              <span>{totalLEDisplay}</span>
            </div>
            <div className="flex items-center text-primary font-medium">
              <CheckCircle2 className="h-5 w-5 mr-1" />
              {statusLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/40 rounded-xl border border-border p-6 flex gap-3">
        <HelpCircle className="h-6 w-6 text-muted-foreground shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-foreground mb-1">Catatan</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Neraca ini menunjukkan posisi keuangan perusahaan pada tanggal 31
            Desember 2023. Total Aset harus sama dengan Total Liabilitas
            ditambah Ekuitas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-base font-bold mb-4">Informasi Aset</h3>
          <div className="space-y-3">
            {assetInfo.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-base font-bold mb-4">Informasi Liabilitas</h3>
          <div className="space-y-3">
            {liabilityInfo.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportFooter updatedLabel={updatedLabel} />
    </div>
  );
}

function sumDisplayValues(items: Array<{ value: string }>): number {
  return items.reduce((acc, item) => acc + parseCurrency(item.value), 0);
}

function parseCurrency(value: string): number {
  const numeric = value.replace(/[^0-9-]/g, "");
  const parsed = Number(numeric);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatCurrencyID(value: number): string {
  return `Rp ${formatNumberID(value)}`;
}

function formatNumberID(value: number): string {
  const negative = value < 0;
  const raw = Math.abs(value).toString();
  if (raw.length <= 3) {
    return negative ? `-${raw}` : raw;
  }
  const parts = [];
  for (let i = raw.length; i > 0; i -= 3) {
    const start = Math.max(i - 3, 0);
    parts.unshift(raw.slice(start, i));
  }
  const joined = parts.join(".");
  return negative ? `-${joined}` : joined;
}
