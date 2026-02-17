/** @format */

"use client";

import { useMemo } from "react";

import { useAccountingSettingsOverview } from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { SETTINGS_CARDS } from "../../constants/settings-dummy";
import { mapSettingsOverviewCards } from "../../utils/settings-api-mappers";
import { FeatureAccountingSettingsCards } from "../features/FeatureAccountingSettingsCards";

export function AccountingSettingsIndexPage() {
  const overviewQuery = useAccountingSettingsOverview();

  const cards = useMemo(() => {
    if (!overviewQuery.data?.items?.length) {
      return SETTINGS_CARDS;
    }

    return mapSettingsOverviewCards(overviewQuery.data.items);
  }, [overviewQuery.data?.items]);

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Akuntansi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi modul akuntansi, pajak, mata uang, dan anggaran.
        </p>
      </section>
      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingSettingsApiError(overviewQuery.error).message}
        </div>
      ) : null}
      <FeatureAccountingSettingsCards items={cards} />
    </div>
  );
}
