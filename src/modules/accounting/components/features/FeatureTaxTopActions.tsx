/** @format */

import { FileSpreadsheet, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureTaxTopActionsProps = {
  onGenerateTaxReport?: () => void;
  onExportEfaktur?: () => void;
};

export function FeatureTaxTopActions({
  onGenerateTaxReport,
  onExportEfaktur,
}: FeatureTaxTopActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={onGenerateTaxReport}
      >
        <Printer className="mr-2 h-4 w-4" />
        Generate Tax Report
      </Button>
      <Button
        type="button"
        className="bg-indigo-600 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
        onClick={onExportEfaktur}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export e-Faktur
      </Button>
    </div>
  );
}
