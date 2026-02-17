/** @format */

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DUMMY_CREDIT_NOTES,
  DUMMY_INVOICE_ITEMS,
  DUMMY_PAYMENTS,
} from "../../constants/dummy-data";
import { STITCH_PRIMARY_ACCENT_CLASS } from "../../constants/stitch";

export function InvoicingArFeatureDemo() {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const summary = useMemo(
    () => ({
      invoices: DUMMY_INVOICE_ITEMS.length,
      creditNotes: DUMMY_CREDIT_NOTES.length,
      payments: DUMMY_PAYMENTS.length,
    }),
    []
  );

  return (
    <section className="space-y-4" aria-label="Invoicing AR demo wrapper">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing (AR)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer invoices and accounts receivable.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{summary.invoices}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Credit Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{summary.creditNotes}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{summary.payments}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" className={STITCH_PRIMARY_ACCENT_CLASS} onClick={() => setInvoiceOpen((v) => !v)}>
          Create Invoice
        </Button>
        <Button type="button" variant="outline" onClick={() => setCreditOpen((v) => !v)}>
          Create Credit Note
        </Button>
        <Button type="button" variant="outline" onClick={() => setPaymentOpen((v) => !v)}>
          Record Payment
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
        <p>create_invoice modal: {invoiceOpen ? "open" : "closed"}</p>
        <p>create_credit_note modal: {creditOpen ? "open" : "closed"}</p>
        <p>record_payment modal: {paymentOpen ? "open" : "closed"}</p>
      </div>
    </section>
  );
}
