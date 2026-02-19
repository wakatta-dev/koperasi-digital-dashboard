/** @format */

import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeaturePpnDetailHeaderActionProps = {
  onDownload?: () => void;
  onBackToSummary?: () => void;
};

export function FeaturePpnDetailHeaderAction({
  onDownload,
  onBackToSummary,
}: FeaturePpnDetailHeaderActionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={onBackToSummary}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Summary
      </Button>
      <Button
        type="button"
        className="bg-indigo-600 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
        onClick={onDownload}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Tax Recapitulation
      </Button>
    </div>
  );
}
