/** @format */

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Produk</TableHead>
              <TableHead className="text-right">Terjual</TableHead>
              <TableHead className="text-right">Stok Tersedia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((p) => (
              <TableRow key={p.product_id} className={p.low_stock ? "bg-amber-50 text-amber-900 dark:bg-amber-500/10" : undefined}>
                <TableCell className="font-medium">
                  {p.name}
                  {p.low_stock ? (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                      Menipis
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">{p.units_sold.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.stock_available.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
