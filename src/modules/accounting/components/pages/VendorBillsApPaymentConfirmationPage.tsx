/** @format */

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";

export function VendorBillsApPaymentConfirmationPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pembayaran batch berhasil dijadwalkan untuk vendor bills yang dipilih.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Link href={VENDOR_BILLS_AP_ROUTES.index}>Done</Link>
          </Button>
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Download Receipt
          </Button>
          <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-700">
            Back to Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
