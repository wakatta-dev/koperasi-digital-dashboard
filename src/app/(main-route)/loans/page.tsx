"use client";

import { useLanguage } from "@/contexts/language-context";

export default function Loans() {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("loansManagement")}</h1>
      <p>{t("loansPlaceholder")}</p>
    </main>
  );
}
