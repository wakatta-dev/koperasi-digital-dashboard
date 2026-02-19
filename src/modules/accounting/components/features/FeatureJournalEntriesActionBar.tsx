/** @format */

import { History, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureJournalEntriesActionBarProps = {
  onAuditLogClick?: () => void;
  onNewJournalEntryClick?: () => void;
};

export function FeatureJournalEntriesActionBar({
  onAuditLogClick,
  onNewJournalEntryClick,
}: FeatureJournalEntriesActionBarProps) {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal Entries</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and review all your financial journal entries.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onAuditLogClick}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <History className="mr-2 h-4 w-4" />
          Audit Log
        </Button>
        <Button
          type="button"
          onClick={onNewJournalEntryClick}
          className="bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Journal Entry
        </Button>
      </div>
    </section>
  );
}
