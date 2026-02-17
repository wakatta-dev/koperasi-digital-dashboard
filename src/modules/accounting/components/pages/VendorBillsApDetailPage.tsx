/** @format */

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";

type VendorBillsApDetailPageProps = {
  billNumber?: string;
};

export function VendorBillsApDetailPage({
  billNumber,
}: VendorBillsApDetailPageProps) {
  const normalizedBillNumber = (billNumber ?? "").trim();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {normalizedBillNumber || "Vendor Bill Detail"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review vendor information, line items, payment history, and internal notes.
          </p>
        </div>

        <Button asChild type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
          <Link
            href={
              normalizedBillNumber
                ? `${VENDOR_BILLS_AP_ROUTES.batchPayment}?bill=${encodeURIComponent(normalizedBillNumber)}`
                : VENDOR_BILLS_AP_ROUTES.batchPayment
            }
          >
            Pay Now
          </Link>
        </Button>
      </section>
    </div>
  );
}
