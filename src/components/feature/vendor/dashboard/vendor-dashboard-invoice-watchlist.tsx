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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVendorBillingReport } from "./vendor-dashboard-hooks";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function VendorDashboardInvoiceWatchlist() {
  const {
    data: billing,
    error: billingError,
    isLoading,
    isFetching,
    refetch,
  } = useVendorBillingReport();

  const overdueInvoices = useMemo(
    () => ((billing?.overdue_invoices ?? []) as Invoice[]).slice(0, 10),
    [billing?.overdue_invoices]
  );

  const loading = isLoading && !billing;

  // Error State
  if (billingError) {
    return (
      <Card className="h-full min-h-[500px] flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Watchlist Invoice</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
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

  return (
    <Card className="h-full min-h-[500px] flex flex-col">
      <CardHeader className="flex flex-col gap-2 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Watchlist Invoice</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor invoice yang melewati jatuh tempo dan tindak lanjuti segera.
          </p>
        </div>
        {isFetching && (
          <div className="text-xs text-muted-foreground">Memperbarui data…</div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4 overflow-hidden">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : overdueInvoices.length ? (
          <ScrollArea className="max-h-[420px] pr-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead className="text-center">
                      Hari Terlambat
                    </TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueInvoices.map((invoice) => {
                    const dueDate = invoice.due_date
                      ? new Date(invoice.due_date)
                      : null;
                    const formattedDueDate = dueDate
                      ? format(dueDate, "d MMM yyyy")
                      : "-";
                    const overdueDays = dueDate
                      ? Math.max(
                          0,
                          differenceInCalendarDays(new Date(), dueDate)
                        )
                      : 0;
                    const tenantId = invoice.tenant_id;
                    const tenantLabel = tenantId
                      ? `Tenant #${tenantId}`
                      : "Tidak diketahui";
                    const amount = invoice.total ?? 0;

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.number}
                        </TableCell>
                        <TableCell>{tenantLabel}</TableCell>
                        <TableCell className="text-right">
                          {currencyFormatter.format(amount)}
                        </TableCell>
                        <TableCell>{formattedDueDate}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              overdueDays > 0 ? "destructive" : "secondary"
                            }
                          >
                            {overdueDays} hari
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Button asChild size="sm" variant="secondary">
                              <Link
                                href={`/vendor/invoices?highlight=${invoice.id}`}
                              >
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
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center rounded-lg border p-6 text-center text-sm text-muted-foreground">
            Semua invoice berada dalam kondisi baik. Tidak ada watchlist untuk
            ditampilkan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
