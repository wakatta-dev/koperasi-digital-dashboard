/** @format */

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  ACCOUNTING_JOURNAL_FLOW_ORDER,
  ACCOUNTING_JOURNAL_ROUTES,
} from "../../constants/journal-routes";

export function JournalEntriesManagementPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal Entries</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and review all your financial journal entries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-gray-200 dark:border-gray-700"
          >
            <Link href={ACCOUNTING_JOURNAL_ROUTES.auditLog}>Audit Log</Link>
          </Button>
          <Button asChild type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Link href={ACCOUNTING_JOURNAL_ROUTES.create}>New Journal Entry</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          {ACCOUNTING_JOURNAL_FLOW_ORDER.map((step, index) => (
            <Badge
              key={step}
              variant="secondary"
              className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {index + 1}. {step}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
