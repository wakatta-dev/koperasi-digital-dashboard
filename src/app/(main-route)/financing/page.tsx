"use client";

import { useLanguage } from "@/contexts/language-context";

export default function Financing() {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("financingManagement")}</h1>
      <p>{t("financingPlaceholder")}</p>
    </main>
  );
}
