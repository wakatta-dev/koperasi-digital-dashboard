/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAccountingApBillMutations,
  useAccountingApBills,
  useAccountingApOverview,
} from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { CreateVendorBillDraft, VendorBillListItem } from "../../types/vendor-bills-ap";
import {
  formatAccountingApCurrency,
  formatAccountingApDate,
  normalizeVendorBillStatus,
} from "../../utils/formatters";
import { FeatureCreateVendorBillModal } from "../features/FeatureCreateVendorBillModal";
import { FeatureVendorBillsSummaryCards } from "../features/FeatureVendorBillsSummaryCards";
import { FeatureVendorBillsTable } from "../features/FeatureVendorBillsTable";

const AVATAR_TONES = [
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
] as const;

function toVendorInitial(name: string) {
  const normalized = name.trim();
  return normalized.length > 0 ? normalized.charAt(0).toUpperCase() : "V";
}

export function VendorBillsApIndexPage() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBillNumbers, setSelectedBillNumbers] = useState<string[]>([]);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const overviewQuery = useAccountingApOverview();
  const billsQuery = useAccountingApBills({ page: 1, per_page: 24 });
  const billMutations = useAccountingApBillMutations();

  const batchPaymentHref = useMemo(() => {
    if (selectedBillNumbers.length === 0) {
      return VENDOR_BILLS_AP_ROUTES.batchPayment;
    }

    return `${VENDOR_BILLS_AP_ROUTES.batchPayment}?bills=${encodeURIComponent(selectedBillNumbers.join(","))}`;
  }, [selectedBillNumbers]);

  const summaryMetrics = useMemo(
    () =>
      overviewQuery.data?.cards?.map((card) => ({
        key: card.key,
        label: card.label,
        value: card.value,
        helper_text: card.helper_text,
        status_tone: card.status_tone,
      })),
    [overviewQuery.data?.cards]
  );

  const tableRows = useMemo<VendorBillListItem[]>(
    () =>
      (billsQuery.data?.items ?? []).map((item, index) => ({
        bill_number: item.bill_number,
        vendor_name: item.vendor_name,
        vendor_initial: toVendorInitial(item.vendor_name),
        vendor_initial_class_name: AVATAR_TONES[index % AVATAR_TONES.length],
        bill_date: formatAccountingApDate(item.bill_date),
        due_date: formatAccountingApDate(item.due_date),
        amount: formatAccountingApCurrency(item.amount),
        status: normalizeVendorBillStatus(item.status),
        is_selectable: normalizeVendorBillStatus(item.status) !== "Paid",
      })),
    [billsQuery.data?.items]
  );

  const handleCreateBill = async (draft: CreateVendorBillDraft) => {
    setCreateErrorMessage(null);

    try {
      const created = await billMutations.createBill.mutateAsync({
        payload: {
          vendor_name: draft.vendor_name,
          bill_number: draft.bill_number || undefined,
          bill_date: draft.bill_date,
          due_date: draft.due_date,
          line_items: draft.line_items.map((line) => ({
            product_or_service: line.product_or_service,
            description: line.description || undefined,
            qty: Number(line.qty) || 1,
            price: Number(line.price.replace(/[^\d.-]/g, "")) || 0,
            tax_name: line.tax_name || undefined,
          })),
          attachments: [],
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      setCreateModalOpen(false);
      toast.success("Vendor bill created");
      router.push(VENDOR_BILLS_AP_ROUTES.detail(created.bill_number));
    } catch (err) {
      const parsed = toAccountingApApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422 || parsed.statusCode === 429) {
        setCreateErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Bills (AP)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage, approve, and pay your supplier bills efficiently.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
          >
            <Link href={batchPaymentHref}>Batch Payment</Link>
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
          >
            <Link href={VENDOR_BILLS_AP_ROUTES.ocrReview}>OCR Upload</Link>
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setCreateModalOpen(true)}
          >
            New Bill
          </Button>
        </div>
      </section>

      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(overviewQuery.error).message}
        </div>
      ) : null}

      <FeatureVendorBillsSummaryCards metrics={summaryMetrics} />

      {billsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(billsQuery.error).message}
        </div>
      ) : null}

      <FeatureVendorBillsTable
        rows={tableRows}
        selectedBillNumbers={selectedBillNumbers}
        onSelectionChange={setSelectedBillNumbers}
        onRowOpen={(row) => router.push(VENDOR_BILLS_AP_ROUTES.detail(row.bill_number))}
        totalResults={billsQuery.data?.pagination.total_items ?? tableRows.length}
      />

      <FeatureCreateVendorBillModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) {
            setCreateErrorMessage(null);
          }
        }}
        onSubmit={handleCreateBill}
        isSubmitting={billMutations.createBill.isPending}
        errorMessage={createErrorMessage}
      />
    </div>
  );
}
