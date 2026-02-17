/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DUMMY_BATCH_PAYMENT_BILLS } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import type { BatchPaymentBillItem } from "../../types/vendor-bills-ap";
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
  const [bills, setBills] = useState<BatchPaymentBillItem[]>(() =>
    DUMMY_BATCH_PAYMENT_BILLS.map((row) => ({
      ...row,
      is_selected:
        preselectedBillNumbers.length === 0
          ? row.is_selected
          : preselectedBillNumbers.includes(row.bill_number),
    }))
  );

  const selectedRows = useMemo(() => bills.filter((row) => row.is_selected), [bills]);

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
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Cancel
          </Button>
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Save as Draft
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <FeatureBatchSelectedBillsTable rows={bills} onRowsChange={setBills} />
          <FeatureBatchProcessingNote />
        </div>
        <div className="space-y-6">
          <FeatureBatchPaymentDetailsCard
            onConfirm={() => router.push(VENDOR_BILLS_AP_ROUTES.paymentConfirmation)}
          />
          <FeatureBatchVendorCreditsPanel />
        </div>
      </div>

      <p className="sr-only">Selected bill count: {selectedRows.length}</p>
    </div>
  );
}
