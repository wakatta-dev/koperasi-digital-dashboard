/** @format */

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";

type JournalAuditLogPageProps = {
  journalNumber?: string;
};

export function JournalAuditLogPage({ journalNumber }: JournalAuditLogPageProps) {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Button asChild variant="link" className="h-auto p-0 text-indigo-600 hover:text-indigo-700">
            <Link href={ACCOUNTING_JOURNAL_ROUTES.index}>Kembali ke Journal</Link>
          </Button>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Riwayat Lengkap Audit Log
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Daftar lengkap aktivitas dan perubahan transaksi akuntansi.
          </p>
          {journalNumber ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Context filter: {journalNumber}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Export CSV
          </Button>
        </div>
      </section>
    </div>
  );
}
