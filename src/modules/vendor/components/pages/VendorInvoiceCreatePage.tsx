/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FeatureCreateInvoiceForm,
  type FeatureCreateInvoiceSubmitPayload,
} from "@/modules/accounting";
import { useAccountingArInvoiceMutations, useAccountingArInvoices } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";
import { VENDOR_ROUTES } from "../../constants/routes";

function parseNumericCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function VendorInvoiceCreatePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const invoiceMutations = useAccountingArInvoiceMutations();
  const invoicesQuery = useAccountingArInvoices({ page: 1, per_page: 100 });

  const customerOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (invoicesQuery.data?.items ?? [])
            .map((item) => item.customer_name.trim())
            .filter(Boolean)
        )
      ),
    [invoicesQuery.data?.items]
  );

  const productOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (invoicesQuery.data?.items ?? [])
            .map((item) => `Invoice Ref ${item.invoice_number}`)
            .filter(Boolean)
        )
      ),
    [invoicesQuery.data?.items]
  );

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
      router.push(VENDOR_ROUTES.invoiceDetail(created.invoice_number));
    } catch (error) {
      const parsed = toAccountingArApiError(error);
      setErrorMessage(parsed.message);
    }
  };

  return (
    <FeatureCreateInvoiceForm
      onCancel={() => router.push(VENDOR_ROUTES.invoices)}
      onSubmit={handleSubmit}
      isSubmitting={invoiceMutations.createInvoice.isPending}
      errorMessage={errorMessage}
      customerOptions={customerOptions}
      productOptions={productOptions}
    />
  );
}
