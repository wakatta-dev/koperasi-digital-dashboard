/** @format */

import { CheckCircle2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureManualJournalHeaderActionsProps = {
  onSaveDraft?: () => void;
  onPostJournal?: () => void;
  saveDraftDisabled?: boolean;
  postJournalDisabled?: boolean;
};

export function FeatureManualJournalHeaderActions({
  onSaveDraft,
  onPostJournal,
  saveDraftDisabled,
  postJournalDisabled,
}: FeatureManualJournalHeaderActionsProps) {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Journal Entry</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new manual journal entry and track changes.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={saveDraftDisabled}
          onClick={onSaveDraft}
          className="border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button
          type="button"
          disabled={postJournalDisabled}
          onClick={onPostJournal}
          className="bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Post Journal
        </Button>
      </div>
    </section>
  );
}
