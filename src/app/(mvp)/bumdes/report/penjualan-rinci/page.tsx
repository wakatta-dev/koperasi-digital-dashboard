/** @format */

"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  Wallet,
  ReceiptText,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ReportFooter } from "../_components/report-footer";
import { SegmentedControl } from "../_components/segmented-control";

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
    color: "bg-primary",
  },
  {
    label: "Marketplace",
    revenue: "Rp 137.036.700",
    pct: "30%",
    color: "bg-secondary",
  },
];

export default function PenjualanRinciReportPage() {
  const [activePreset, setActivePreset] = useState(
    presets.find((preset) => preset.active)?.value ?? presets[0].value
  );

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
            01/01/2023 - 31/01/2023
          </span>
          <Button
            type="button"
            className="inline-flex h-auto items-center px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
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
              key={card.title}
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
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah Terjual
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Pendapatan
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  % Kontribusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-48">
                  Visualisasi
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                    {product.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    {product.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                    {product.pct}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="w-full bg-muted/40 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
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
                background:
                  "conic-gradient(hsl(var(--secondary)) 0% 30%, hsl(var(--primary)) 30% 100%)",
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
            <div className="absolute top-10 left-10 lg:left-15 text-muted-foreground font-medium text-sm">
              Kasir (POS) 70%
            </div>
            <div className="absolute top-10 right-10 lg:right-15 text-muted-foreground font-medium text-sm">
              Marketplace 30%
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-sm" />
                <span className="text-sm text-muted-foreground font-medium">
                  Kasir (POS)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-sm" />
                <span className="text-sm text-muted-foreground font-medium">
                  Marketplace
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Pendapatan
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
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
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
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
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
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

      <ReportFooter updatedLabel="Terakhir diperbarui: 31 Januari 2023, 15:30" />
    </div>
  );
}
