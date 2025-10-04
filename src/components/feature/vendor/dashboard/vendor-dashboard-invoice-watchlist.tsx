/** @format */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format, differenceInCalendarDays } from "date-fns";

import type { Invoice } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

export function VendorDashboardInvoiceWatchlist() {
  const { data: billing, error: billingError, isLoading, isFetching, refetch } =
    useVendorBillingReport();

  const overdueInvoices = useMemo(
    () => ((billing?.overdue_invoices ?? []) as Invoice[]).slice(0, 10),
    [billing?.overdue_invoices],
  );

  if (billingError) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Watchlist Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <span>Tidak dapat mengambil daftar invoice yang terlambat.</span>
            <Button size="sm" variant="outline" onClick={() => void refetch()}>
              Coba lagi
            </Button>
          </div>
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
          {isFetching ? <span>Memperbarui data…</span> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : overdueInvoices.length ? (
          <div className="overflow-x-auto">
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
              <TableBody className="block max-h-72 overflow-y-auto">
                {overdueInvoices.map((invoice) => {
                  const dueDate = invoice.due_date
                    ? new Date(invoice.due_date)
                    : null;
                  const formattedDueDate = dueDate
                    ? format(dueDate, "d MMM yyyy")
                    : "-";
                  const overdueDays = dueDate
                    ? Math.max(0, differenceInCalendarDays(new Date(), dueDate))
                    : 0;
                  const tenantId = invoice.tenant_id;
                  const tenantLabel = tenantId
                    ? `Tenant #${tenantId}`
                    : "Tidak diketahui";
                  const amount = invoice.total ?? 0;

                  return (
                    <TableRow
                      key={invoice.id}
                      className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.3fr] items-center gap-3 border-b last:border-b-0 md:table-row md:gap-0"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{invoice.number}</span>
                          {invoice.description ? (
                            <span className="text-xs text-muted-foreground">
                              {invoice.description}
                            </span>
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
                            <Link href={`/vendor/invoices/${invoice.id}`}>
                              Detail
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
