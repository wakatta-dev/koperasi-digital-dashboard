/** @format */

import { Button } from "@/components/ui/button";

export function VendorBillsApBatchPaymentPage() {
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
    </div>
  );
}
