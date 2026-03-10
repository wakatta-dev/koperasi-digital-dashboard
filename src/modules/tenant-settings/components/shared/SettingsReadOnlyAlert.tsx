/** @format */

import { Info } from "lucide-react";

type SettingsReadOnlyAlertProps = {
  message: string;
};

export function SettingsReadOnlyAlert({ message }: SettingsReadOnlyAlertProps) {
  return (
    <div className="mb-6 rounded-[22px] border border-sky-200/80 bg-sky-50/90 p-4 dark:border-sky-900/70 dark:bg-sky-950/30">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info aria-hidden="true" className="h-5 w-5 text-sky-500 dark:text-sky-300" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-sky-900 dark:text-sky-100">Mode Read-Only</h3>
          <div className="mt-2 text-sm leading-6 text-sky-800 dark:text-sky-200">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
