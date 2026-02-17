/** @format */

"use client";

import { useMemo } from "react";

import { useAccountingArCreditNotes, useAccountingArPayments } from "@/hooks/queries";
import { toAccountingArApiError } from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  formatAccountingArCurrency,
  formatAccountingArDate,
  normalizeCreditNoteStatus,
  normalizePaymentStatus,
} from "../../utils/formatters";
import { FeatureCreditNotesTable } from "../features/FeatureCreditNotesTable";
import { FeaturePaymentsTable } from "../features/FeaturePaymentsTable";

export function InvoicingArCreditNotesPaymentsPage() {
  const creditNotesQuery = useAccountingArCreditNotes({ page: 1, per_page: 20 });
  const paymentsQuery = useAccountingArPayments({ page: 1, per_page: 20 });

  const creditNotesRows = useMemo(
    () =>
      (creditNotesQuery.data?.items ?? []).map((item) => ({
        date: formatAccountingArDate(item.date),
        credit_note_number: item.credit_note_number,
        invoice_number: item.invoice_number,
        customer: item.customer,
        amount: formatAccountingArCurrency(item.amount),
        status: normalizeCreditNoteStatus(item.status),
      })),
    [creditNotesQuery.data?.items]
  );

  const paymentRows = useMemo(
    () =>
      (paymentsQuery.data?.items ?? []).map((item) => ({
        date: formatAccountingArDate(item.date),
        payment_number: item.payment_number,
        invoice_number: item.invoice_number,
        customer: item.customer,
        method: item.method,
        amount: formatAccountingArCurrency(item.amount),
        status: normalizePaymentStatus(item.status),
      })),
    [paymentsQuery.data?.items]
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Credit Notes &amp; Payments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer refunds, credit balances, and incoming payments.
        </p>
      </section>

      {creditNotesQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingArApiError(creditNotesQuery.error).message}
        </div>
      ) : null}

      <FeatureCreditNotesTable
        rows={creditNotesRows}
        createHref={INVOICING_AR_ROUTES.createCreditNote}
      />

      {paymentsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingArApiError(paymentsQuery.error).message}
        </div>
      ) : null}

      <FeaturePaymentsTable rows={paymentRows} createHref={INVOICING_AR_ROUTES.createPayment} />
    </div>
  );
}
