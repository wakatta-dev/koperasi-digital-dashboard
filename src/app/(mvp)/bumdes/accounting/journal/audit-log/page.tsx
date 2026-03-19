/** @format */

import type { Metadata } from "next";

import { JournalAuditLogPage } from "@/modules/accounting";

type AccountingJournalAuditLogPageProps = {
  searchParams?: Promise<{
    journalNumber?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Journal - Audit Log - Koperasi Digital",
  description: "Bumdes - Accounting - Journal - Audit Log page.",
};

export default async function AccountingJournalAuditLogPage({
  searchParams,
}: AccountingJournalAuditLogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <JournalAuditLogPage journalNumber={resolvedSearchParams.journalNumber} />;
}
