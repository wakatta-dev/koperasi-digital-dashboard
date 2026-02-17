/** @format */

import { CalendarClock, FileStack, Ticket, TriangleAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_VENDOR_BILL_SUMMARY_METRICS } from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILL_SUMMARY_TONE_CLASS } from "../../constants/stitch";
import type { VendorBillSummaryMetric } from "../../types/vendor-bills-ap";

type FeatureVendorBillsSummaryCardsProps = {
  metrics?: VendorBillSummaryMetric[];
};

const ICON_BY_KEY: Record<string, typeof FileStack> = {
  "total-outstanding": FileStack,
  "due-this-week": CalendarClock,
  "overdue-bills": TriangleAlert,
  "vendor-credits": Ticket,
};

export function FeatureVendorBillsSummaryCards({
  metrics = DUMMY_VENDOR_BILL_SUMMARY_METRICS,
}: FeatureVendorBillsSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = ICON_BY_KEY[metric.key] ?? FileStack;
        const toneClass = VENDOR_BILL_SUMMARY_TONE_CLASS[metric.status_tone];

        return (
          <Card
            key={metric.key}
            className={`rounded-xl border border-gray-200 shadow-sm transition-colors hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-800 ${toneClass.card_accent ?? ""}`}
          >
            <CardContent className="flex flex-col justify-between gap-4 p-4">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {metric.label}
                </span>
                <div className={`rounded-md p-1.5 ${toneClass.icon_wrapper}`}>
                  <Icon className={`h-4 w-4 ${toneClass.icon_color}`} />
                </div>
              </div>

              <div>
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span className={`mt-1 block text-xs font-medium ${toneClass.helper_text}`}>
                  {metric.helper_text}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
