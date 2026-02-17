/** @format */

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAccountingApBillDetail, useAccountingApBillPayments } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { VendorBillDetailModel, VendorBillPaymentHistoryItem } from "../../types/vendor-bills-ap";
import {
  formatAccountingApCurrency,
  formatAccountingApDate,
  normalizeVendorBillStatus,
} from "../../utils/formatters";
import { FeatureVendorBillDetailOverview } from "../features/FeatureVendorBillDetailOverview";
import { FeatureVendorBillInternalNoteCard } from "../features/FeatureVendorBillInternalNoteCard";
import { FeatureVendorBillLineItemsTable } from "../features/FeatureVendorBillLineItemsTable";
import { FeatureVendorBillPaymentHistoryTable } from "../features/FeatureVendorBillPaymentHistoryTable";

type VendorBillsApDetailPageProps = {
  billNumber?: string;
};

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

export function VendorBillsApDetailPage({
  billNumber,
}: VendorBillsApDetailPageProps) {
  const router = useRouter();
  const normalizedBillNumber = (billNumber ?? "").trim();
  const detailQuery = useAccountingApBillDetail(normalizedBillNumber, {
    enabled: normalizedBillNumber.length > 0,
  });
  const paymentsQuery = useAccountingApBillPayments(normalizedBillNumber, {
    enabled: normalizedBillNumber.length > 0,
  });

  const mappedDetail = useMemo<VendorBillDetailModel | null>(
    () =>
      detailQuery.data
        ? {
            overview: {
              bill_number: detailQuery.data.bill_number,
              status: normalizeVendorBillStatus(detailQuery.data.status),
              created_label: detailQuery.data.created_label,
              vendor: {
                name: detailQuery.data.vendor.name,
                address_lines: detailQuery.data.vendor.address_lines,
                email: detailQuery.data.vendor.email,
                avatar_initial: toVendorInitial(detailQuery.data.vendor.name),
                avatar_tone_class_name:
                  AVATAR_TONES[
                    detailQuery.data.vendor.name.length % AVATAR_TONES.length
                  ],
              },
              meta: {
                bill_date: formatAccountingApDate(detailQuery.data.meta.bill_date),
                due_date: formatAccountingApDate(detailQuery.data.meta.due_date),
                due_note: detailQuery.data.meta.due_note ?? "",
                reference_number: detailQuery.data.meta.reference_number,
                currency: detailQuery.data.meta.currency,
              },
            },
            line_items: detailQuery.data.line_items.map((item, index) => ({
              id: `${detailQuery.data?.bill_number}-${index}`,
              item_description: item.item_description,
              detail: item.detail,
              qty: item.qty,
              unit_price: formatAccountingApCurrency(item.unit_price),
              total: formatAccountingApCurrency(item.total),
            })),
            totals: {
              subtotal: formatAccountingApCurrency(detailQuery.data.totals.subtotal),
              tax_amount: formatAccountingApCurrency(detailQuery.data.totals.tax_amount),
              total_amount: formatAccountingApCurrency(detailQuery.data.totals.total_amount),
              paid_to_date: `- ${formatAccountingApCurrency(detailQuery.data.totals.paid_to_date)}`,
              balance_due: formatAccountingApCurrency(detailQuery.data.totals.balance_due),
            },
            payment_history:
              paymentsQuery.data?.items.map((item) => ({
                payment_date: formatAccountingApDate(item.payment_date),
                payment_reference: item.payment_reference,
                payment_method: item.payment_method,
                amount_paid: formatAccountingApCurrency(item.amount_paid),
                status: item.status,
              })) ?? [],
            internal_note: detailQuery.data.internal_note ?? "",
          }
        : null,
    [detailQuery.data, paymentsQuery.data?.items]
  );

  const paymentHistory = useMemo<VendorBillPaymentHistoryItem[]>(
    () => mappedDetail?.payment_history ?? [],
    [mappedDetail?.payment_history]
  );

  const detail = mappedDetail;

  return (
    <div className="space-y-6 overflow-y-auto">
      {!normalizedBillNumber ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Bill number is required.
        </div>
      ) : null}

      {detailQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading bill detail...
        </div>
      ) : null}

      {detailQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(detailQuery.error).message}
        </div>
      ) : null}

      {paymentsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(paymentsQuery.error).message}
        </div>
      ) : null}

      {detail ? (
        <>
          <FeatureVendorBillDetailOverview
            detail={detail.overview}
            onPayNow={() =>
              router.push(
                `${VENDOR_BILLS_AP_ROUTES.batchPayment}?bills=${encodeURIComponent(detail.overview.bill_number)}`
              )
            }
          />
          <FeatureVendorBillLineItemsTable rows={detail.line_items} totals={detail.totals} />
          <FeatureVendorBillPaymentHistoryTable rows={paymentHistory} />
          <FeatureVendorBillInternalNoteCard note={detail.internal_note} />
        </>
      ) : null}

      {!detail && !detailQuery.isPending && !detailQuery.error && normalizedBillNumber ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Bill detail not available for the selected bill number.
        </div>
      ) : null}
    </div>
  );
}
