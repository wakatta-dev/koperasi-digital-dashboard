/** @format */

"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Printer,
  TrendingUp,
  Wallet,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ReportFooter } from "../_components/report-footer";
import { SegmentedControl } from "../_components/segmented-control";
import { SummaryCard } from "../_components/summary-card";

const presetOptions = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month" },
  { label: "Kustom", value: "custom" },
];

const summaryCards = [
  {
    title: "Total Pendapatan",
    value: "Rp 456.789.000",
    delta: "+12,5% dari bulan lalu",
    icon: Wallet,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
  {
    title: "Total HPP",
    value: "Rp 234.567.000",
    delta: "+5,3% dari bulan lalu",
    icon: DollarSign,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
  {
    title: "Laba Kotor",
    value: "Rp 222.222.000",
    delta: "+18,2% dari bulan lalu",
    icon: TrendingUp,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
  {
    title: "Laba Bersih",
    value: "Rp 156.789.000",
    delta: "+15,7% dari bulan lalu",
    icon: FileText,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
];

type ProfitRow =
  | { type: "section"; label: string }
  | { type: "row"; label: string; value: string }
  | { type: "total"; label: string; value: string }
  | { type: "gross"; label: string; value: string }
  | { type: "net"; label: string; value: string };

const profitRows: ProfitRow[] = [
  { type: "section", label: "Pendapatan" },
  { type: "row", label: "Penjualan Produk", value: "345.678.000" },
  { type: "row", label: "Pendapatan Jasa", value: "98.765.000" },
  { type: "row", label: "Pendapatan Lainnya", value: "12.346.000" },
  { type: "total", label: "Total Pendapatan", value: "456.789.000" },
  { type: "section", label: "Harga Pokok Penjualan (HPP)" },
  { type: "row", label: "Pembelian Bahan", value: "156.789.000" },
  { type: "row", label: "Biaya Produksi", value: "45.678.000" },
  { type: "row", label: "Biaya Pengiriman", value: "32.100.000" },
  { type: "total", label: "Total HPP", value: "234.567.000" },
  { type: "gross", label: "Laba Kotor", value: "222.222.000" },
  { type: "section", label: "Beban Operasional" },
  { type: "row", label: "Gaji Karyawan", value: "45.678.000" },
  { type: "row", label: "Sewa Gedung", value: "12.345.000" },
  { type: "row", label: "Utilitas", value: "5.678.000" },
  { type: "row", label: "Pemasaran", value: "8.765.000" },
  { type: "row", label: "Administrasi", value: "3.456.000" },
  { type: "total", label: "Total Beban", value: "75.922.000" },
  { type: "net", label: "Laba Bersih", value: "146.300.000" },
];

const notes = [
  "Laporan ini mencakup periode 01 Januari 2023 - 31 Januari 2023",
  "Seluruh nilai ditampilkan dalam Rupiah (Rp)",
  "Tidak termasuk beban pajak penghasilan",
  "Laporan dibuat berdasarkan transaksi yang telah disetujui",
];

const renderProfitRow = (row: ProfitRow) => {
  if (row.type === "section") {
    return (
      <tr key={row.label} className="bg-muted/30">
        <td
          className="px-6 py-3 whitespace-nowrap text-sm font-bold"
          colSpan={2}
        >
          {row.label}
        </td>
      </tr>
    );
  }

  if (row.type === "gross") {
    return (
      <tr key={row.label} className="bg-muted/30">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
          {row.label}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </td>
      </tr>
    );
  }

  if (row.type === "net") {
    return (
      <tr key={row.label} className="bg-primary text-primary-foreground">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
          {row.label}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </td>
      </tr>
    );
  }

  if (row.type === "total") {
    return (
      <tr key={row.label} className="bg-muted/30">
        <td className="px-6 py-3 whitespace-nowrap text-sm font-bold">
          {row.label}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </td>
      </tr>
    );
  }

  return (
    <tr key={row.label}>
      <td className="px-6 py-3 pl-10 whitespace-nowrap text-sm">
        {row.label}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
        {row.value}
      </td>
    </tr>
  );
};

export default function LabaRugiReportPage() {
  const [activePreset, setActivePreset] = useState("month");

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Laba/Rugi</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
            01/01/2023 - 31/01/2023
          </span>
          <SegmentedControl
            options={presetOptions}
            activeValue={activePreset}
            onChange={setActivePreset}
          />
          <Button
            type="button"
            className="hidden sm:inline-flex h-auto items-center px-4 py-2 ml-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
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
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {profitRows.map((row) => renderProfitRow(row))}
            </tbody>
          </table>
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

      <ReportFooter updatedLabel="Terakhir diperbarui: 31 Januari 2023, 15:30" />
    </div>
  );
}
