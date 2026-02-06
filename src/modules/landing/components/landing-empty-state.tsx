/** @format */

"use client";

import { EmptyState } from "@/components/shared/feedback/async-states";

type LandingEmptyStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function LandingEmptyState(props: LandingEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-6">
      <EmptyState {...props} />
    </div>
  );
}
