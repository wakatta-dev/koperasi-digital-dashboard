/** @format */

import { ShieldCheck } from "lucide-react";

import { JOURNAL_DETAIL_INTEGRITY } from "../../constants/journal-seed";
import type { JournalDetailIntegrity } from "../../types/journal";

type FeatureJournalDetailIntegrityFooterProps = {
  data?: JournalDetailIntegrity;
};

export function FeatureJournalDetailIntegrityFooter({
  data = JOURNAL_DETAIL_INTEGRITY,
}: FeatureJournalDetailIntegrityFooterProps) {
  return (
    <section className="flex flex-col justify-between gap-4 px-2 md:flex-row md:items-center">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-500">{data.balanced_label}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-500" />
          <span className="text-sm text-gray-500">{data.immutable_label}</span>
        </div>
      </div>
      <p className="text-sm italic text-gray-400">{data.last_modified_label}</p>
    </section>
  );
}
