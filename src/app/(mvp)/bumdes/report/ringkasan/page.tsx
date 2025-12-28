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
    title: "Total Pengeluaran",
    value: "Rp 234.567.000",
    delta: "+5,3% dari bulan lalu",
    icon: ReceiptText,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
  {
    title: "Laba Bersih",
    value: "Rp 222.222.000",
    delta: "+18,2% dari bulan lalu",
    icon: TrendingUp,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
  },
  {
    title: "Saldo Kas",
    value: "Rp 345.678.000",
    delta: "+7,8% dari bulan lalu",
    icon: FileText,
    badgeColor: "text-primary",
    badgeBg: "bg-primary/10",
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
  { label: "Penjualan Produk 66%", className: "top-10 left-4 text-muted-foreground" },
  { label: "Jasa 26%", className: "bottom-10 right-16 text-muted-foreground" },
  {
    label: "Lainnya 8%",
    className: "top-1/2 right-2 -translate-y-1/2 text-muted-foreground",
  },
];

const recentTransactions = [
  {
    date: "28/01/2023",
    description: "Penjualan Produk A",
    category: "Penjualan",
    amount: "Rp 5.800.000",
    colorClass: "bg-muted/40 text-muted-foreground",
  },
  {
    date: "25/01/2023",
    description: "Pembayaran Supplier",
    category: "Pembelian",
    amount: "Rp 3.450.000",
    colorClass: "bg-muted/40 text-muted-foreground",
  },
  {
    date: "23/01/2023",
    description: "Pembayaran Gaji",
    category: "Pengeluaran",
    amount: "Rp 12.500.000",
    colorClass: "bg-muted/40 text-muted-foreground",
  },
  {
    date: "20/01/2023",
    description: "Penjualan Produk B",
    category: "Penjualan",
    amount: "Rp 7.250.000",
    colorClass: "bg-muted/40 text-muted-foreground",
  },
  {
    date: "18/01/2023",
    description: "Biaya Utilitas",
    category: "Pengeluaran",
    amount: "Rp 1.875.000",
    colorClass: "bg-muted/40 text-muted-foreground",
  },
];

export default function RingkasanReportPage() {
  const [activePreset, setActivePreset] = useState("month");
  const presetLabel = presetOptions.find(
    (item) => item.value === activePreset
  )?.label;

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
          >
            Terapkan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
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
                key={month.label}
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
                background:
                  "conic-gradient(hsl(var(--primary)) 0% 66%, hsl(var(--secondary)) 66% 74%, hsl(var(--accent)) 74% 100%)",
              }}
            >
              <div className="w-24 h-24 bg-card rounded-full" />
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
                <TableRow key={trx.description + trx.date}>
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

      <ReportFooter
        updatedLabel={`Terakhir diperbarui: 31 Januari 2023, 15:30 — ${
          presetLabel ?? "Bulan Ini"
        }`}
      />
    </div>
  );
}
