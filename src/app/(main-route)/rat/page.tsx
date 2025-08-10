"use client";

import { useLanguage } from "@/contexts/language-context";

export default function Rat() {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("ratManagement")}</h1>
      <p>{t("ratPlaceholder")}</p>
    </main>
  );
}
