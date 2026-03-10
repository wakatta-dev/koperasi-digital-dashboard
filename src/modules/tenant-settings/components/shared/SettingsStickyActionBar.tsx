/** @format */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SettingsStickyActionBarProps = {
  onReset?: () => void;
  onSave?: () => void;
  resetLabel?: string;
  saveLabel: string;
  resetDisabled?: boolean;
  saveDisabled?: boolean;
  saving?: boolean;
  className?: string;
  dirty?: boolean;
  idleMessage?: string;
  dirtyMessage?: string;
  savingMessage?: string;
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
  dirty = false,
  idleMessage = "Tidak ada perubahan aktif.",
  dirtyMessage = "Perubahan belum disimpan.",
  savingMessage = "Menyimpan…",
}: SettingsStickyActionBarProps) {
  const statusMessage = saving ? savingMessage : dirty ? dirtyMessage : idleMessage;

  return (
    <div
      className={cn(
        "sticky bottom-4 z-10 mt-6 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_20px_48px_-38px_rgba(15,23,42,0.65)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Status Form
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{statusMessage}</p>
        </div>

        <div className="flex justify-end gap-3">
          {onReset ? (
            <Button
              type="button"
              variant="outline"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              onClick={onReset}
              disabled={resetDisabled}
            >
              {resetLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            className="bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-100"
            onClick={onSave}
            disabled={saveDisabled}
          >
            {saving ? "Menyimpan…" : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
