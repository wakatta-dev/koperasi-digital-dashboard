/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";
import { Label } from "@/components/ui/label";

import { JOURNAL_NEW_ENTRY_DEFAULT_METADATA } from "../../constants/journal-seed";
import type { ManualJournalMetadata } from "../../types/journal";

type FeatureManualJournalMetadataFormProps = {
  value?: ManualJournalMetadata;
  onChange?: (next: ManualJournalMetadata) => void;
};

export function FeatureManualJournalMetadataForm({
  value = JOURNAL_NEW_ENTRY_DEFAULT_METADATA,
  onChange,
}: FeatureManualJournalMetadataFormProps) {
  const patch = (next: Partial<ManualJournalMetadata>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardContent className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div>
            <Label
              htmlFor="journal-reference-number"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reference #
            </Label>
            <Input
              id="journal-reference-number"
              type="text"
              readOnly
              value={value.reference_number}
              className="bg-gray-50 text-sm text-gray-900 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="journal-reference-text"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Journal Reference
            </Label>
            <Input
              id="journal-reference-text"
              type="text"
              value={value.journal_reference}
              onChange={(event) => patch({ journal_reference: event.target.value })}
              placeholder="e.g., Adjustment for Nov Expenses"
              className="bg-white text-sm text-gray-900 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <Label
              htmlFor="journal-entry-date"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </Label>
            <Input
              id="journal-entry-date"
              type="date"
              value={value.journal_date}
              onChange={(event) => patch({ journal_date: event.target.value })}
              className="bg-white text-sm text-gray-900 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
