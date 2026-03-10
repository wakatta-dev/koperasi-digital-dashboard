/** @format */

import { AlertCircle } from "lucide-react";

type SettingsErrorBannerProps = {
  message: string;
};

export function SettingsErrorBanner({ message }: SettingsErrorBannerProps) {
  return (
    <div
      aria-live="polite"
      className="rounded-[22px] border border-rose-200/80 bg-rose-50/90 p-4 dark:border-rose-900/70 dark:bg-rose-950/30"
    >
      <div className="flex items-start gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-300" />
        <p className="text-sm leading-6 text-rose-700 dark:text-rose-200">{message}</p>
      </div>
    </div>
  );
}
