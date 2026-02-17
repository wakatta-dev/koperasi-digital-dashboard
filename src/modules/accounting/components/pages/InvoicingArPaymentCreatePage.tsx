/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAccountingArPaymentMutations } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  FeaturePaymentCreateForm,
  type FeaturePaymentCreateSubmitPayload,
} from "../features/FeaturePaymentCreateForm";

function parseNumericCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function InvoicingArPaymentCreatePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const paymentMutations = useAccountingArPaymentMutations();

  const handleSubmit = async (payload: FeaturePaymentCreateSubmitPayload) => {
    setErrorMessage(null);

    try {
      const amountReceived = parseNumericCurrency(payload.amount_received);
      const allocationCount = Math.max(payload.selected_invoice_numbers.length, 1);
      const baseAllocation = Math.floor(amountReceived / allocationCount);
      const remainder = amountReceived - baseAllocation * allocationCount;

      await paymentMutations.createPayment.mutateAsync({
        payload: {
          customer_name: payload.customer_name,
          payment_date: payload.payment_date,
          payment_method: payload.payment_method,
          destination_account: payload.destination_account,
          amount_received: amountReceived,
          allocations: payload.selected_invoice_numbers.map((invoiceNumber, index) => ({
            invoice_number: invoiceNumber,
            amount_applied: baseAllocation + (index === 0 ? remainder : 0),
          })),
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      toast.success("Payment recorded");
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
    <FeaturePaymentCreateForm
      onCancel={() => router.push(INVOICING_AR_ROUTES.creditNotesPayments)}
      onSubmit={handleSubmit}
      isSubmitting={paymentMutations.createPayment.isPending}
      errorMessage={errorMessage}
    />
  );
}
