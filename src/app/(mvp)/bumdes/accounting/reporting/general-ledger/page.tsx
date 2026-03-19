/** @format */

import type { Metadata } from "next";

import { ReportingGeneralLedgerPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - General Ledger - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - General Ledger page.",
};

export default function AccountingReportingGeneralLedgerRoute() {
  return <ReportingGeneralLedgerPage />;
}
