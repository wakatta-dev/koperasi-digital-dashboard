/** @format */

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";

export function VendorBillsApIndexPage() {
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
            <Link href={VENDOR_BILLS_AP_ROUTES.batchPayment}>Batch Payment</Link>
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
          >
            <Link href={VENDOR_BILLS_AP_ROUTES.ocrReview}>OCR Upload</Link>
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            New Bill
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Bill</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Search, filter, and review vendor bill records.
        </p>
      </section>
    </div>
  );
}
