/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { InputField } from "@/components/shared/inputs/input-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { cn } from "@/lib/utils";

import type { AssetRentalReturnsRow } from "../../types/asset-rental";

type AssetRentalReturnsTableProps = Readonly<{
  rows: AssetRentalReturnsRow[];
  search: string;
  onSearchChange: (value: string) => void;
  onProcess: (id: string) => void;
  buildDetailHref?: (id: string) => string;
  actionDisabled?: boolean;
}>;

const statusStyles: Record<AssetRentalReturnsRow["status"], string> = {
  "Menunggu Pengembalian":
    "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  Diproses:
    "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Selesai:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export function AssetRentalReturnsTable({
  rows,
  search,
  onSearchChange,
  onProcess,
  buildDetailHref,
  actionDisabled = false,
}: AssetRentalReturnsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, rows],
  );

  const columns: ColumnDef<AssetRentalReturnsRow, unknown>[] = [
    {
      id: "borrower",
      header: "Peminjam",
      meta: {
        headerClassName: "px-4 bg-slate-50",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900">
            {row.original.borrowerName}
          </p>
        </div>
      ),
    },
    {
      id: "asset",
      header: "Aset",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4",
      },
      cell: ({ row }) =>
        buildDetailHref ? (
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
        ),
    },
    {
      id: "dueDate",
      header: "Tanggal Kembali (Rencana)",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.dueDate,
    },
    {
      id: "status",
      header: "Status Fisik",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs",
            statusStyles[row.original.status],
          )}
        >
          {row.original.status === "Diproses" ? "Menunggu Cek" : row.original.status}
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
          className="h-7 bg-indigo-600 px-3 text-xs text-white hover:bg-indigo-700"
          onClick={() => onProcess(row.original.id)}
          disabled={actionDisabled}
        >
          Proses Kembali
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-500">Menunggu Pengecekan</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{rows.length}</h3>
        <p className="mt-1 text-xs font-medium text-blue-600">
          Perlu verifikasi fisik
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="w-full sm:max-w-sm">
          <InputField
            ariaLabel="Cari aset atau nama peminjam"
            startIcon={<Search className="h-4 w-4" />}
            placeholder="Cari aset atau nama peminjam..."
            value={search}
            onValueChange={onSearchChange}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <TableShell
          columns={columns}
          data={pagedRows}
          getRowId={(row) => row.id}
          emptyState="Tidak ada data pengembalian."
          headerClassName="bg-slate-50"
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
