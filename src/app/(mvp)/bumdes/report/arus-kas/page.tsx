/** @format */

"use client";

import { useState } from "react";
import { Calendar, Download, Filter, Printer } from "lucide-react";

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

const presetOptions = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7days" },
  { label: "Bulan Ini", value: "month" },
  { label: "Kuartal Ini", value: "quarter" },
  { label: "Tahun Ini", value: "year" },
  { label: "Kustom", value: "custom" },
];

type CashFlowRow =
  | { type: "section"; label: string }
  | { type: "label"; label: string; indent: number }
  | { type: "item"; label: string; value: string; indent: number }
  | { type: "total"; label: string; value: string; indent: number }
  | { type: "netPrimary"; label: string; value: string }
  | { type: "summaryGray"; label: string; value: string }
  | { type: "plainBold"; label: string; value: string }
  | { type: "finalPrimary"; label: string; value: string };

const rows: CashFlowRow[] = [
  { type: "section", label: "Arus Kas Dari Aktivitas Operasi" },
  { type: "label", label: "Penerimaan Kas:", indent: 1 },
  {
    type: "item",
    label: "Penerimaan dari Pelanggan",
    value: "Rp 3.250.000.000",
    indent: 2,
  },
  {
    type: "item",
    label: "Penerimaan dari Bunga",
    value: "Rp 75.000.000",
    indent: 2,
  },
  {
    type: "item",
    label: "Penerimaan dari Refund Pajak",
    value: "Rp 45.000.000",
    indent: 2,
  },
  {
    type: "total",
    label: "Total Penerimaan Kas",
    value: "Rp 3.370.000.000",
    indent: 2,
  },
  { type: "label", label: "Pembayaran Kas:", indent: 1 },
  {
    type: "item",
    label: "Pembayaran kepada Pemasok",
    value: "-Rp 1.850.000.000",
    indent: 2,
  },
  {
    type: "item",
    label: "Pembayaran untuk Beban Operasional",
    value: "-Rp 650.000.000",
    indent: 2,
  },
  {
    type: "item",
    label: "Pembayaran Pajak",
    value: "-Rp 325.000.000",
    indent: 2,
  },
  {
    type: "item",
    label: "Pembayaran Bunga",
    value: "-Rp 125.000.000",
    indent: 2,
  },
  {
    type: "total",
    label: "Total Pembayaran Kas",
    value: "-Rp 2.950.000.000",
    indent: 2,
  },
  {
    type: "netPrimary",
    label: "Arus Kas Bersih dari Aktivitas Operasi",
    value: "Rp 420.000.000",
  },
  { type: "section", label: "Arus Kas Dari Aktivitas Pendanaan" },
  {
    type: "item",
    label: "Pembayaran Dividen",
    value: "-Rp 200.000.000",
    indent: 1,
  },
  {
    type: "item",
    label: "Penerimaan dari Penerbitan Saham",
    value: "Rp 500.000.000",
    indent: 1,
  },
  {
    type: "item",
    label: "Pembayaran Pinjaman Bank",
    value: "-Rp 300.000.000",
    indent: 1,
  },
  {
    type: "netPrimary",
    label: "Arus Kas Bersih dari Aktivitas Pendanaan",
    value: "Rp 0",
  },
  {
    type: "summaryGray",
    label: "Kenaikan/Penurunan Kas Bersih",
    value: "Rp 420.000.000",
  },
  {
    type: "plainBold",
    label: "Saldo Kas Awal Periode",
    value: "Rp 1.250.000.000",
  },
  {
    type: "finalPrimary",
    label: "Saldo Kas Akhir Periode",
    value: "Rp 1.670.000.000",
  },
];

const notes = [
  "Laporan ini disusun menggunakan metode langsung sesuai dengan Standar Akuntansi Keuangan yang berlaku.",
  "Aktivitas operasi termasuk transaksi yang terkait dengan produksi dan pengiriman barang atau jasa.",
  "Aktivitas pendanaan termasuk transaksi dengan pemilik dan kreditor perusahaan.",
];

const indentClass: Record<number, string> = {
  0: "",
  1: "pl-6",
  2: "pl-10",
};

const renderCashFlowRow = (row: CashFlowRow) => {
  if (row.type === "section") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell
          className="px-6 py-3 whitespace-nowrap text-xs font-bold uppercase tracking-wider"
          colSpan={2}
        >
          {row.label}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "label") {
    return (
      <TableRow key={row.label}>
        <TableCell
          className={cn(
            "px-6 py-3 whitespace-nowrap text-sm font-medium",
            indentClass[row.indent]
          )}
          colSpan={2}
        >
          {row.label}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "item") {
    return (
      <TableRow key={row.label}>
        <TableCell
          className={cn(
            "px-6 py-3 whitespace-nowrap text-sm",
            indentClass[row.indent]
          )}
        >
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "total") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell
          className={cn(
            "px-6 py-3 whitespace-nowrap text-sm font-bold",
            indentClass[row.indent]
          )}
        >
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "netPrimary") {
    return (
      <TableRow key={row.label} className="bg-muted/30">
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm font-bold text-primary">
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold text-primary">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  if (row.type === "summaryGray") {
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

  if (row.type === "plainBold") {
    return (
      <TableRow key={row.label} className="bg-card">
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold">
          {row.label}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
          {row.value}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={row.label} className="bg-primary text-primary-foreground">
      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold uppercase">
        {row.label}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
        {row.value}
      </TableCell>
    </TableRow>
  );
};

export default function ArusKasReportPage() {
  const [activePreset, setActivePreset] = useState("month");

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Laporan Arus Kas</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            01 Jan 2023 - 31 Jan 2023
          </span>
          <Button
            type="button"
            className="hidden sm:inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
            Pilih Tanggal
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-start">
        <SegmentedControl
          options={presetOptions}
          activeValue={activePreset}
          onChange={setActivePreset}
          className="overflow-x-auto"
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">Laporan Arus Kas (Metode Langsung)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Periode: 01 Jan 2023 - 31 Jan 2023
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium bg-card border-border text-muted-foreground hover:bg-muted/40"
            >
              <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
              Filter
            </Button>
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium bg-card border-border text-muted-foreground hover:bg-muted/40"
            >
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              Cetak
            </Button>
            <Button
              type="button"
              className="inline-flex h-auto items-center gap-0 px-4 py-2 text-sm font-medium shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Ekspor
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Deskripsi
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah (IDR)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card divide-y divide-border">
              {rows.map((row) => renderCashFlowRow(row))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-base font-bold mb-3">Catatan Laporan Arus Kas</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ol>
      </div>

      <ReportFooter updatedLabel="Terakhir diperbarui: 31 Januari 2023, 15:30" />
    </div>
  );
}
