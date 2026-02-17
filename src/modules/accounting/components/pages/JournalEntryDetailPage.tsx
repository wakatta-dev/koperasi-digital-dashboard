/** @format */

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";

type JournalEntryDetailPageProps = {
  journalNumber: string;
};

export function JournalEntryDetailPage({ journalNumber }: JournalEntryDetailPageProps) {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
          >
            <Link href={ACCOUNTING_JOURNAL_ROUTES.index}>Back to Journal</Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{journalNumber}</h1>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300">
            Posted
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Print
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Export PDF
          </Button>
          <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Reverse Entry
          </Button>
        </div>
      </section>
    </div>
  );
}
