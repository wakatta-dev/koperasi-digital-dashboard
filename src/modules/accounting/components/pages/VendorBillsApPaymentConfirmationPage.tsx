/** @format */

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAccountingApBatchDetail } from "@/hooks/queries";
import { toAccountingApApiError } from "@/services/api/accounting-ap";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { PaymentConfirmationModel } from "../../types/vendor-bills-ap";
import { formatAccountingApCurrency } from "../../utils/formatters";
import { FeaturePaymentSchedulingSuccessCard } from "../features/FeaturePaymentSchedulingSuccessCard";

type VendorBillsApPaymentConfirmationPageProps = {
  batchReference?: string;
};

export function VendorBillsApPaymentConfirmationPage({
  batchReference,
}: VendorBillsApPaymentConfirmationPageProps) {
  const router = useRouter();
  const batchDetailQuery = useAccountingApBatchDetail(batchReference, {
    enabled: Boolean(batchReference),
  });

  const confirmation = useMemo<PaymentConfirmationModel>(() => {
    if (!batchDetailQuery.data) {
      return {
        total_paid: formatAccountingApCurrency(0),
        bill_count_label: "0 bills",
        bill_breakdowns: [],
        security_note: "Transaction secured with end-to-end encryption",
      };
    }

    return {
      total_paid: formatAccountingApCurrency(batchDetailQuery.data.totals.total_to_pay_amount),
      bill_count_label: `${batchDetailQuery.data.bill_breakdowns.length} bills`,
      bill_breakdowns: batchDetailQuery.data.bill_breakdowns.map((item) => ({
        bill_number: item.bill_number,
        vendor_name: item.vendor_name,
        amount: formatAccountingApCurrency(item.amount),
      })),
      security_note: "Transaction secured with end-to-end encryption",
    };
  }, [batchDetailQuery.data]);

  return (
    <div className="space-y-6 overflow-y-auto">
      {!batchReference ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Batch reference is required to load payment confirmation details.
        </div>
      ) : null}

      {batchDetailQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading batch payment confirmation...
        </div>
      ) : null}

      {batchDetailQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingApApiError(batchDetailQuery.error).message}
        </div>
      ) : null}

      <FeaturePaymentSchedulingSuccessCard
        confirmation={confirmation}
        onDone={() => router.push(VENDOR_BILLS_AP_ROUTES.index)}
      />
    </div>
  );
}
