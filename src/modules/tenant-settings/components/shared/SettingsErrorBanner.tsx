/** @format */

import { AlertCircle } from "lucide-react";

type SettingsErrorBannerProps = {
  message: string;
};

export function SettingsErrorBanner({ message }: SettingsErrorBannerProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/70 dark:bg-red-950/30">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-300" />
        <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
      </div>
    </div>
  );
}

