/** @format */

import Link from "next/link";
import { ArrowLeft, FileText, Printer, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { JOURNAL_DETAIL_HEADER } from "../../constants/journal-seed";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type { JournalDetailHeader } from "../../types/journal";

type FeatureJournalDetailHeaderProps = {
  header?: JournalDetailHeader;
  returnToQuery?: string;
  onPrint?: () => void;
  onExportPdf?: () => void;
  onReverseEntry?: () => void;
};

function statusBadgeClassName(status: JournalDetailHeader["status"]) {
  switch (status) {
    case "Locked":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Reversed":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    case "Draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300";
  }
}

export function FeatureJournalDetailHeader({
  header = JOURNAL_DETAIL_HEADER,
  returnToQuery,
  onPrint,
  onExportPdf,
  onReverseEntry,
}: FeatureJournalDetailHeaderProps) {
  const backHref = returnToQuery
    ? `${ACCOUNTING_JOURNAL_ROUTES.index}?${returnToQuery}`
    : ACCOUNTING_JOURNAL_ROUTES.index;

  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-10 w-10 border-gray-200 dark:border-gray-700"
        >
          <Link href={backHref} aria-label="Back to journal list">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {header.journal_number}
            </h1>
            <Badge className={statusBadgeClassName(header.status)}>{header.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{header.posted_label}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrint}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExportPdf}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button
          type="button"
          onClick={onReverseEntry}
          className="bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reverse Entry
        </Button>
      </div>
    </section>
  );
}
