/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useAccountingArCreditNoteMutations, useAccountingArInvoices } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  FeatureCreditNoteCreateForm,
  type FeatureCreditNoteCreateSubmitPayload,
} from "../features/FeatureCreditNoteCreateForm";

function parseNumericCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function InvoicingArCreditNoteCreatePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const creditNoteMutations = useAccountingArCreditNoteMutations();
  const invoicesQuery = useAccountingArInvoices({ page: 1, per_page: 100 });

  const customerOptions = useMemo(() => {
    return Array.from(
      new Set(
        (invoicesQuery.data?.items ?? [])
          .map((item) => item.customer_name.trim())
          .filter((name) => name.length > 0)
      )
    );
  }, [invoicesQuery.data?.items]);

  const invoiceReferenceOptions = useMemo(() => {
    return Array.from(
      new Set(
        (invoicesQuery.data?.items ?? [])
          .map((item) => item.invoice_number.trim())
          .filter((number) => number.length > 0)
      )
    );
  }, [invoicesQuery.data?.items]);

  const handleSubmit = async (payload: FeatureCreditNoteCreateSubmitPayload) => {
    setErrorMessage(null);

    try {
      await creditNoteMutations.createCreditNote.mutateAsync({
        payload: {
          customer_name: payload.customer_name,
          credit_note_date: payload.credit_note_date,
          original_invoice_reference: payload.original_invoice_reference,
          reason_for_credit: payload.reason_for_credit,
          items: payload.items.map((item) => ({
            item_name: item.item_name,
            qty: item.qty,
            rate: parseNumericCurrency(item.rate),
          })),
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      toast.success("Credit note created");
      router.push(INVOICING_AR_ROUTES.creditNotesPayments);
    } catch (err) {
      const parsed = toAccountingArApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422) {
        setErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <FeatureCreditNoteCreateForm
      onCancel={() => router.push(INVOICING_AR_ROUTES.creditNotesPayments)}
      onSubmit={handleSubmit}
      isSubmitting={creditNoteMutations.createCreditNote.isPending}
      errorMessage={errorMessage}
      customerOptions={customerOptions}
      invoiceReferenceOptions={invoiceReferenceOptions}
    />
  );
}
