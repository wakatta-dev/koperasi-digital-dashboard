/** @format */

"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAccountingArInvoices } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";
import { Button } from "@/components/ui/button";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import { FeatureInvoiceSummaryCards } from "../features/FeatureInvoiceSummaryCards";
import { FeatureInvoiceTable } from "../features/FeatureInvoiceTable";
import {
  formatAccountingArCurrency,
  formatAccountingArDate,
  normalizeInvoiceStatus,
} from "../../utils/formatters";

export function InvoicingArIndexPage() {
  const invoicesQuery = useAccountingArInvoices({ page: 1, per_page: 20 });

  const rows = useMemo(
    () =>
      (invoicesQuery.data?.items ?? []).map((item) => ({
        invoice_number: item.invoice_number,
        customer_name: item.customer_name,
        invoice_date: formatAccountingArDate(item.invoice_date),
        due_date: formatAccountingArDate(item.due_date),
        total_amount: formatAccountingArCurrency(item.total_amount),
        status: normalizeInvoiceStatus(item.status),
      })),
    [invoicesQuery.data?.items]
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing (AR)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer invoices and accounts receivable.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            <Link href={INVOICING_AR_ROUTES.createCreditNote}>Create Credit Note</Link>
          </Button>
          <Button asChild type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Link href={INVOICING_AR_ROUTES.createInvoice}>Create Invoice</Link>
          </Button>
          <Button asChild type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            <Link href={INVOICING_AR_ROUTES.createPayment}>Record Payment</Link>
          </Button>
        </div>
      </section>

      <FeatureInvoiceSummaryCards />

      {invoicesQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingArApiError(invoicesQuery.error).message}
        </div>
      ) : null}

      <FeatureInvoiceTable
        rows={rows}
        getInvoiceHref={(row) => INVOICING_AR_ROUTES.invoiceDetail(row.invoice_number)}
      />
    </div>
  );
}
