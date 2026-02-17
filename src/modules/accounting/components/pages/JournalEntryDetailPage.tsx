/** @format */

"use client";

import { useMemo } from "react";

import { JOURNAL_DETAIL_HEADER } from "../../constants/journal-seed";
import { FeatureJournalDetailGeneralInfo } from "../features/FeatureJournalDetailGeneralInfo";
import { FeatureJournalDetailHeader } from "../features/FeatureJournalDetailHeader";
import { FeatureJournalDetailIntegrityFooter } from "../features/FeatureJournalDetailIntegrityFooter";
import { FeatureJournalDetailItemsTable } from "../features/FeatureJournalDetailItemsTable";

type JournalEntryDetailPageProps = {
  journalNumber: string;
  returnToQuery?: string;
};

export function JournalEntryDetailPage({
  journalNumber,
  returnToQuery,
}: JournalEntryDetailPageProps) {
  const header = useMemo(
    () => ({
      ...JOURNAL_DETAIL_HEADER,
      journal_number: journalNumber || JOURNAL_DETAIL_HEADER.journal_number,
    }),
    [journalNumber],
  );

  return (
    <div className="space-y-6">
      <FeatureJournalDetailHeader header={header} returnToQuery={returnToQuery} />
      <FeatureJournalDetailGeneralInfo />
      <FeatureJournalDetailItemsTable />
      <FeatureJournalDetailIntegrityFooter />
    </div>
  );
}
