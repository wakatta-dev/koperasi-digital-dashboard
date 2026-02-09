/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    [currentPage, rows]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-500">Total Pengajuan Baru</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{rows.length}</h3>
        <p className="mt-1 text-xs font-medium text-blue-600">Menunggu persetujuan</p>
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
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="px-4">Peminjam</TableHead>
              <TableHead className="px-4">Aset yang Diajukan</TableHead>
              <TableHead className="px-4">Durasi Sewa</TableHead>
              <TableHead className="px-4">Tujuan Pinjam</TableHead>
              <TableHead className="px-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada pengajuan sewa.
                </TableCell>
              </TableRow>
            ) : null}
            {pagedRows.map((row) => (
              <TableRow key={row.id} className="bg-white">
                <TableCell className="px-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{row.requesterName}</p>
                    <p className="text-xs text-slate-500">{row.requesterUnit}</p>
                    <Badge className={cn("mt-1 rounded-full px-2 py-0.5 text-xs", statusStyles[row.status])}>
                      {row.status}
                    </Badge>
                  </div>
                </TableCell>
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
                    <p className="text-xs text-slate-500">{row.assetTypeLabel}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <span>{row.startDate}</span>
                    <span className="text-xs text-slate-400">s/d {row.endDate}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 text-sm text-slate-600">{row.purpose}</TableCell>
                <TableCell className="px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      className="h-7 bg-indigo-600 px-3 text-xs text-white hover:bg-indigo-700"
                      onClick={() => onApprove(row.id)}
                      disabled={actionDisabled}
                    >
                      Setujui
                    </Button>
                    <Button
                      variant="outline"
                      className="h-7 border-red-200 bg-transparent px-3 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => onReject(row.id)}
                      disabled={actionDisabled}
                    >
                      Tolak
                    </Button>
                  </div>
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
