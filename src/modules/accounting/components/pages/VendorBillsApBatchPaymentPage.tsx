/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAccountingApBatchMutations, useAccountingApVendorCredits } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { DUMMY_BATCH_PAYMENT_BILLS } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { BatchPaymentBillItem, BatchPaymentDraft, VendorCreditNoteItem } from "../../types/vendor-bills-ap";
import { formatAccountingApCurrency, formatAccountingApDate } from "../../utils/formatters";
import { FeatureBatchPaymentDetailsCard } from "../features/FeatureBatchPaymentDetailsCard";
import { FeatureBatchProcessingNote } from "../features/FeatureBatchProcessingNote";
import { FeatureBatchSelectedBillsTable } from "../features/FeatureBatchSelectedBillsTable";
import { FeatureBatchVendorCreditsPanel } from "../features/FeatureBatchVendorCreditsPanel";

type VendorBillsApBatchPaymentPageProps = {
  preselectedBillNumbers?: string[];
};

export function VendorBillsApBatchPaymentPage({
  preselectedBillNumbers = [],
}: VendorBillsApBatchPaymentPageProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bills, setBills] = useState<BatchPaymentBillItem[]>(() =>
    DUMMY_BATCH_PAYMENT_BILLS.map((row) => ({
      ...row,
      is_selected:
        preselectedBillNumbers.length === 0
          ? row.is_selected
          : preselectedBillNumbers.includes(row.bill_number),
    }))
  );
  const [credits, setCredits] = useState<VendorCreditNoteItem[]>([]);
  const [draft, setDraft] = useState<BatchPaymentDraft>({
    pay_from: "BCA Corporate - 8821xxxx",
    payment_date: new Date().toISOString().slice(0, 10),
    reference_number: `BATCH-${new Date().getTime().toString().slice(-5)}`,
    total_bills_label: "Total Bills (0)",
    total_bills_amount: "Rp 0",
    credits_applied_amount: "- Rp 0",
    total_to_pay_amount: "Rp 0",
  });
  const vendorCreditsQuery = useAccountingApVendorCredits({
    page: 1,
    per_page: 25,
    active_only: true,
  });
  const batchMutations = useAccountingApBatchMutations();

  const selectedRows = useMemo(() => bills.filter((row) => row.is_selected), [bills]);

  useEffect(() => {
    if (!vendorCreditsQuery.data?.items) return;

    const mappedCredits = vendorCreditsQuery.data.items.map((item) => ({
      credit_note_number: item.credit_note_number,
      vendor_name: item.vendor_name,
      amount: formatAccountingApCurrency(item.remaining_amount),
      reason: item.reason,
      issued_at: `Issued: ${formatAccountingApDate(item.issued_at)}`,
      is_selected: false,
    }));

    setCredits((current) => {
      if (
        current.length === mappedCredits.length &&
        current.every((item, index) => {
          const next = mappedCredits[index];
          return (
            item.credit_note_number === next.credit_note_number &&
            item.vendor_name === next.vendor_name &&
            item.amount === next.amount &&
            item.reason === next.reason &&
            item.issued_at === next.issued_at &&
            item.is_selected === next.is_selected
          );
        })
      ) {
        return current;
      }
      return mappedCredits;
    });
  }, [vendorCreditsQuery.data?.items]);

  useEffect(() => {
    const selectedCredits = credits.filter((item) => item.is_selected);
    const selectedBillsAmount = selectedRows.reduce((total, row) => {
      const amount = Number(row.payment_amount.replace(/[^\d.-]/g, ""));
      return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
    const selectedCreditsAmount = selectedCredits.reduce((total, credit) => {
      const amount = Number(credit.amount.replace(/[^\d.-]/g, ""));
      return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    setDraft((current) => ({
      ...current,
      total_bills_label: `Total Bills (${selectedRows.length})`,
      total_bills_amount: formatAccountingApCurrency(selectedBillsAmount),
      credits_applied_amount: `- ${formatAccountingApCurrency(selectedCreditsAmount)}`,
      total_to_pay_amount: formatAccountingApCurrency(
        Math.max(selectedBillsAmount - selectedCreditsAmount, 0)
      ),
    }));
  }, [credits, selectedRows]);

  const handleConfirmBatchPayment = async () => {
    setErrorMessage(null);

    if (selectedRows.length === 0) {
      setErrorMessage("Please select at least one bill to process.");
      return;
    }

    try {
      const selectedCreditNumbers = credits
        .filter((item) => item.is_selected)
        .map((item) => item.credit_note_number);

      const preview = await batchMutations.previewBatchPayment.mutateAsync({
        bill_numbers: selectedRows.map((row) => row.bill_number),
        selected_credit_note_numbers: selectedCreditNumbers,
        payment_date: draft.payment_date,
        pay_from_account: draft.pay_from,
      });

      setDraft((current) => ({
        ...current,
        total_bills_label: `Total Bills (${preview.selected_bills.length})`,
        total_bills_amount: formatAccountingApCurrency(preview.totals.total_bills_amount),
        credits_applied_amount: `- ${formatAccountingApCurrency(preview.totals.credits_applied_amount)}`,
        total_to_pay_amount: formatAccountingApCurrency(preview.totals.total_to_pay_amount),
      }));

      const confirmed = await batchMutations.confirmBatchPayment.mutateAsync({
        payload: {
          batch_reference: draft.reference_number.trim(),
          pay_from_account: draft.pay_from,
          payment_date: draft.payment_date,
          items: selectedRows.map((row) => ({
            bill_number: row.bill_number,
            payment_amount: Number(row.payment_amount.replace(/[^\d.-]/g, "")) || 0,
          })),
          selected_credit_note_numbers: selectedCreditNumbers,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      toast.success("Batch payment scheduled");
      router.push(
        `${VENDOR_BILLS_AP_ROUTES.paymentConfirmation}?batch=${encodeURIComponent(confirmed.batch_reference)}`
      );
    } catch (err) {
      const parsed = toAccountingApApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Payment Review</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review selected vendor bills and apply credit notes before confirming payment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
            onClick={() => router.push(VENDOR_BILLS_AP_ROUTES.index)}
          >
            Cancel
          </Button>
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Save as Draft
          </Button>
        </div>
      </section>

      {vendorCreditsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(vendorCreditsQuery.error).message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <FeatureBatchSelectedBillsTable rows={bills} onRowsChange={setBills} />
          <FeatureBatchProcessingNote />
        </div>
        <div className="space-y-6">
          <FeatureBatchPaymentDetailsCard
            draft={draft}
            onDraftChange={setDraft}
            onConfirm={handleConfirmBatchPayment}
            isConfirming={batchMutations.confirmBatchPayment.isPending}
            confirmationDisabled={batchMutations.previewBatchPayment.isPending}
            errorMessage={errorMessage}
          />
          <FeatureBatchVendorCreditsPanel credits={credits} onCreditsChange={setCredits} />
        </div>
      </div>

      <p className="sr-only">Selected bill count: {selectedRows.length}</p>
    </div>
  );
}
