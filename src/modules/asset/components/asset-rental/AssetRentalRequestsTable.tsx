/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

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

import type { AssetRentalRequestsRow } from "../../types/asset-rental";

type AssetRentalRequestsTableProps = Readonly<{
  rows: AssetRentalRequestsRow[];
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  buildDetailHref?: (id: string) => string;
  actionDisabled?: boolean;
}>;

const statusStyles: Record<AssetRentalRequestsRow["status"], string> = {
  Menunggu:
    "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  Disetujui:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  Ditolak:
    "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
};

export function AssetRentalRequestsTable({
  rows,
  search,
  onSearchChange,
  status,
  onStatusChange,
  onApprove,
  onReject,
  buildDetailHref,
  actionDisabled = false,
}: AssetRentalRequestsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, rows],
  );

  const columns: ColumnDef<AssetRentalRequestsRow, unknown>[] = [
    {
      id: "requester",
      header: "Peminjam",
      meta: {
        headerClassName: "px-4 bg-slate-50",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900">
            {row.original.requesterName}
          </p>
          <p className="text-xs text-slate-500">{row.original.requesterUnit}</p>
          <Badge
            className={cn(
              "mt-1 rounded-full px-2 py-0.5 text-xs",
              statusStyles[row.original.status],
            )}
          >
            {row.original.status}
          </Badge>
        </div>
      ),
    },
    {
      id: "asset",
      header: "Aset yang Diajukan",
      meta: {
        headerClassName: "px-4",
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
          <p className="text-xs text-slate-500">
            {row.original.assetTypeLabel}
          </p>
        </div>
      ),
    },
    {
      id: "duration",
      header: "Durasi Sewa",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.startDate}</span>
          <span className="text-xs text-slate-400">
            s/d {row.original.endDate}
          </span>
        </div>
      ),
    },
    {
      id: "purpose",
      header: "Tujuan Pinjam",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.purpose,
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName: "px-4 text-right",
        cellClassName: "px-4 text-right",
      },
      cell: ({ row }) =>
        row.original.status === "Menunggu" ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              className="h-7 bg-indigo-600 px-3 text-xs text-white hover:bg-indigo-700"
              onClick={() => onApprove(row.original.id)}
              disabled={actionDisabled}
            >
              Setujui
            </Button>
            <Button
              variant="outline"
              className="h-7 border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
              onClick={() => onReject(row.original.id)}
              disabled={actionDisabled}
            >
              Tolak
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-500">
          Total Pengajuan Baru
        </p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {rows.length}
        </h3>
        <p className="mt-1 text-xs font-medium text-blue-600">
          Menunggu persetujuan
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <InputField
            ariaLabel="Cari aset atau nama peminjam"
            startIcon={<Search className="h-4 w-4" />}
            placeholder="Cari aset atau nama peminjam..."
            value={search}
            onValueChange={onSearchChange}
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] border-slate-200 bg-white">
            <SelectValue placeholder="Kategori Aset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Kategori Aset</SelectItem>
            <SelectItem value="Menunggu">Menunggu</SelectItem>
            <SelectItem value="Disetujui">Disetujui</SelectItem>
            <SelectItem value="Ditolak">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <TableShell
          columns={columns}
          data={pagedRows}
          getRowId={(row) => row.id}
          emptyState="Tidak ada pengajuan sewa."
          headerClassName="bg-slate-50"
        />
      </div>
    </div>
  );
}
