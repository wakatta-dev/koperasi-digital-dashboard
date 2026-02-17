/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DUMMY_VENDOR_BILLS } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import { FeatureCreateVendorBillModal } from "../features/FeatureCreateVendorBillModal";
import { FeatureVendorBillsSummaryCards } from "../features/FeatureVendorBillsSummaryCards";
import { FeatureVendorBillsTable } from "../features/FeatureVendorBillsTable";

export function VendorBillsApIndexPage() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBillNumbers, setSelectedBillNumbers] = useState<string[]>([]);

  const batchPaymentHref = useMemo(() => {
    if (selectedBillNumbers.length === 0) {
      return VENDOR_BILLS_AP_ROUTES.batchPayment;
    }

    return `${VENDOR_BILLS_AP_ROUTES.batchPayment}?bills=${encodeURIComponent(selectedBillNumbers.join(","))}`;
  }, [selectedBillNumbers]);

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

      <FeatureVendorBillsSummaryCards />

      <FeatureVendorBillsTable
        rows={DUMMY_VENDOR_BILLS}
        selectedBillNumbers={selectedBillNumbers}
        onSelectionChange={setSelectedBillNumbers}
        onRowOpen={(row) => router.push(VENDOR_BILLS_AP_ROUTES.detail(row.bill_number))}
      />

      <FeatureCreateVendorBillModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
