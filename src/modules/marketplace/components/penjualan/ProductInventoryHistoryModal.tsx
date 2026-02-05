/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Restock: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Penyesuaian: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
      const from = dateFrom ? new Date(dateFrom).getTime() : null;
      const to = dateTo ? new Date(dateTo).getTime() : null;
      data = data.filter((row) => {
        if (!row.timestampValue) return true;
        if (from && row.timestampValue < from) return false;
        if (to) {
          const endOfDay = to + 24 * 60 * 60 * 1000 - 1;
          if (row.timestampValue > endOfDay) return false;
        }
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
      ["Tanggal", "Waktu", "Tipe Aktivitas", "Referensi", "Perubahan", "Stok Akhir"],
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
        overlayClassName="bg-gray-900/40 backdrop-blur-[2px]"
        className="bg-background-light dark:bg-background-dark w-full max-w-6xl rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Riwayat Inventaris Lengkap</DialogTitle>
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center text-sm font-medium h-auto px-0"
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
                  className="px-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px]">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Rentang Tanggal
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2.5 pl-10 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2.5 pl-10 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="w-48">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Tipe Aktivitas
                  </label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2.5 focus:ring-indigo-600 focus:border-indigo-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua Aktivitas">Semua Aktivitas</SelectItem>
                      <SelectItem value="Penjualan">Penjualan</SelectItem>
                      <SelectItem value="Restock">Restock</SelectItem>
                      <SelectItem value="Penyesuaian">Penyesuaian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Cari Referensi
                  </label>
                  <div className="relative">
                    <Input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="ID Invoice / Gudang"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm py-2.5 pl-10 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-end self-end h-[42px]">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setActivityType("Semua Aktivitas");
                      setSearchValue("");
                    }}
                    className="h-full px-5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table className="w-full text-left">
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
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-indigo-600 hover:underline font-medium">
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
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Menampilkan {pagedRows.length} dari {rows.length} riwayat ditemukan
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
                <span className="text-sm font-medium text-gray-900 dark:text-white px-3 py-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md">
                  {page}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
