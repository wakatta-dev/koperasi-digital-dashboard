/** @format */

"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { ACCOUNTING_SETTINGS_ROUTES } from "../../constants/settings-routes";

const SETTINGS_CARDS = [
  {
    title: "Chart of Accounts",
    description: "General ledger account structures and hierarchy.",
    href: ACCOUNTING_SETTINGS_ROUTES.chartOfAccounts,
  },
  {
    title: "Taxes",
    description: "Tax rates, tax accounts, and status configuration.",
    href: ACCOUNTING_SETTINGS_ROUTES.taxes,
  },
  {
    title: "Currencies",
    description: "Multi-currency rates, base currency, and updates.",
    href: ACCOUNTING_SETTINGS_ROUTES.currencies,
  },
  {
    title: "Analytic & Budget",
    description: "Cost center analytics and budgeting workspace.",
    href: ACCOUNTING_SETTINGS_ROUTES.analyticBudgets,
  },
] as const;

export function AccountingSettingsIndexPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounting Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage chart of accounts, taxes, currencies, and analytic budgets.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SETTINGS_CARDS.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="h-full border-gray-200 transition-colors hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-700">
              <CardContent className="space-y-2 p-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

