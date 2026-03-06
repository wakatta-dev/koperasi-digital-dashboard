/** @format */

import { Info } from "lucide-react";

type SettingsReadOnlyAlertProps = {
  message: string;
};

export function SettingsReadOnlyAlert({ message }: SettingsReadOnlyAlertProps) {
  return (
    <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-400 dark:text-blue-300" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Mode Read-Only</h3>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

