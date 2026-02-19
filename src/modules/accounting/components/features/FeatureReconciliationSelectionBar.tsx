/** @format */

"use client";

import { ArrowLeftRight, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureReconciliationSelectionBarProps = {
  selectedBankLinesCount: number;
  selectedSystemLinesCount: number;
  netDifferenceLabel: string;
  isMatching?: boolean;
  disabled?: boolean;
  onMatchAndReconcile?: () => void;
};

export function FeatureReconciliationSelectionBar({
  selectedBankLinesCount,
  selectedSystemLinesCount,
  netDifferenceLabel,
  isMatching = false,
  disabled = false,
  onMatchAndReconcile,
}: FeatureReconciliationSelectionBarProps) {
  return (
    <div className="sticky bottom-6 z-20 flex justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-xl dark:border-gray-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected:</span>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {selectedBankLinesCount} Bank Lines
            </span>
            <ArrowLeftRight className="h-4 w-4 text-gray-400" />
            <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {selectedSystemLinesCount} System Lines
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Net Difference
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {netDifferenceLabel}
            </p>
          </div>

          <Button
            type="button"
            disabled={disabled || isMatching}
            onClick={onMatchAndReconcile}
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Match & Reconcile
          </Button>
        </div>
      </div>
    </div>
  );
}
