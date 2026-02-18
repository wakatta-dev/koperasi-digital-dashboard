/** @format */

import { Download, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureEfakturTopActionsProps = {
  onFilter?: () => void;
  onDownloadCsv?: () => void;
};

export function FeatureEfakturTopActions({
  onFilter,
  onDownloadCsv,
}: FeatureEfakturTopActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onFilter}
        className="border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button
        type="button"
        onClick={onDownloadCsv}
        className="bg-indigo-600 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
      >
        <Download className="mr-2 h-4 w-4" />
        Download CSV for e-Faktur
      </Button>
    </div>
  );
}
