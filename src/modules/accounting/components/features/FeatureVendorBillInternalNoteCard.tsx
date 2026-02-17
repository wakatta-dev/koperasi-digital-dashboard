/** @format */

import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_VENDOR_BILL_DETAIL } from "../../constants/vendor-bills-ap-dummy";

type FeatureVendorBillInternalNoteCardProps = {
  note?: string;
};

export function FeatureVendorBillInternalNoteCard({
  note = DUMMY_VENDOR_BILL_DETAIL.internal_note,
}: FeatureVendorBillInternalNoteCardProps) {
  return (
    <Card className="rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-indigo-500" />
          <div>
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
              Internal Note
            </h4>
            <p className="mt-1 text-sm text-indigo-700/80 dark:text-indigo-400/80">{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
