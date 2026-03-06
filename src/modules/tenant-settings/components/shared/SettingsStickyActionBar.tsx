/** @format */

import { Button } from "@/components/ui/button";

type SettingsStickyActionBarProps = {
  onReset?: () => void;
  onSave?: () => void;
  resetLabel?: string;
  saveLabel: string;
  resetDisabled?: boolean;
  saveDisabled?: boolean;
  saving?: boolean;
  className?: string;
};

export function SettingsStickyActionBar({
  onReset,
  onSave,
  resetLabel = "Reset",
  saveLabel,
  resetDisabled,
  saveDisabled,
  saving,
  className,
}: SettingsStickyActionBarProps) {
  return (
    <div
      className={[
        "sticky bottom-0 z-10 mt-6 -mx-6 flex justify-end gap-3 border-t border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {onReset ? (
        <Button
          type="button"
          variant="outline"
          className="border-gray-300 dark:border-gray-700"
          onClick={onReset}
          disabled={resetDisabled}
        >
          {resetLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        className="bg-indigo-600 text-white shadow-elev-1 hover:bg-indigo-500 focus-visible:ring-indigo-600"
        onClick={onSave}
        disabled={saveDisabled}
      >
        {saving ? "Menyimpan..." : saveLabel}
      </Button>
    </div>
  );
}

