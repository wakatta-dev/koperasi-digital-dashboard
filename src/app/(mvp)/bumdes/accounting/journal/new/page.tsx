/** @format */

import type { Metadata } from "next";

import { JournalNewEntryPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Journal - New - Koperasi Digital",
  description: "Bumdes - Accounting - Journal - New page.",
};

export default function AccountingJournalNewPage() {
  return <JournalNewEntryPage />;
}
