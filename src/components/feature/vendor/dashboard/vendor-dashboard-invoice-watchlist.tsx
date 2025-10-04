/** @format */

"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format, differenceInCalendarDays } from "date-fns";
import { Loader2 } from "lucide-react";

import { ensureSuccess } from "@/lib/api";
import { getVendorInvoice } from "@/services/api";
import type { Invoice } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVendorBillingReport } from "./vendor-dashboard-hooks";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const WATCHLIST_LIMIT = 8;

export function VendorDashboardInvoiceWatchlist() {
  const {
    data: billing,
    error: billingError,
    isLoading,
    isFetching,
    refetch,
  } = useVendorBillingReport();

  const overdueInvoices = useMemo(
    () => billing?.overdue_invoices ?? [],
    [billing?.overdue_invoices],
  );
  const limitedInvoices = useMemo(
    () => overdueInvoices.slice(0, WATCHLIST_LIMIT),
    [overdueInvoices],
  );
  const hasMoreInvoices = overdueInvoices.length > WATCHLIST_LIMIT;

  if (billingError) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Watchlist Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-3">
              <span>Tidak dapat mengambil daftar invoice yang terlambat.</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const loading = isLoading && !billing;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-2 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Watchlist Invoice</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor invoice yang melewati jatuh tempo dan tindak lanjuti segera.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isFetching && !isLoading ? <span>Memperbarui data…</span> : null}
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Muat ulang
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : limitedInvoices.length ? (
          <div className="space-y-3">
            <ScrollArea className="max-h-80 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Hari Terlambat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limitedInvoices.map((invoice) => (
                    <InvoiceWatchlistRow
                      key={invoice.id}
                      invoice={invoice}
                      onRefresh={() => refetch()}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {hasMoreInvoices ? (
              <p className="text-xs text-muted-foreground">
                Menampilkan {limitedInvoices.length} dari {overdueInvoices.length} invoice.
                Gunakan filter untuk mempersempit daftar.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            Semua invoice berada dalam kondisi baik. Tidak ada watchlist untuk ditampilkan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InvoiceWatchlistRow({
  invoice,
  onRefresh,
}: {
  invoice: Invoice;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const {
    data: detail,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vendor-dashboard", "invoice-detail", invoice.id],
    queryFn: async () => ensureSuccess(await getVendorInvoice(invoice.id)),
    enabled: expanded,
    staleTime: 5 * 60 * 1000,
  });

  const dueDate = invoice.due_date
    ? new Date(invoice.due_date)
    : detail?.due_date
    ? new Date(detail.due_date)
    : null;
  const formattedDueDate = dueDate ? format(dueDate, "d MMM yyyy") : "-";
  const overdueDays = dueDate
    ? Math.max(0, differenceInCalendarDays(new Date(), dueDate))
    : 0;
  const tenantId = detail?.tenant_id ?? invoice.tenant_id;
  const tenantLabel = tenantId ? `Tenant #${tenantId}` : "-";
  const amount = detail?.total ?? invoice.total ?? 0;
  const planName = detail?.subscription?.plan?.name;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex flex-col">
            <span>{invoice.number}</span>
            {planName ? (
              <span className="text-xs text-muted-foreground">{planName}</span>
            ) : null}
          </div>
        </TableCell>
        <TableCell>{tenantLabel}</TableCell>
        <TableCell className="text-right">
          {currencyFormatter.format(amount)}
        </TableCell>
        <TableCell>{formattedDueDate}</TableCell>
        <TableCell>
          <Badge variant="destructive">{overdueDays} hari</Badge>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href={`/vendor/invoices?highlight=${invoice.id}`}>
                Lihat Invoice
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={`mailto:?subject=Follow up Invoice ${invoice.number}`}
                rel="noreferrer"
              >
                Hubungi
              </a>
            </Button>
            <Button size="sm" variant="ghost" onClick={toggleExpanded}>
              {expanded ? "Tutup detail" : "Lihat detail"}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded ? (
        <TableRow className="bg-muted/40">
          <TableCell colSpan={6}>
            {isLoading || isFetching ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat detail invoice…
              </div>
            ) : isError ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-destructive">
                <span>
                  Detail invoice tidak dapat dimuat: {error instanceof Error ? error.message : "Terjadi kesalahan"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    Coba lagi
                  </Button>
                  <Button size="sm" variant="outline" onClick={onRefresh}>
                    Segarkan ringkasan
                  </Button>
                </div>
              </div>
            ) : detail ? (
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tagihan Untuk</p>
                  <p className="font-medium">{tenantLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    Plan: {planName ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Tagihan</p>
                  <p className="font-semibold">
                    {currencyFormatter.format(detail.total ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dibuat pada {detail.created_at ? format(new Date(detail.created_at), "d MMM yyyy") : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Kontak Penagihan</p>
                  <p>{detail.billing_contact ?? "Tidak tersedia"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">
                    {detail.status ?? "unknown"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Detail invoice tidak tersedia.
              </p>
            )}
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}

