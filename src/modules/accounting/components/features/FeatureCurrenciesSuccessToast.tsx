/** @format */

"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureCurrenciesSuccessToastProps = {
  open?: boolean;
  onClose?: () => void;
};

export function FeatureCurrenciesSuccessToast({
  open = false,
  onClose,
}: FeatureCurrenciesSuccessToastProps) {
  if (!open) return null;

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 dark:border-gray-700 dark:bg-slate-900 sm:w-96">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Success!</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              New currency (GBP) has been added.
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-green-500" />
    </div>
  );
}

