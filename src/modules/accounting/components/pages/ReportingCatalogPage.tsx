/** @format */

"use client";

import { useRouter } from "next/navigation";

import { ACCOUNTING_REPORTING_ROUTES } from "../../constants/reporting-routes";
import type { ReportingCardItem } from "../../types/reporting";
import {
  FeatureReportingLedgerCardsGrid,
  FeatureReportingSectionHeader,
  FeatureReportingStatementCardsGrid,
} from "../features/FeatureReportingShared";

const REPORTING_CARDS: ReadonlyArray<ReportingCardItem> = [
  {
    key: "balance-sheet",
    title: "Balance Sheet",
    description: "A summary of the financial balances of an individual or organization.",
    href: ACCOUNTING_REPORTING_ROUTES.balanceSheet,
    group: "statement",
    iconTone: "blue",
  },
  {
    key: "profit-loss",
    title: "Profit and Loss",
    description: "Shows the company's revenues and expenses during a particular period.",
    href: ACCOUNTING_REPORTING_ROUTES.profitLoss,
    group: "statement",
    iconTone: "emerald",
  },
  {
    key: "cash-flow",
    title: "Cash Flow Statement",
    description: "Shows how changes in balance sheet accounts and income affect cash.",
    href: ACCOUNTING_REPORTING_ROUTES.cashFlow,
    group: "statement",
    iconTone: "orange",
  },
  {
    key: "p-and-l-comparative",
    title: "P&L Comparative",
    description: "Compare profit and loss statements across different time periods.",
    href: ACCOUNTING_REPORTING_ROUTES.profitLossComparative,
    group: "statement",
    iconTone: "purple",
  },
  {
    key: "trial-balance",
    title: "Trial Balance",
    description: "A list of all the general ledger accounts contained in the ledger of a business.",
    href: ACCOUNTING_REPORTING_ROUTES.trialBalance,
    group: "ledger",
    iconTone: "teal",
  },
  {
    key: "tie-out",
    title: "Operational vs GL Tie-Out",
    description: "Compare operational subledger totals against GL references before using financial statements as source of truth.",
    href: ACCOUNTING_REPORTING_ROUTES.tieOut,
    group: "control",
    iconTone: "orange",
  },
  {
    key: "general-ledger",
    title: "General Ledger",
    description: "Complete record of all financial transactions over the life of the company.",
    href: ACCOUNTING_REPORTING_ROUTES.generalLedger,
    group: "ledger",
    iconTone: "indigo",
  },
  {
    key: "account-ledger",
    title: "Account Ledger",
    description: "Detailed transaction history for specific accounts.",
    href: ACCOUNTING_REPORTING_ROUTES.accountLedger,
    group: "ledger",
    iconTone: "cyan",
  },
];

export function ReportingCatalogPage() {
  const router = useRouter();

  const statementCards = REPORTING_CARDS.filter((card) => card.group === "statement");
  const ledgerCards = REPORTING_CARDS.filter((card) => card.group === "ledger");
  const controlCards = REPORTING_CARDS.filter((card) => card.group === "control");

  const handleView = (card: ReportingCardItem) => {
    router.push(card.href);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan Keuangan</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Statement dan ledger di bawah ini adalah laporan finansial resmi berbasis GL. Workspace
          tie-out dipisahkan sebagai area kontrol sebelum angka finansial resmi dipakai, sekaligus
          merangkum maturity fixed asset yang masih menghalangi kesiapan reporting.
        </p>
      </section>

      <section className="space-y-4">
        <FeatureReportingSectionHeader title="Statement Reports" />
        <FeatureReportingStatementCardsGrid cards={statementCards} onView={handleView} />
      </section>

      <section className="space-y-4">
        <FeatureReportingSectionHeader title="Ledgers" />
        <FeatureReportingLedgerCardsGrid cards={ledgerCards} onView={handleView} />
      </section>

      <section className="space-y-4">
        <FeatureReportingSectionHeader title="Control Workspace" badgeText="Operational vs GL" />
        <FeatureReportingStatementCardsGrid cards={controlCards} onView={handleView} />
      </section>
    </div>
  );
}
