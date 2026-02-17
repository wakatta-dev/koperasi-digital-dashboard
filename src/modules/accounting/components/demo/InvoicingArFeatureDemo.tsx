/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { STITCH_PRIMARY_ACCENT_CLASS } from "../../constants/stitch";
import { FeatureCreateInvoiceForm } from "../features/FeatureCreateInvoiceForm";
import { FeatureCreditNoteCreateForm } from "../features/FeatureCreditNoteCreateForm";
import { FeaturePaymentCreateForm } from "../features/FeaturePaymentCreateForm";

type ActiveForm = "invoice" | "credit-note" | "payment";

export function InvoicingArFeatureDemo() {
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);

  return (
    <section className="space-y-4" aria-label="Invoicing AR demo wrapper">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing (AR)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer invoices and accounts receivable.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className={STITCH_PRIMARY_ACCENT_CLASS}
          onClick={() => setActiveForm("invoice")}
        >
          Create Invoice
        </Button>
        <Button type="button" variant="outline" onClick={() => setActiveForm("credit-note")}>
          Create Credit Note
        </Button>
        <Button type="button" variant="outline" onClick={() => setActiveForm("payment")}>
          Record Payment
        </Button>
      </div>

      {activeForm === "invoice" ? (
        <FeatureCreateInvoiceForm onCancel={() => setActiveForm(null)} onSubmit={() => {}} />
      ) : null}

      {activeForm === "credit-note" ? (
        <FeatureCreditNoteCreateForm onCancel={() => setActiveForm(null)} onSubmit={() => {}} />
      ) : null}

      {activeForm === "payment" ? (
        <FeaturePaymentCreateForm onCancel={() => setActiveForm(null)} onSubmit={() => {}} />
      ) : null}
    </section>
  );
}
