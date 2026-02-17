/** @format */

import { Button } from "@/components/ui/button";

export function JournalNewEntryPage() {
  return (
    <div className="space-y-6">
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
            className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Save Draft
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Post Journal
          </Button>
        </div>
      </section>
    </div>
  );
}
