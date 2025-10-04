/** @format */

"use client";

import { useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { format, differenceInCalendarDays } from "date-fns";

import { ensureSuccess } from "@/lib/api";
import { swrRateLimitOptions } from "@/lib/rate-limit";
import { getVendorInvoice } from "@/services/api";
import type { Invoice } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const {
    data: billing,
    error: billingError,
    isLoading,
    isValidating,
    mutate,
  } = useVendorBillingReport();

  const overdueInvoices = useMemo(
    () => billing?.overdue_invoices ?? [],
    [billing?.overdue_invoices],
  );
  const invoiceIds = useMemo(
    () => overdueInvoices.map((invoice) => invoice.id),
    [overdueInvoices],
  );

  const {
    data: invoiceDetails = [],
    error: invoiceError,
    isLoading: detailsLoading,
    mutate: mutateInvoiceDetails,
  } = useSWR<Invoice[]>(
    invoiceIds.length
      ? ["vendor-dashboard", "invoice-details", invoiceIds.join(",")]
      : null,
    async () => {
      const responses = await Promise.all(
        invoiceIds.map(async (id) => ensureSuccess(await getVendorInvoice(id))),
      );
      return responses;
    },
    {
      ...swrRateLimitOptions,
      revalidateOnFocus: false,
    },
  );

  const detailMap = useMemo(() => {
    const map = new Map<number, Invoice>();
    for (const detail of invoiceDetails ?? []) {
      if (detail?.id) map.set(detail.id, detail);
    }
    return map;
  }, [invoiceDetails]);

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
              <Button size="sm" variant="outline" onClick={() => mutate()}>
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
          {isValidating ? <span>Memperbarui data…</span> : null}
          {invoiceError ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void mutate();
                void mutateInvoiceDetails();
              }}
            >
              Muat ulang
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {invoiceError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Detail invoice tidak dapat dimuat. Anda tetap dapat melihat ringkasan dasar.
            </AlertDescription>
          </Alert>
        ) : null}

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
              <TableBody>
                {overdueInvoices.map((invoice) => {
                  const detail = detailMap.get(invoice.id);
                  const dueDate = invoice.due_date
                    ? new Date(invoice.due_date)
                    : detail?.due_date
                    ? new Date(detail.due_date)
                    : null;
                  const formattedDueDate = dueDate
                    ? format(dueDate, "d MMM yyyy")
                    : "-";
                  const overdueDays = dueDate
                    ? Math.max(0, differenceInCalendarDays(new Date(), dueDate))
                    : 0;
                  const tenantId = detail?.tenant_id ?? invoice.tenant_id;
                  const tenantLabel = `Tenant #${tenantId}`;
                  const amount = detail?.total ?? invoice.total ?? 0;

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{invoice.number}</span>
                          {detail?.subscription?.plan?.name ? (
                            <span className="text-xs text-muted-foreground">
                              {detail.subscription.plan.name}
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
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                          >
                            <a
                              href={`mailto:?subject=Follow up Invoice ${invoice.number}`}
                              rel="noreferrer"
                            >
                              Hubungi
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : detailsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
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
