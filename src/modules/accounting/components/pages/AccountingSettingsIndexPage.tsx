/** @format */

"use client";

import { FeatureAccountingSettingsCards } from "../features/FeatureAccountingSettingsCards";

export function AccountingSettingsIndexPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Akuntansi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi modul akuntansi, pajak, mata uang, dan anggaran.
        </p>
      </section>
      <FeatureAccountingSettingsCards />
    </div>
  );
}
