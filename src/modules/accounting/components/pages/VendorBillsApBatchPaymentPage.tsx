/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAccountingApBatchMutations,
  useAccountingApBills,
  useAccountingApVendorCredits,
} from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import { buildInitialBatchPaymentDraft } from "../../constants/vendor-bills-ap-initial-state";
import type { BatchPaymentBillItem, BatchPaymentDraft, VendorCreditNoteItem } from "../../types/vendor-bills-ap";
import { formatAccountingApCurrency, formatAccountingApDate } from "../../utils/formatters";
import { FeatureBatchPaymentDetailsCard } from "../features/FeatureBatchPaymentDetailsCard";
import { FeatureBatchProcessingNote } from "../features/FeatureBatchProcessingNote";
import { FeatureBatchSelectedBillsTable } from "../features/FeatureBatchSelectedBillsTable";
import { FeatureBatchVendorCreditsPanel } from "../features/FeatureBatchVendorCreditsPanel";

type VendorBillsApBatchPaymentPageProps = {
  preselectedBillNumbers?: string[];
};

function buildDueState(dueDateRaw: string, status: string): {
  label: string;
  tone: BatchPaymentBillItem["due_state_tone"];
} {
  const normalizedStatus = status.trim().toLowerCase();
  if (normalizedStatus === "overdue") {
    return { label: "Overdue", tone: "danger" };
  }

  const dueDate = new Date(`${dueDateRaw}T00:00:00`);
  if (Number.isNaN(dueDate.getTime())) {
    return { label: "Due date unavailable", tone: "normal" };
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
  const dayDiff = Math.floor((dueTime - startOfToday.getTime()) / (24 * 60 * 60 * 1000));

  if (dayDiff < 0) {
    return { label: "Overdue", tone: "danger" };
  }
  if (dayDiff <= 3) {
    return { label: `Due in ${dayDiff} day${dayDiff === 1 ? "" : "s"}`, tone: "warning" };
  }
  return { label: `Due in ${dayDiff} days`, tone: "normal" };
}

export function VendorBillsApBatchPaymentPage({
  preselectedBillNumbers = [],
}: VendorBillsApBatchPaymentPageProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bills, setBills] = useState<BatchPaymentBillItem[]>([]);
  const [credits, setCredits] = useState<VendorCreditNoteItem[]>([]);
  const [draft, setDraft] = useState<BatchPaymentDraft>(() => ({
    ...buildInitialBatchPaymentDraft(new Date()),
    reference_number: `BATCH-${new Date().getTime().toString().slice(-5)}`,
  }));
  const vendorCreditsQuery = useAccountingApVendorCredits({
    page: 1,
    per_page: 25,
    active_only: true,
  });
  const billsQuery = useAccountingApBills({
    page: 1,
    per_page: 50,
  });
  const batchMutations = useAccountingApBatchMutations();
  const preselectedBillSignature = useMemo(
    () => preselectedBillNumbers.map((item) => item.trim()).filter(Boolean).join("|"),
    [preselectedBillNumbers]
  );

  const selectedRows = useMemo(() => bills.filter((row) => row.is_selected), [bills]);

  useEffect(() => {
    if (!billsQuery.data?.items) return;
    const preselectedBillSet = new Set(
      preselectedBillSignature ? preselectedBillSignature.split("|") : []
    );

    setBills((currentRows) => {
      const currentRowsByBillNumber = new Map(
        currentRows.map((row) => [row.bill_number, row] as const)
      );

      const nextRows = billsQuery.data.items
        .filter((item) => item.status !== "Paid")
        .map((item) => {
          const amountLabel = formatAccountingApCurrency(item.amount);
          const dueState = buildDueState(item.due_date, item.status);
          const existing = currentRowsByBillNumber.get(item.bill_number);

          return {
            bill_number: item.bill_number,
            vendor_name: item.vendor_name,
            vendor_id_label: `Bill ${item.bill_number}`,
            reference: `Ref ${item.bill_number}`,
            due_state: dueState.label,
            due_state_tone: dueState.tone,
            amount_due: amountLabel,
            payment_amount: existing?.payment_amount ?? amountLabel,
            is_selected: existing?.is_selected ?? preselectedBillSet.has(item.bill_number),
          };
        });

      if (
        currentRows.length === nextRows.length &&
        currentRows.every((row, index) => {
          const next = nextRows[index];
          return (
            row.bill_number === next.bill_number &&
            row.vendor_name === next.vendor_name &&
            row.vendor_id_label === next.vendor_id_label &&
            row.reference === next.reference &&
            row.due_state === next.due_state &&
            row.due_state_tone === next.due_state_tone &&
            row.amount_due === next.amount_due &&
            row.payment_amount === next.payment_amount &&
            row.is_selected === next.is_selected
          );
        })
      ) {
        return currentRows;
      }
      return nextRows;
    });
  }, [billsQuery.data?.items, preselectedBillSignature]);

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
      credits_applied_amount: formatAccountingApCurrency(selectedCreditsAmount),
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
        credits_applied_amount: formatAccountingApCurrency(preview.totals.credits_applied_amount),
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
    <div className="space-y-6 overflow-y-auto">
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

      {billsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(billsQuery.error).message}
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
            payFromOptions={[]}
          />
          <FeatureBatchVendorCreditsPanel credits={credits} onCreditsChange={setCredits} />
        </div>
      </div>

      <p className="sr-only">Selected bill count: {selectedRows.length}</p>
    </div>
  );
}
