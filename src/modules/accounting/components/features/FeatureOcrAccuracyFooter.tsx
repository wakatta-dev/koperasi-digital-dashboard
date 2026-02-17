/** @format */

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type FeatureOcrAccuracyFooterProps = {
  accuracyScore?: number;
  onDiscard?: () => void;
  onSaveProgress?: () => void;
};

export function FeatureOcrAccuracyFooter({
  accuracyScore = 88,
  onDiscard,
  onSaveProgress,
}: FeatureOcrAccuracyFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          OCR Accuracy Score
        </span>
        <div className="flex items-center gap-2">
          <Progress value={accuracyScore} className="h-2 w-24 bg-gray-200 dark:bg-gray-700" />
          <span className="text-sm font-bold text-emerald-600">{accuracyScore}%</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-gray-300 text-sm font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300"
          onClick={onDiscard}
        >
          Discard
        </Button>
        <Button
          type="button"
          className="flex-1 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={onSaveProgress}
        >
          Save Progress
        </Button>
      </div>
    </footer>
  );
}
