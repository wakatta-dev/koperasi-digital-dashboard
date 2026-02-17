/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toDayBounds } from "@/lib/datetime";
import type { InventoryEvent } from "@/modules/marketplace/types";

type HistoryRow = {
  id: string;
  date: string;
  time: string;
  timestampValue?: number;
  type: "Penjualan" | "Restock" | "Penyesuaian";
  reference: string;
  delta: number;
  balance: number;
};

const parseTimestamp = (timestamp: string) => {
  const parts = timestamp.split(",");
  if (parts.length > 1) {
    return {
      date: parts[0].trim(),
      time: parts.slice(1).join(",").trim(),
    };
  }
  const tokens = timestamp.trim().split(" ");
  if (tokens.length >= 2) {
    return {
      date: tokens.slice(0, -2).join(" "),
      time: tokens.slice(-2).join(" "),
    };
  }
  return { date: timestamp, time: "00:00 WIB" };
};

const formatHistory = (entries: InventoryEvent[]): HistoryRow[] => {
  return entries.map((entry) => {
    const { date, time } = parseTimestamp(entry.timestamp);
    const type =
      entry.type === "increase"
        ? "Restock"
        : entry.type === "decrease"
          ? "Penjualan"
          : "Penyesuaian";
    return {
      id: entry.id,
      date: date || entry.timestamp,
      time: time || "00:00 WIB",
      timestampValue: entry.timestampValue,
      type,
      reference: entry.title,
      delta: entry.delta,
      balance: entry.remainingStock,
    };
  });
};

const badgeClass: Record<HistoryRow["type"], string> = {
  Penjualan: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Restock:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Penyesuaian:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export type ProductInventoryHistoryModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  sku: string;
  entries: InventoryEvent[];
}>;

export function ProductInventoryHistoryModal({
  open,
  onOpenChange,
  productName,
  sku,
  entries,
}: ProductInventoryHistoryModalProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activityType, setActivityType] = useState("Semua Aktivitas");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const rows = useMemo(() => {
    let data = formatHistory(entries);
    if (dateFrom || dateTo) {
      const fromBounds = toDayBounds(dateFrom);
      const toBounds = toDayBounds(dateTo);
      data = data.filter((row) => {
        if (!row.timestampValue) return true;
        if (fromBounds.startMs && row.timestampValue < fromBounds.startMs)
          return false;
        if (toBounds.endMs && row.timestampValue > toBounds.endMs) return false;
        return true;
      });
    }
    if (activityType !== "Semua Aktivitas") {
      data = data.filter((row) => row.type === activityType);
    }
    if (!searchValue.trim()) return data;
    const keyword = searchValue.toLowerCase();
    return data.filter((row) => row.reference.toLowerCase().includes(keyword));
  }, [entries, searchValue, activityType, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, activityType, searchValue, entries]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleExport = () => {
    const csvRows = [
      [
        "Tanggal",
        "Waktu",
        "Tipe Aktivitas",
        "Referensi",
        "Perubahan",
        "Stok Akhir",
      ],
      ...rows.map((row) => [
        row.date,
        row.time,
        row.type,
        row.reference,
        `${row.delta > 0 ? "+" : ""}${row.delta}`,
        String(row.balance),
      ]),
    ];
    const content = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "riwayat-inventaris.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-slate-900/60 backdrop-blur-sm"
        className="w-[calc(100vw-2rem)] !max-w-[calc(100vw-2rem)] xl:!max-w-[1260px] rounded-2xl border border-white/50 bg-white p-0 shadow-[0_30px_90px_rgba(2,6,23,0.5)] dark:border-slate-700 dark:bg-slate-900"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Riwayat Inventaris Lengkap
        </DialogTitle>
        <div className="flex h-[min(92vh,960px)] min-w-0 flex-col">
          <div className="min-w-0 space-y-6 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="inline-flex h-auto items-center px-0 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Detail
                  </Button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Riwayat Inventaris Lengkap
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Produk:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {productName}
                  </span>{" "}
                  ({sku})
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-900">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-7 min-w-0">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Rentang Tanggal
                  </label>
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    <InputField
                      ariaLabel="Tanggal mulai"
                      size="lg"
                      startIcon={<Calendar className="h-4 w-4" />}
                      type="date"
                      value={dateFrom}
                      onValueChange={setDateFrom}
                    />
                    <InputField
                      ariaLabel="Tanggal akhir"
                      size="lg"
                      startIcon={<Calendar className="h-4 w-4" />}
                      type="date"
                      value={dateTo}
                      onValueChange={setDateTo}
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 min-w-0">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Tipe Aktivitas
                  </label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger className="w-full rounded-lg border-gray-200 bg-white py-2.5 text-sm focus:border-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua Aktivitas">
                        Semua Aktivitas
                      </SelectItem>
                      <SelectItem value="Penjualan">Penjualan</SelectItem>
                      <SelectItem value="Restock">Restock</SelectItem>
                      <SelectItem value="Penyesuaian">Penyesuaian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-7 min-w-0">
                  <InputField
                    label="Cari Referensi"
                    labelClassName="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider"
                    size="lg"
                    startIcon={<Search className="h-4 w-4" />}
                    value={searchValue}
                    onValueChange={setSearchValue}
                    placeholder="ID Invoice / Gudang"
                  />
                </div>
                <div className="lg:col-span-5 flex items-end lg:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setActivityType("Semua Aktivitas");
                      setSearchValue("");
                    }}
                    className="h-[42px] rounded-lg px-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[920px] w-full text-left">
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Tanggal & Waktu
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Tipe Aktivitas
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Referensi
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">
                      Perubahan (+/-)
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
                      Stok Akhir
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pagedRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {row.date}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {row.time}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${badgeClass[row.type]}`}
                        >
                          {row.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm text-indigo-600 hover:underline font-medium break-words">
                          {row.reference}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`text-sm font-bold ${
                            row.delta >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {row.delta >= 0 ? "+" : ""}
                          {row.delta} Unit
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                        {row.balance} Unit
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Menampilkan {pagedRows.length} dari {rows.length} riwayat
                  ditemukan
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-slate-900 dark:text-white">
                    {page}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
