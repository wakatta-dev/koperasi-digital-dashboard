/** @format */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { KpiCards, type KpiItem } from "@/components/shared/data-display/KpiCards";
import { Button } from "@/components/ui/button";
import { useAccountingArInvoices } from "@/hooks/queries";
import { FeatureInvoiceTable } from "@/modules/accounting";
import type { InvoiceStatus } from "@/modules/accounting";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { formatVendorCurrency, formatVendorDate } from "../../utils/format";

function normalizeInvoiceStatus(status: string): InvoiceStatus {
  return status === "Draft" || status === "Sent" || status === "Paid" || status === "Overdue"
    ? status
    : "Draft";
}

export function VendorInvoicesPage() {
  const invoicesQuery = useAccountingArInvoices({ page: 1, per_page: 20 });
  const items = useMemo(() => invoicesQuery.data?.items ?? [], [invoicesQuery.data?.items]);

  const rows = useMemo(
    () =>
      items.map((item) => ({
        invoice_number: item.invoice_number,
        customer_name: item.customer_name,
        invoice_date: formatVendorDate(item.invoice_date),
        due_date: formatVendorDate(item.due_date),
        total_amount: formatVendorCurrency(item.total_amount),
        status: normalizeInvoiceStatus(item.status),
      })),
    [items]
  );

  const kpiItems = useMemo<KpiItem[]>(() => {
    const summary = {
      Draft: { count: 0, amount: 0 },
      Sent: { count: 0, amount: 0 },
      Paid: { count: 0, amount: 0 },
      Overdue: { count: 0, amount: 0 },
    };
    items.forEach((item) => {
      const key = normalizeInvoiceStatus(item.status);
      summary[key].count += 1;
      summary[key].amount += item.total_amount;
    });
    return [
      {
        id: "draft",
        label: "Draft",
        value: formatVendorCurrency(summary.Draft.amount),
        footer: <p className="text-xs text-muted-foreground">{summary.Draft.count} invoice</p>,
      },
      {
        id: "sent",
        label: "Sent",
        value: formatVendorCurrency(summary.Sent.amount),
        footer: <p className="text-xs text-muted-foreground">{summary.Sent.count} invoice</p>,
      },
      {
        id: "paid",
        label: "Paid",
        value: formatVendorCurrency(summary.Paid.amount),
        footer: <p className="text-xs text-muted-foreground">{summary.Paid.count} invoice</p>,
      },
      {
        id: "overdue",
        label: "Overdue",
        value: formatVendorCurrency(summary.Overdue.amount),
        footer: <p className="text-xs text-muted-foreground">{summary.Overdue.count} invoice</p>,
      },
    ];
  }, [items]);

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Invoices"
        description="Kelola invoice SaaS billing dengan list, detail, send ulang, dan unduh PDF."
        actions={
          <Button asChild>
            <Link href={VENDOR_ROUTES.invoiceCreate}>Create Invoice</Link>
          </Button>
        }
      />

      {invoicesQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(invoicesQuery.error as Error).message}
        </div>
      ) : null}

      <KpiCards
        items={kpiItems}
        isLoading={invoicesQuery.isPending}
        isError={Boolean(invoicesQuery.error)}
        emptyState={
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
            Invoice summary belum tersedia.
          </div>
        }
      />

      <FeatureInvoiceTable
        rows={rows}
        getInvoiceHref={(row) => VENDOR_ROUTES.invoiceDetail(row.invoice_number)}
      />
    </div>
  );
}
