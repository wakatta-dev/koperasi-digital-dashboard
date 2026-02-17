/** @format */

import { Button } from "@/components/ui/button";

export function VendorBillsApOcrReviewPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            OCR Bill Review &amp; Extraction
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review extracted bill data before creating a vendor bill.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Discard
          </Button>
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Save Progress
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Confirm &amp; Create Bill
          </Button>
        </div>
      </section>
    </div>
  );
}
