/** @format */

import { JournalAuditLogPage } from "@/modules/accounting";

type AccountingJournalAuditLogPageProps = {
  searchParams?: Promise<{
    journalNumber?: string;
  }>;
};

export default async function AccountingJournalAuditLogPage({
  searchParams,
}: AccountingJournalAuditLogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <JournalAuditLogPage journalNumber={resolvedSearchParams.journalNumber} />;
}
