/** @format */

import type { Metadata } from "next";

import { JournalEntriesManagementPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Journal - Koperasi Digital",
  description: "Bumdes - Accounting - Journal page.",
};

export default function AccountingJournalPage() {
  return <JournalEntriesManagementPage />;
}
