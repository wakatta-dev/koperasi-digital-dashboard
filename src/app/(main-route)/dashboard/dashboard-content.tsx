/** @format */

"use client";

import SummaryCard from "@/components/feature/dashboard/summary-card";
import { useLanguage } from "@/contexts/language-context";

export default function DashboardContent({ summary }: { summary: any }) {
  const { t } = useLanguage();
  return (
    <section>
      <SummaryCard />
      <h1 className="text-2xl font-bold mb-4">{t("dashboard")}</h1>
      {summary ? (
        <pre className="text-sm bg-muted p-4 rounded">
          {JSON.stringify(summary, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("summaryUnavailable")}
        </p>
      )}
    </section>
  );
}
