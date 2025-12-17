/** @format */

"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  ReceiptText,
  TrendingUp,
  Wallet,
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
    title: "Total Pengeluaran",
    value: "Rp 234.567.000",
    delta: "+5,3% dari bulan lalu",
    icon: ReceiptText,
    badgeColor: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Laba Bersih",
    value: "Rp 222.222.000",
    delta: "+18,2% dari bulan lalu",
    icon: TrendingUp,
    badgeColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Saldo Kas",
    value: "Rp 345.678.000",
    delta: "+7,8% dari bulan lalu",
    icon: FileText,
    badgeColor: "text-indigo-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const monthlyPerformance = [
  { label: "Jan", revenue: 45, expense: 30 },
  { label: "Feb", revenue: 60, expense: 40 },
  { label: "Mar", revenue: 55, expense: 35 },
  { label: "Apr", revenue: 75, expense: 45 },
  { label: "Mei", revenue: 70, expense: 38 },
  { label: "Jun", revenue: 80, expense: 42 },
];

const revenueSegments = [
  { label: "Penjualan Produk 66%", className: "top-10 left-4 text-blue-500" },
  { label: "Jasa 26%", className: "bottom-10 right-16 text-emerald-500" },
  {
    label: "Lainnya 8%",
    className: "top-1/2 right-2 -translate-y-1/2 text-purple-500",
  },
];

const recentTransactions = [
  {
    date: "28/01/2023",
    description: "Penjualan Produk A",
    category: "Penjualan",
    amount: "Rp 5.800.000",
    colorClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    date: "25/01/2023",
    description: "Pembayaran Supplier",
    category: "Pembelian",
    amount: "Rp 3.450.000",
    colorClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    date: "23/01/2023",
    description: "Pembayaran Gaji",
    category: "Pengeluaran",
    amount: "Rp 12.500.000",
    colorClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
  {
    date: "20/01/2023",
    description: "Penjualan Produk B",
    category: "Penjualan",
    amount: "Rp 7.250.000",
    colorClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    date: "18/01/2023",
    description: "Biaya Utilitas",
    category: "Pengeluaran",
    amount: "Rp 1.875.000",
    colorClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
];

export default function RingkasanReportPage() {
  const [activePreset, setActivePreset] = useState("month");
  const presetLabel = presetOptions.find(
    (item) => item.value === activePreset
  )?.label;

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Ringkasan</h1>
        <div className="flex items-center gap-2">
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
          <button className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            Terapkan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40"
          >
            <div className="flex justify-between items-start">
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
            <div className="mt-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Pendapatan vs Pengeluaran</h3>
            <button className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Ekspor ke CSV/Excel
            </button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2">
            {monthlyPerformance.map((month) => (
              <div
                key={month.label}
                className="flex flex-col items-center flex-1 gap-1 h-full justify-end"
              >
                <div className="flex w-full gap-1 h-full items-end justify-center">
                  <div
                    className="w-3 bg-blue-400 rounded-t-sm"
                    style={{ height: `${month.revenue}%` }}
                  />
                  <div
                    className="w-3 bg-rose-400 rounded-t-sm"
                    style={{ height: `${month.expense}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {month.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 bg-blue-400 rounded-sm mr-2" />
              Pendapatan
            </div>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 bg-rose-400 rounded-sm mr-2" />
              Pengeluaran
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Distribusi Pendapatan</h3>
            <button className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Export
            </button>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <div
              className="w-48 h-48 rounded-full p-8 flex items-center justify-center"
              style={{
                background:
                  "conic-gradient(#60a5fa 0% 66%, #a78bfa 66% 74%, #34d399 74% 100%)",
              }}
            >
              <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full" />
            </div>
            {revenueSegments.map((segment) => (
              <div
                key={segment.label}
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

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold">Transaksi Terakhir</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Ekspor ke CSV/Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {recentTransactions.map((trx) => (
                <tr key={trx.description + trx.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {trx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        trx.colorClass
                      )}
                    >
                      {trx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {trx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© 2023 3Portals App. Hak Cipta Dilindungi.</span>
        <span>
          Terakhir diperbarui: 31 Januari 2023, 15:30 —{" "}
          {presetLabel ?? "Bulan Ini"}
        </span>
      </div>
    </div>
  );
}
