/** @format */

import { Download, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureAuditLogHeaderActionsProps = {
  journalNumber?: string;
  onBackToJournal?: () => void;
  onExportCsv?: () => void;
};

export function FeatureAuditLogHeaderActions({
  journalNumber,
  onBackToJournal,
  onExportCsv,
}: FeatureAuditLogHeaderActionsProps) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <Button
          type="button"
          variant="link"
          onClick={onBackToJournal}
          className="h-auto p-0 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Journal
        </Button>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Riwayat Lengkap Audit Log
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Daftar lengkap aktivitas dan perubahan transaksi akuntansi.
        </p>
        {journalNumber ? (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Context: {journalNumber}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onExportCsv}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </section>
  );
}
