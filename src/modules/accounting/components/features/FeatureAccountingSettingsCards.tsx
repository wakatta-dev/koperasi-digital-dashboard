/** @format */

"use client";

import Link from "next/link";
import {
  ChartPie,
  Coins,
  FileSpreadsheet,
  Percent,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { SETTINGS_CARDS } from "../../constants/settings-dummy";
import { ACCOUNTING_SETTINGS_ROUTES } from "../../constants/settings-routes";

const ICON_BY_KEY = {
  coa: FileSpreadsheet,
  taxes: Percent,
  currencies: Coins,
  "analytic-budgets": ChartPie,
} as const;

const HREF_BY_KEY = {
  coa: ACCOUNTING_SETTINGS_ROUTES.chartOfAccounts,
  taxes: ACCOUNTING_SETTINGS_ROUTES.taxes,
  currencies: ACCOUNTING_SETTINGS_ROUTES.currencies,
  "analytic-budgets": ACCOUNTING_SETTINGS_ROUTES.analyticBudgets,
} as const;

export function FeatureAccountingSettingsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {SETTINGS_CARDS.map((item) => {
        const Icon = ICON_BY_KEY[item.key];
        return (
          <Card
            key={item.key}
            className="border border-gray-200 shadow-sm transition-all duration-300 hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-800"
          >
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mb-6 flex-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Link href={HREF_BY_KEY[item.key]}>
                  {item.action_label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

