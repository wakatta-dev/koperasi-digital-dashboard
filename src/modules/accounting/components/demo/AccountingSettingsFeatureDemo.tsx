/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { STITCH_PRIMARY_ACCENT_CLASS } from "../../constants/stitch";
import { AccountingSettingsAnalyticBudgetPage } from "../pages/AccountingSettingsAnalyticBudgetPage";
import { AccountingSettingsCoaPage } from "../pages/AccountingSettingsCoaPage";
import { AccountingSettingsCurrenciesPage } from "../pages/AccountingSettingsCurrenciesPage";
import { AccountingSettingsIndexPage } from "../pages/AccountingSettingsIndexPage";
import { AccountingSettingsTaxesPage } from "../pages/AccountingSettingsTaxesPage";

type ActiveSettingsView = "overview" | "coa" | "taxes" | "currencies" | "analytic-budget";

export function AccountingSettingsFeatureDemo() {
  const [activeView, setActiveView] = useState<ActiveSettingsView>("overview");

  return (
    <section className="space-y-4" aria-label="Accounting settings demo wrapper">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Akuntansi</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi modul akuntansi, pajak, mata uang, dan anggaran.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className={activeView === "overview" ? STITCH_PRIMARY_ACCENT_CLASS : undefined}
          variant={activeView === "overview" ? "default" : "outline"}
          onClick={() => setActiveView("overview")}
        >
          Overview
        </Button>
        <Button
          type="button"
          className={activeView === "coa" ? STITCH_PRIMARY_ACCENT_CLASS : undefined}
          variant={activeView === "coa" ? "default" : "outline"}
          onClick={() => setActiveView("coa")}
        >
          Chart of Accounts
        </Button>
        <Button
          type="button"
          className={activeView === "taxes" ? STITCH_PRIMARY_ACCENT_CLASS : undefined}
          variant={activeView === "taxes" ? "default" : "outline"}
          onClick={() => setActiveView("taxes")}
        >
          Taxes
        </Button>
        <Button
          type="button"
          className={activeView === "currencies" ? STITCH_PRIMARY_ACCENT_CLASS : undefined}
          variant={activeView === "currencies" ? "default" : "outline"}
          onClick={() => setActiveView("currencies")}
        >
          Currencies
        </Button>
        <Button
          type="button"
          className={activeView === "analytic-budget" ? STITCH_PRIMARY_ACCENT_CLASS : undefined}
          variant={activeView === "analytic-budget" ? "default" : "outline"}
          onClick={() => setActiveView("analytic-budget")}
        >
          Analytic &amp; Budget
        </Button>
      </div>

      {activeView === "overview" ? <AccountingSettingsIndexPage /> : null}
      {activeView === "coa" ? <AccountingSettingsCoaPage /> : null}
      {activeView === "taxes" ? <AccountingSettingsTaxesPage /> : null}
      {activeView === "currencies" ? <AccountingSettingsCurrenciesPage /> : null}
      {activeView === "analytic-budget" ? <AccountingSettingsAnalyticBudgetPage /> : null}
    </section>
  );
}

