"use client";

import { useLanguage } from "@/contexts/language-context";

export default function Billing() {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("billingManagement")}</h1>
      <p>{t("billingPlaceholder")}</p>
    </main>
  );
}
