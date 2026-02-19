/** @format */

import { JournalEntryDetailPage } from "@/modules/accounting";

type AccountingJournalDetailPageProps = {
  params: Promise<{
    journalNumber: string;
  }>;
  searchParams?: Promise<{
    from?: string;
  }>;
};

export default async function AccountingJournalDetailPage({
  params,
  searchParams,
}: AccountingJournalDetailPageProps) {
  const { journalNumber } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <JournalEntryDetailPage
      journalNumber={journalNumber}
      returnToQuery={resolvedSearchParams.from}
    />
  );
}
