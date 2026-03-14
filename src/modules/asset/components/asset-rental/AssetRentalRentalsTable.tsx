/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Funnel, Search } from "lucide-react";

import { InputField } from "@/components/shared/inputs/input-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableShell } from "@/components/shared/data-display/TableShell";
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
  "Menunggu Pembayaran":
    "border border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Menunggu Verifikasi Pembayaran":
    "border border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
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
    const header = [
      "Nama Aset",
      "Peminjam",
      "Unit",
      "Tanggal Mulai",
      "Tanggal Kembali",
      "Status",
    ];
    const body = rows.map((row) => [
      row.assetName,
      row.borrowerName,
      row.borrowerUnit,
      row.startDate,
      row.returnDate,
      row.status,
    ]);
    const csvContent = [header, ...body]
      .map((line) => line.map((item) => `"${item}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "penyewaan-aset.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const activeCount = rows.filter(
    (row) => row.status === "Berjalan" || row.status === "Terlambat",
  ).length;
  const dueSoonCount = rows.filter((row) => row.status !== "Selesai").length;

  const columns: ColumnDef<AssetRentalRentalsRow, unknown>[] = [
    {
      id: "assetName",
      header: "Nama Aset",
      meta: {
        headerClassName: "px-4 bg-slate-50",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          {buildDetailHref ? (
            <Link
              href={buildDetailHref(row.original.id)}
              className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
            >
              {row.original.assetName}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-slate-900">
              {row.original.assetName}
            </p>
          )}
          <p className="text-xs text-slate-500">{row.original.assetTag}</p>
        </div>
      ),
    },
    {
      id: "borrower",
      header: "Peminjam",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900">
            {row.original.borrowerName}
          </p>
          <p className="text-xs text-slate-500">{row.original.borrowerUnit}</p>
        </div>
      ),
    },
    {
      id: "startDate",
      header: "Tanggal Mulai",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.startDate,
    },
    {
      id: "returnDate",
      header: "Tanggal Kembali",
      meta: {
        headerClassName: "px-4",
      },
      cell: ({ row }) => (
        <div className="px-4 text-sm text-slate-600">{row.original.returnDate}</div>
      ),
    },
    {
      id: "status",
      header: "Status",
      meta: {
        align: "right",
        headerClassName: "px-4 text-right",
        cellClassName: "px-4 text-right",
      },
      cell: ({ row }) => (
        <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs", statusStyles[row.original.status])}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName: "px-4 text-right",
        cellClassName: "px-4 text-right",
      },
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-600"
          onClick={() => onRowAction?.(row.original.id)}
          disabled={actionDisabled}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">
            Total Penyewaan Aktif
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {activeCount}
          </h3>
          <p className="mt-1 text-xs font-medium text-emerald-600">
            Data berjalan saat ini
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">
            Pengembalian Hari Ini
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {dueSoonCount}
          </h3>
          <p className="mt-1 text-xs font-medium text-amber-600">
            Perlu perhatian segera
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <InputField
            ariaLabel="Cari aset, peminjam, atau ID"
            startIcon={<Search className="h-4 w-4" />}
            placeholder="Cari aset, peminjam, atau ID..."
            value={search}
            onValueChange={onSearchChange}
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
                <SelectItem value="Menunggu Pembayaran">
                  Menunggu Pembayaran
                </SelectItem>
                <SelectItem value="Menunggu Verifikasi Pembayaran">
                  Menunggu Verifikasi Pembayaran
                </SelectItem>
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
        <TableShell
          columns={columns}
          data={pagedRows}
          getRowId={(row) => row.id}
          emptyState="Tidak ada data penyewaan."
          headerClassName="bg-slate-50"
          headerRowClassName="hover:bg-slate-50"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <p>
            Menampilkan{" "}
            <span className="font-medium text-slate-900">
              {pagedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, rows.length)}
            </span>{" "}
            dari <span className="font-medium text-slate-900">{rows.length}</span>{" "}
            data
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 border-slate-200 px-3 text-slate-600"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
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
