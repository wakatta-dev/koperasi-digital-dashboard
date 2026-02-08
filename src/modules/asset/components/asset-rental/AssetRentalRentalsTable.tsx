/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EllipsisVertical, Funnel, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

import type { AssetRentalRentalsRow } from "../../types/asset-rental";

type AssetRentalRentalsTableProps = Readonly<{
  rows: AssetRentalRentalsRow[];
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onRowAction?: (id: string) => void;
  buildDetailHref?: (id: string) => string;
  actionDisabled?: boolean;
}>;

const statusStyles: Record<AssetRentalRentalsRow["status"], string> = {
  Berjalan:
    "border border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Terlambat:
    "border border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
  Selesai:
    "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

export function AssetRentalRentalsTable({
  rows,
  search,
  onSearchChange,
  status,
  onStatusChange,
  onRowAction,
  buildDetailHref,
  actionDisabled = false,
}: AssetRentalRentalsTableProps) {
  const [showStatusFilter, setShowStatusFilter] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const pagedRows = useMemo(() => {
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const current = Math.min(page, pageCount);
    return rows.slice((current - 1) * pageSize, current * pageSize);
  }, [page, rows]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const exportRowsAsCsv = () => {
    if (typeof window === "undefined") return;
    const header = ["Nama Aset", "Peminjam", "Unit", "Tanggal Mulai", "Tanggal Kembali", "Status"];
    const body = rows.map((row) => [
      row.assetName,
      row.borrowerName,
      row.borrowerUnit,
      row.startDate,
      row.returnDate,
      row.status,
    ]);
    const csvContent = [header, ...body].map((line) => line.map((item) => `"${item}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "penyewaan-aset.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const activeCount = rows.filter((row) => row.status === "Berjalan").length;
  const dueSoonCount = rows.filter((row) => row.status !== "Selesai").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Total Penyewaan Aktif</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{activeCount}</h3>
          <p className="mt-1 text-xs font-medium text-emerald-600">Data berjalan saat ini</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Pengembalian Hari Ini</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{dueSoonCount}</h3>
          <p className="mt-1 text-xs font-medium text-amber-600">Perlu perhatian segera</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari aset, peminjam, atau ID..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 border-slate-200 bg-white pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showStatusFilter ? (
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px] border-slate-200 bg-white">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                <SelectItem value="Berjalan">Berjalan</SelectItem>
                <SelectItem value="Terlambat">Terlambat</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
          <Button
            variant="outline"
            className="gap-2 border-slate-200 bg-white"
            onClick={() => setShowStatusFilter((value) => !value)}
          >
            <Funnel className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 bg-white"
            onClick={exportRowsAsCsv}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="px-4">Nama Aset</TableHead>
              <TableHead className="px-4">Peminjam</TableHead>
              <TableHead className="px-4">Tanggal Mulai</TableHead>
              <TableHead className="px-4">Tanggal Kembali</TableHead>
              <TableHead className="px-4 text-right">Status</TableHead>
              <TableHead className="px-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data penyewaan.
                </TableCell>
              </TableRow>
            ) : null}
            {pagedRows.map((row) => (
              <TableRow key={row.id} className="bg-white">
                <TableCell className="px-4">
                  <div className="space-y-1">
                    {buildDetailHref ? (
                      <Link
                        href={buildDetailHref(row.id)}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {row.assetName}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900">{row.assetName}</p>
                    )}
                    <p className="text-xs text-slate-500">{row.assetTag}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{row.borrowerName}</p>
                    <p className="text-xs text-slate-500">{row.borrowerUnit}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4 text-sm text-slate-600">{row.startDate}</TableCell>
                <TableCell
                  className={cn(
                    "px-4 text-sm",
                    row.status === "Terlambat" ? "font-medium text-red-500" : "text-slate-600"
                  )}
                >
                  {row.returnDate}
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Badge className={cn("rounded-full px-2.5 py-1 text-xs", statusStyles[row.status])}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-indigo-600"
                    onClick={() => onRowAction?.(row.id)}
                    disabled={actionDisabled}
                  >
                    <EllipsisVertical className="h-4 w-4" />
                    <span className="sr-only">Aksi</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <p>
            Menampilkan{" "}
            <span className="font-medium text-slate-900">
              {pagedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, rows.length)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-900">{rows.length}</span> data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 border-slate-200 px-3 text-slate-500"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-8 border-slate-200 px-3 text-slate-700"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
