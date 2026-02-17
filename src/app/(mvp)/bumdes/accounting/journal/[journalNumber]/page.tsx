/** @format */

import { JournalEntryDetailPage } from "@/modules/accounting";

type AccountingJournalDetailPageProps = {
  params: Promise<{
    journalNumber: string;
  }>;
};

export default async function AccountingJournalDetailPage({
  params,
}: AccountingJournalDetailPageProps) {
  const { journalNumber } = await params;

  return <JournalEntryDetailPage journalNumber={journalNumber} />;
}
