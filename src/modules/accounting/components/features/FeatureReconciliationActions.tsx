/** @format */

import { CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureReconciliationActionsProps = {
  canConfirm?: boolean;
  isConfirming?: boolean;
  onConfirm?: () => void;
  onSuggest?: () => void;
};

export function FeatureReconciliationActions({
  canConfirm = true,
  isConfirming = false,
  onConfirm,
  onSuggest,
}: FeatureReconciliationActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onSuggest}
        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Suggest Matches
      </Button>
      <Button
        type="button"
        disabled={!canConfirm || isConfirming}
        onClick={onConfirm}
        className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Confirm Reconciliation
      </Button>
    </div>
  );
}
