/** @format */

import { Pencil, Printer, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_VENDOR_BILL_DETAIL } from "../../constants/vendor-bills-ap-dummy";
import type { VendorBillDetailOverviewModel } from "../../types/vendor-bills-ap";

type FeatureVendorBillDetailOverviewProps = {
  detail?: VendorBillDetailOverviewModel;
  onPayNow?: () => void;
};

const STATUS_BADGE_CLASS: Record<VendorBillDetailOverviewModel["status"], string> = {
  Draft:
    "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300",
  Approved:
    "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/40 dark:text-blue-300",
  Paid: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/40 dark:text-emerald-300",
  Overdue:
    "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/40 dark:text-red-400",
};

export function FeatureVendorBillDetailOverview({
  detail = DUMMY_VENDOR_BILL_DETAIL.overview,
  onPayNow,
}: FeatureVendorBillDetailOverviewProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {detail.bill_number}
            </h1>
            <Badge
              className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_BADGE_CLASS[detail.status]}`}
            >
              {detail.status.toUpperCase()}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {detail.created_label}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-gray-200 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:text-gray-300"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-gray-200 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:text-gray-300"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            type="button"
            onClick={onPayNow}
            className="gap-2 bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
          >
            <Wallet className="h-4 w-4" />
            Pay Now
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="grid grid-cols-1 gap-12 border-b border-gray-100 p-8 dark:border-gray-700/50 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Vendor Information
              </h2>
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${detail.vendor.avatar_tone_class_name}`}
                >
                  {detail.vendor.avatar_initial}
                </div>
                <div>
                  <p className="mb-2 text-lg leading-none font-bold text-gray-900 dark:text-white">
                    {detail.vendor.name}
                  </p>
                  {detail.vendor.address_lines.map((line) => (
                    <p key={line} className="text-sm text-gray-500 dark:text-gray-400">
                      {line}
                    </p>
                  ))}
                  <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {detail.vendor.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Bill Date
              </h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {detail.meta.bill_date}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Due Date
              </h3>
              <p className="text-sm font-bold text-red-500">{detail.meta.due_date}</p>
              <p className="text-[10px] font-medium text-red-400">{detail.meta.due_note}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Ref. Number
              </h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {detail.meta.reference_number}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Currency
              </h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {detail.meta.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
