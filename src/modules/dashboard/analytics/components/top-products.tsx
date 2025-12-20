/** @format */

"use client";

import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
import type { ProductPerformance } from "@/types/api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/feedback/async-states";

type Props = {
  products?: (ProductPerformance & { low_stock?: boolean })[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export function TopProductsTable({ products, isLoading, isError, onRetry }: Props) {
  if (isLoading) return <LoadingState lines={5} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!products?.length)
    return (
      <EmptyState
        description="Tambahkan transaksi atau ubah rentang tanggal untuk melihat data."
        onRetry={onRetry}
      />
    );

  const sorted = [...products].sort((a, b) => b.units_sold - a.units_sold);

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 shadow-sm">
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold text-foreground">Produk Terlaris</h3>
        <p className="text-xs text-muted-foreground">
          Urut berdasarkan unit terjual dan stok tersisa.
        </p>
      </div>
      <TableShell containerClassName="overflow-x-auto" className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableCell as="th" scope="col" className="text-left font-medium">
              Nama Produk
            </TableCell>
            <TableCell as="th" scope="col" align="right" className="text-right font-medium">
              Terjual
            </TableCell>
            <TableCell as="th" scope="col" align="right" className="text-right font-medium">
              Stok Tersedia
            </TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {sorted.map((p) => (
            <TableRow
              key={p.product_id}
              className={p.low_stock ? "bg-amber-50 text-amber-900 dark:bg-amber-500/10" : undefined}
            >
              <TableCell className="font-medium">
                {p.name}
                {p.low_stock ? (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                    Menipis
                  </span>
                ) : null}
              </TableCell>
              <TableCell align="right" className="text-right tabular-nums">
                {p.units_sold.toLocaleString()}
              </TableCell>
              <TableCell align="right" className="text-right tabular-nums">
                {p.stock_available.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}
