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

import { cn } from "@/lib/utils";

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
    badgeColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Total HPP",
    value: "Rp 234.567.000",
    delta: "+5,3% dari bulan lalu",
    icon: DollarSign,
    badgeColor: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Laba Kotor",
    value: "Rp 222.222.000",
    delta: "+18,2% dari bulan lalu",
    icon: TrendingUp,
    badgeColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Laba Bersih",
    value: "Rp 156.789.000",
    delta: "+15,7% dari bulan lalu",
    icon: FileText,
    badgeColor: "text-indigo-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-900/20",
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

export default function LabaRugiReportPage() {
  const [activePreset, setActivePreset] = useState("month");

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Laba/Rugi</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block mr-2">
            01/01/2023 - 31/01/2023
          </span>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1 shadow-sm">
            {presetOptions.map((option) => {
              const isActive = activePreset === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActivePreset(option.value)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ml-2">
            Terapkan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold">{card.value}</p>
              </div>
              <div
                className={cn("p-2 rounded-lg", card.badgeBg, card.badgeColor)}
              >
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full inline-flex",
                  card.badgeBg,
                  card.badgeColor
                )}
              >
                {card.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold">Laporan Laba/Rugi</h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              Cetak Laporan
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors">
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Ekspor ke Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {profitRows.map((row) => {
                if (row.type === "section") {
                  return (
                    <tr
                      key={row.label}
                      className="bg-slate-50 dark:bg-slate-800/30"
                    >
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
                    <tr
                      key={row.label}
                      className="bg-blue-50/50 dark:bg-blue-900/10"
                    >
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
                    <tr key={row.label} className="bg-indigo-600 text-white">
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
                    <tr
                      key={row.label}
                      className="bg-slate-50/50 dark:bg-slate-800/20"
                    >
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-sm font-bold mb-3">Catatan Laporan:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-500 dark:text-slate-400">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© 2023 3Portals App. Hak Cipta Dilindungi.</span>
        <span>Terakhir diperbarui: 31 Januari 2023, 15:30</span>
      </div>
    </div>
  );
}
