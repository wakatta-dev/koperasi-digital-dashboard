/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { STITCH_PRIMARY_ACCENT_CLASS } from "../../constants/stitch";
import { FeatureCreditNoteModal } from "../features/FeatureCreditNoteModal";
import { FeatureCreateInvoiceModal } from "../features/FeatureCreateInvoiceModal";
import { FeatureReceivePaymentModal } from "../features/FeatureReceivePaymentModal";

export function InvoicingArFeatureDemo() {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <section className="space-y-4" aria-label="Invoicing AR demo wrapper">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing (AR)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer invoices and accounts receivable.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" className={STITCH_PRIMARY_ACCENT_CLASS} onClick={() => setInvoiceOpen(true)}>
          Create Invoice
        </Button>
        <Button type="button" variant="outline" onClick={() => setCreditOpen(true)}>
          Create Credit Note
        </Button>
        <Button type="button" variant="outline" onClick={() => setPaymentOpen(true)}>
          Record Payment
        </Button>
      </div>

      <FeatureCreateInvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} />
      <FeatureCreditNoteModal open={creditOpen} onOpenChange={setCreditOpen} />
      <FeatureReceivePaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} />
    </section>
  );
}
