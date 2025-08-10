/** @format */

"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function MainPage() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p>{t("mainDescription")}</p>
      <p className="max-w-md">{t("pricingInfo")}</p>
      <Link href="/login" className="text-blue-600 underline">
        {t("loginLink")}
      </Link>
    </main>
  );
}

