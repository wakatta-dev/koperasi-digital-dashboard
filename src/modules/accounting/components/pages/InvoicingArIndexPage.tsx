/** @format */

"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import { FeatureInvoiceSummaryCards } from "../features/FeatureInvoiceSummaryCards";
import { FeatureInvoiceTable } from "../features/FeatureInvoiceTable";

export function InvoicingArIndexPage() {
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
      <FeatureInvoiceTable
        getInvoiceHref={(row) => INVOICING_AR_ROUTES.invoiceDetail(row.invoice_number)}
      />
    </div>
  );
}
