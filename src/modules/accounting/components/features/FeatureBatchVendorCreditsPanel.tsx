/** @format */

import { Receipt } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { DUMMY_VENDOR_CREDIT_NOTES } from "../../constants/vendor-bills-ap-dummy";
import type { VendorCreditNoteItem } from "../../types/vendor-bills-ap";

type FeatureBatchVendorCreditsPanelProps = {
  credits?: VendorCreditNoteItem[];
  onCreditsChange?: (nextCredits: VendorCreditNoteItem[]) => void;
};

export function FeatureBatchVendorCreditsPanel({
  credits = DUMMY_VENDOR_CREDIT_NOTES,
  onCreditsChange,
}: FeatureBatchVendorCreditsPanelProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 bg-indigo-50/50 p-4 dark:border-gray-700 dark:bg-indigo-900/10">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
          <Receipt className="h-4 w-4 text-indigo-500" />
          Credit Notes (Vendor)
        </h3>
        <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500 dark:border-gray-600 dark:bg-gray-900">
          {credits.length} Available
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {credits.map((credit) => (
          <div
            key={credit.credit_note_number}
            className="flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="pt-1">
              <Checkbox
                checked={credit.is_selected}
                onCheckedChange={(checked) =>
                  onCreditsChange?.(
                    credits.map((item) =>
                      item.credit_note_number === credit.credit_note_number
                        ? { ...item, is_selected: Boolean(checked) }
                        : item
                    )
                  )
                }
                aria-label={`Select ${credit.credit_note_number}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {credit.vendor_name}
                </p>
                <span className="whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {credit.amount}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {credit.credit_note_number} • {credit.reason}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">{credit.issued_at}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-3 text-center dark:border-gray-700">
        <Button
          type="button"
          variant="ghost"
          className="h-auto p-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all credit notes
        </Button>
      </div>
    </section>
  );
}
