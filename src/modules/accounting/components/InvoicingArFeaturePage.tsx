/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { FeatureCreditNotesTable } from "./features/FeatureCreditNotesTable";
import { FeatureCreditNoteModal } from "./features/FeatureCreditNoteModal";
import { FeatureCreateInvoiceModal } from "./features/FeatureCreateInvoiceModal";
import { FeatureInvoiceDetailView } from "./features/FeatureInvoiceDetailView";
import { FeatureInvoiceSummaryCards } from "./features/FeatureInvoiceSummaryCards";
import { FeatureInvoiceTable } from "./features/FeatureInvoiceTable";
import { FeaturePaymentsTable } from "./features/FeaturePaymentsTable";
import { FeatureReceivePaymentModal } from "./features/FeatureReceivePaymentModal";

export function InvoicingArFeaturePage() {
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [createCreditNoteOpen, setCreateCreditNoteOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

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
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
            onClick={() => setCreateCreditNoteOpen(true)}
          >
            Create Credit Note
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setCreateInvoiceOpen(true)}
          >
            Create Invoice
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
            onClick={() => setRecordPaymentOpen(true)}
          >
            Record Payment
          </Button>
        </div>
      </section>

      <FeatureInvoiceSummaryCards />
      <FeatureInvoiceTable />

      <div className="space-y-6">
        <FeatureCreditNotesTable />
        <FeaturePaymentsTable />
      </div>

      <FeatureInvoiceDetailView />

      <FeatureCreateInvoiceModal open={createInvoiceOpen} onOpenChange={setCreateInvoiceOpen} />
      <FeatureCreditNoteModal open={createCreditNoteOpen} onOpenChange={setCreateCreditNoteOpen} />
      <FeatureReceivePaymentModal open={recordPaymentOpen} onOpenChange={setRecordPaymentOpen} />
    </div>
  );
}
