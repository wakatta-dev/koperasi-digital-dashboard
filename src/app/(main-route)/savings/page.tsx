"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function Savings() {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("savingsManagement")}</h1>
      <p className="mb-6">{t("savingsPlaceholder")}</p>
      <Link href="/savings/syariah" className="text-blue-600 underline">
        {t("syariahSavings")}
      </Link>
    </main>
  );
}
