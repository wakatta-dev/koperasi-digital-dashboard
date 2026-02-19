/** @format */

import { JOURNAL_INITIAL_AUDIT_LOG_SUMMARY_COUNTERS } from "../../constants/journal-initial-state";
import type { JournalAuditSummaryCounter } from "../../types/journal";

type FeatureAuditLogSummaryCountersProps = {
  counters?: JournalAuditSummaryCounter[];
};

function toneClassName(tone: JournalAuditSummaryCounter["tone"]) {
  switch (tone) {
    case "amber":
      return "bg-amber-500";
    case "red":
      return "bg-red-500";
    case "blue":
      return "bg-blue-500";
    default:
      return "bg-emerald-500";
  }
}

export function FeatureAuditLogSummaryCounters({
  counters = JOURNAL_INITIAL_AUDIT_LOG_SUMMARY_COUNTERS,
}: FeatureAuditLogSummaryCountersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      {counters.map((counter) => (
        <div
          key={counter.key}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-slate-900"
        >
          <div className={`h-2 w-2 rounded-full ${toneClassName(counter.tone)}`} />
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            {counter.label}: {counter.value}
          </span>
        </div>
      ))}
    </div>
  );
}
