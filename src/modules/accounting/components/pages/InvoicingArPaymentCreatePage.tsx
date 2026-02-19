/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAccountingArInvoices,
  useAccountingArPaymentMutations,
  useAccountingArPayments,
} from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  formatAccountingArCurrency,
  formatAccountingArDate,
  normalizeInvoiceStatus,
} from "../../utils/formatters";
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
  const invoicesQuery = useAccountingArInvoices({ page: 1, per_page: 100 });
  const paymentsQuery = useAccountingArPayments({ page: 1, per_page: 100 });

  const outstandingInvoices = useMemo(() => {
    return (invoicesQuery.data?.items ?? [])
      .filter((item) => normalizeInvoiceStatus(item.status) !== "Paid")
      .map((item) => ({
        invoice_number: item.invoice_number,
        due_date: formatAccountingArDate(item.due_date),
        amount_due: formatAccountingArCurrency(item.total_amount),
      }));
  }, [invoicesQuery.data?.items]);

  const customerOptions = useMemo(() => {
    const invoiceCustomers = (invoicesQuery.data?.items ?? []).map((item) =>
      item.customer_name.trim()
    );
    const paymentCustomers = (paymentsQuery.data?.items ?? []).map((item) =>
      item.customer.trim()
    );
    return Array.from(
      new Set([...invoiceCustomers, ...paymentCustomers].filter((name) => name.length > 0))
    );
  }, [invoicesQuery.data?.items, paymentsQuery.data?.items]);

  const paymentMethodOptions = useMemo(() => {
    return Array.from(
      new Set(
        (paymentsQuery.data?.items ?? [])
          .map((item) => item.method.trim())
          .filter((method) => method.length > 0)
      )
    );
  }, [paymentsQuery.data?.items]);

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
      outstandingInvoices={outstandingInvoices}
      customerOptions={customerOptions}
      paymentMethodOptions={paymentMethodOptions}
    />
  );
}
