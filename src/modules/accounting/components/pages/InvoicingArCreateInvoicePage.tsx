/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useAccountingArInvoiceMutations, useAccountingArInvoices } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  FeatureCreateInvoiceForm,
  type FeatureCreateInvoiceSubmitPayload,
} from "../features/FeatureCreateInvoiceForm";

function parseNumericCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function InvoicingArCreateInvoicePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const invoiceMutations = useAccountingArInvoiceMutations();
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

  const productOptions = useMemo(() => {
    return Array.from(
      new Set(
        (invoicesQuery.data?.items ?? [])
          .map((item) => `Invoice Ref ${item.invoice_number}`)
          .filter((value) => value.length > 0)
      )
    );
  }, [invoicesQuery.data?.items]);

  const handleSubmit = async (payload: FeatureCreateInvoiceSubmitPayload) => {
    setErrorMessage(null);

    try {
      const created = await invoiceMutations.createInvoice.mutateAsync({
        payload: {
          customer_name: payload.customer_query,
          invoice_date: payload.invoice_date,
          due_date: payload.due_date,
          line_items: payload.line_items.map((item) => ({
            product_or_service: item.product_or_service,
            description: item.description,
            qty: item.qty,
            price: parseNumericCurrency(item.price),
            tax_percent: Number(item.tax.replaceAll("%", "")) || 0,
          })),
          notes: payload.notes,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      toast.success("Invoice created");
      router.push(INVOICING_AR_ROUTES.invoiceDetail(created.invoice_number));
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
    <FeatureCreateInvoiceForm
      onCancel={() => router.push(INVOICING_AR_ROUTES.index)}
      onSubmit={handleSubmit}
      isSubmitting={invoiceMutations.createInvoice.isPending}
      errorMessage={errorMessage}
      customerOptions={customerOptions}
      productOptions={productOptions}
    />
  );
}
