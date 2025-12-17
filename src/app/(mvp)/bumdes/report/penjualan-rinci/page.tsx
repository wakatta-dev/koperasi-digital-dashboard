/** @format */

"use client";

import {
  Download,
  TrendingUp,
  Wallet,
  ReceiptText,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";

const presets = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month", active: true },
  { label: "Kustom", value: "custom" },
];

const summaryCards = [
  {
    title: "Omzet Total",
    value: "Rp 456.789.000",
    delta: "+12,5% dari bulan lalu",
    icon: Wallet,
  },
  {
    title: "Jumlah Transaksi",
    value: "1.234",
    delta: "+8,3% dari bulan lalu",
    icon: ReceiptText,
  },
  {
    title: "Rata-rata Transaksi",
    value: "Rp 370.170",
    delta: "+3,7% dari bulan lalu",
    icon: BarChart3,
  },
];

const topProducts = [
  { name: "Produk A", units: "532 unit", revenue: "Rp 159.600.000", pct: 35 },
  { name: "Produk B", units: "421 unit", revenue: "Rp 126.300.000", pct: 28 },
  { name: "Produk C", units: "289 unit", revenue: "Rp 86.700.000", pct: 19 },
  { name: "Produk D", units: "186 unit", revenue: "Rp 55.800.000", pct: 12 },
  { name: "Produk E", units: "92 unit", revenue: "Rp 27.600.000", pct: 6 },
];

const channelTable = [
  {
    label: "Kasir (POS)",
    revenue: "Rp 319.752.300",
    pct: "70%",
    color: "bg-blue-500",
  },
  {
    label: "Marketplace",
    revenue: "Rp 137.036.700",
    pct: "30%",
    color: "bg-emerald-500",
  },
];

export default function PenjualanRinciReportPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Penjualan Rinci</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-hidden">
            {presets.map((preset) => (
              <button
                key={preset.value}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                  preset.active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            01/01/2023 - 31/01/2023
          </span>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            Terapkan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ringkasan Penjualan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold mb-2">{card.value}</h3>
                <div className="flex items-center text-sm font-medium text-lime-700 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {card.delta}
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg">
                <card.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold">Produk Terlaris</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Ekspor ke CSV/Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah Terjual
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Pendapatan
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  % Kontribusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">
                  Visualisasi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500 dark:text-slate-400">
                    {product.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    {product.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500 dark:text-slate-400">
                    {product.pct}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${product.pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-lg font-bold">Penjualan per Channel</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Ekspor ke CSV/Excel
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
            <div
              className="donut-chart mb-4"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "conic-gradient(#10b981 0% 30%, #3b82f6 30% 100%)",
                position: "relative",
              }}
            >
              <div
                className="donut-hole bg-white dark:bg-slate-900"
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
            <div className="absolute top-10 left-10 lg:left-15 text-blue-500 font-medium text-sm">
              Kasir (POS) 70%
            </div>
            <div className="absolute top-10 right-10 lg:right-15 text-emerald-500 font-medium text-sm">
              Marketplace 30%
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <span className="text-sm text-blue-500 font-medium">
                  Kasir (POS)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                <span className="text-sm text-emerald-500 font-medium">
                  Marketplace
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Pendapatan
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                  {channelTable.map((row) => (
                    <tr key={row.label}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                        <div
                          className={cn("w-2.5 h-2.5 rounded-full", row.color)}
                        />
                        {row.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        {row.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        {row.pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">
                Perbandingan Channel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Jumlah Transaksi
                  </p>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Kasir (POS)</span>
                    <span className="text-sm font-bold">876</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Marketplace</span>
                    <span className="text-sm font-bold">358</span>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Rata-rata Transaksi
                  </p>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Kasir (POS)</span>
                    <span className="text-sm font-bold">Rp 365.014</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Marketplace</span>
                    <span className="text-sm font-bold">Rp 382.784</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© 2023 3Portals App. Hak Cipta Dilindungi.</span>
        <span>Terakhir diperbarui: 31 Januari 2023, 15:30</span>
      </div>
    </div>
  );
}
