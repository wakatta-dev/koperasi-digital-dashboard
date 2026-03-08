/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMarketplaceOrder, useMarketplaceOrders } from "@/hooks/queries/marketplace-orders";
import { getAssetRentalBookings } from "@/services/api/asset-rental";
import { getReservation } from "@/services/api/reservations";
import {
  buildOperationalTraceRows,
  filterOperationalTraceRows,
  getTraceProofUrl,
  summarizeOperationalTrace,
} from "@/modules/accounting/utils/operational-subledger";

const ACCOUNTING_STATUS_BADGE: Record<string, string> = {
  "Siap Ditinjau": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Belum Siap": "bg-amber-50 text-amber-700 border border-amber-200",
  Bermasalah: "bg-red-50 text-red-700 border border-red-200",
  "Tidak Perlu Posting": "bg-slate-50 text-slate-700 border border-slate-200",
};

const RECONCILIATION_BADGE: Record<string, string> = {
  Sesuai: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Perlu Tindak Lanjut": "bg-amber-50 text-amber-700 border border-amber-200",
};

export function FeatureOperationalTraceWorkbench() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "attention" | "matched">("all");

  const marketplaceOrdersQuery = useMarketplaceOrders({
    limit: 8,
    offset: 0,
  });

  const rentalBookingsQuery = useQuery({
    queryKey: ["asset-rental", "bookings", "accounting-trace"],
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat booking rental");
      }
      return response.data;
    },
  });

  const rows = useMemo(
    () =>
      buildOperationalTraceRows({
        marketplaceOrders: marketplaceOrdersQuery.data?.items,
        rentalBookings: rentalBookingsQuery.data,
      }),
    [marketplaceOrdersQuery.data?.items, rentalBookingsQuery.data],
  );
  const summary = useMemo(() => summarizeOperationalTrace(rows), [rows]);
  const visibleRows = useMemo(() => filterOperationalTraceRows(rows, filter), [filter, rows]);

  useEffect(() => {
    if (!rows.length) {
      setSelectedKey(null);
      return;
    }
    setSelectedKey((current) =>
      current && rows.some((row) => row.key === current) ? current : rows[0].key,
    );
  }, [rows]);

  useEffect(() => {
    if (!visibleRows.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !visibleRows.some((row) => row.key === selectedKey)) {
      setSelectedKey(visibleRows[0].key);
    }
  }, [selectedKey, visibleRows]);

  const selectedRow =
    visibleRows.find((row) => row.key === selectedKey) ?? visibleRows[0] ?? null;

  const marketplaceDetailQuery = useMarketplaceOrder(selectedRow?.domain === "marketplace" ? selectedRow.sourceId : undefined, {
    enabled: selectedRow?.domain === "marketplace",
  });

  const rentalDetailQuery = useQuery({
    queryKey: ["reservation-detail", "accounting-trace", selectedRow?.sourceId ?? ""],
    enabled: selectedRow?.domain === "rental",
    queryFn: async () => {
      const response = await getReservation(selectedRow?.sourceId ?? "");
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail reservasi");
      }
      return response.data;
    },
  });
  const proofUrl = getTraceProofUrl({
    domain: selectedRow?.domain ?? "marketplace",
    marketplaceDetail: marketplaceDetailQuery.data,
    rentalDetail: rentalDetailQuery.data,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Operational Subledger Trace</CardTitle>
              <p className="text-sm text-muted-foreground">
                Satu konteks kerja untuk menelusuri transaksi sumber, pembayaran, dan readiness accounting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Total {summary.total}</span>
              <span>Siap {summary.ready}</span>
              <span>Perlu tindak lanjut {summary.needsAttention}</span>
              <span>Sesuai {summary.matched}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Semua
            </Button>
            <Button
              variant={filter === "attention" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("attention")}
            >
              Perlu Rekonsiliasi
            </Button>
            <Button
              variant={filter === "matched" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("matched")}
            >
              Sinkron
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Referensi</TableHead>
                <TableHead>Status Operasional</TableHead>
                <TableHead>Status Pembayaran</TableHead>
                <TableHead>Status Accounting</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!visibleRows.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    Belum ada transaksi operasional yang dapat ditelusuri.
                  </TableCell>
                </TableRow>
              ) : null}
              {visibleRows.map((row) => (
                <TableRow key={row.key} data-selected={row.key === selectedRow?.key || undefined}>
                  <TableCell>{row.domain === "marketplace" ? "Marketplace" : "Rental"}</TableCell>
                  <TableCell className="font-medium">{row.reference}</TableCell>
                  <TableCell>{row.operationalStatus}</TableCell>
                  <TableCell>{row.paymentStatus}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge className={ACCOUNTING_STATUS_BADGE[row.accountingStatus] || ACCOUNTING_STATUS_BADGE["Belum Siap"]}>
                        {row.accountingStatus}
                      </Badge>
                      <Badge className={RECONCILIATION_BADGE[row.reconciliationStatus]}>
                        {row.reconciliationStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedKey(row.key)}>
                      Lihat Trace
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trace Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedRow ? (
            <p className="text-sm text-muted-foreground">
              Pilih transaksi untuk melihat hubungan operasional, pembayaran, dan accounting.
            </p>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Transaksi</p>
                <p className="mt-1 font-semibold">{selectedRow.title}</p>
                <p className="text-sm text-muted-foreground">{selectedRow.reference}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Status operasional: <span className="font-medium">{selectedRow.operationalStatus}</span></p>
                <p>Status pembayaran: <span className="font-medium">{selectedRow.paymentStatus}</span></p>
                <p>Status accounting: <span className="font-medium">{selectedRow.accountingStatus}</span></p>
                <p>Status rekonsiliasi: <span className="font-medium">{selectedRow.reconciliationStatus}</span></p>
                <p>Alasan/indikator: <span className="font-medium">{selectedRow.accountingReason}</span></p>
              </div>
              {proofUrl ? (
                <Button asChild variant="outline" size="sm">
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer">
                    Lihat Bukti Pembayaran
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Bukti pembayaran belum tersedia di transaksi terpilih.
                </p>
              )}
              <Button asChild variant="ghost" className="px-0">
                <Link href={selectedRow.detailHref}>Buka detail transaksi</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
