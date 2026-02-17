/** @format */

"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureAnalyticBudgetSuccessToastProps = {
  open?: boolean;
  onClose?: () => void;
};

export function FeatureAnalyticBudgetSuccessToast({
  open = false,
  onClose,
}: FeatureAnalyticBudgetSuccessToastProps) {
  if (!open) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
      <div className="flex w-full max-w-sm items-center rounded-lg border border-green-100 bg-white p-4 text-gray-500 shadow-lg dark:border-green-900/30 dark:bg-gray-800 dark:text-gray-400">
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800/30 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5" />
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          <span className="font-semibold text-gray-900 dark:text-white">Success!</span>
          <div className="text-xs">Budget &quot;Q4 Sales Kickoff&quot; has been created.</div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ms-auto h-8 w-8 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
