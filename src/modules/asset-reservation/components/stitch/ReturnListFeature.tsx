/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { ReturnListItem } from "../../types/stitch";

type ReturnListFeatureProps = Readonly<{
  rows: ReturnListItem[];
  search: string;
  onSearchChange: (value: string) => void;
  onProcess: (id: string) => void;
  buildDetailHref?: (id: string) => string;
  actionDisabled?: boolean;
}>;

const statusStyles: Record<ReturnListItem["status"], string> = {
  "Menunggu Pengembalian":
    "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  Diproses:
    "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Selesai:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export function ReturnListFeature({
  rows,
  search,
  onSearchChange,
  onProcess,
  buildDetailHref,
  actionDisabled = false,
}: ReturnListFeatureProps) {
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
        <p className="text-sm font-medium text-slate-500">Menunggu Pengecekan</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{rows.length}</h3>
        <p className="mt-1 text-xs font-medium text-blue-600">Perlu verifikasi fisik</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari aset atau nama peminjam..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 border-slate-200 bg-white pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="px-4">Peminjam</TableHead>
              <TableHead className="px-4">Aset</TableHead>
              <TableHead className="px-4">Tanggal Kembali (Rencana)</TableHead>
              <TableHead className="px-4">Status Fisik</TableHead>
              <TableHead className="px-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data pengembalian.
                </TableCell>
              </TableRow>
            ) : null}
            {pagedRows.map((row) => (
              <TableRow key={row.id} className="bg-white">
                <TableCell className="px-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{row.borrowerName}</p>
                  </div>
                </TableCell>
                <TableCell className="px-4">
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
                </TableCell>
                <TableCell className="px-4 text-sm text-slate-600">{row.dueDate}</TableCell>
                <TableCell className="px-4">
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs", statusStyles[row.status])}>
                    {row.status === "Diproses" ? "Menunggu Cek" : row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Button
                    className="h-7 bg-indigo-600 px-3 text-xs text-white hover:bg-indigo-700"
                    onClick={() => onProcess(row.id)}
                    disabled={actionDisabled}
                  >
                    Proses Kembali
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
