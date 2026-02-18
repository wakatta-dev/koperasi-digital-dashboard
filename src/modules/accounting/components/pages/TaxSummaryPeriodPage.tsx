/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxMutations,
  useAccountingTaxOverview,
  useAccountingTaxPeriods,
} from "@/hooks/queries";
import { toAccountingTaxApiError } from "@/services/api/accounting-tax";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxSummaryFilterValue,
  TaxSummaryMetricCard,
  TaxSummaryTone,
  TaxTabKey,
} from "../../types/tax";
import {
  buildTaxSummaryQueryString,
  parseTaxSummaryQueryState,
} from "../../utils/tax-query-state";
import { FeatureTaxPaginationBar } from "../features/FeatureTaxPaginationBar";
import { FeatureTaxSummaryCards } from "../features/FeatureTaxSummaryCards";
import { FeatureTaxSummaryFilterBar } from "../features/FeatureTaxSummaryFilterBar";
import { FeatureTaxSummaryPeriodTable } from "../features/FeatureTaxSummaryPeriodTable";
import { FeatureTaxTabNavigation } from "../features/FeatureTaxTabNavigation";
import { FeatureTaxTopActions } from "../features/FeatureTaxTopActions";

const DEFAULT_SUMMARY_FILTERS: TaxSummaryFilterValue = {
  q: "",
  year: "All Years",
  status: "all",
};

const SUMMARY_PER_PAGE = 5;

function toSummaryTone(tone?: string): TaxSummaryTone {
  if (tone === "warning" || tone === "success" || tone === "danger" || tone === "primary") {
    return tone;
  }
  return "primary";
}

export function TaxSummaryPeriodPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(
    () =>
      parseTaxSummaryQueryState(searchParams, {
        filters: DEFAULT_SUMMARY_FILTERS,
        page: 1,
        perPage: SUMMARY_PER_PAGE,
      }),
    [searchParams],
  );

  const [filters, setFilters] = useState<TaxSummaryFilterValue>(initialQueryState.filters);
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;

  const overviewQuery = useAccountingTaxOverview();
  const periodsQuery = useAccountingTaxPeriods({
    q: filters.q || undefined,
    year: filters.year === "All Years" ? undefined : filters.year,
    status: filters.status === "all" ? undefined : filters.status,
    page,
    per_page: perPage,
  });
  const mutations = useAccountingTaxMutations();

  useEffect(() => {
    const nextQuery = buildTaxSummaryQueryString({ filters, page, perPage });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [filters, page, perPage, pathname, router, searchParams]);

  const summaryCards = useMemo<TaxSummaryMetricCard[]>(() => {
    return (overviewQuery.data?.cards ?? []).map((card) => ({
      key: card.key,
      label: card.label,
      value: card.value,
      helper_text: card.helper_text,
      tone: toSummaryTone(card.tone),
    }));
  }, [overviewQuery.data?.cards]);

  const summaryRows = useMemo(
    () => periodsQuery.data?.items ?? [],
    [periodsQuery.data?.items],
  );

  const totalItems = periodsQuery.data?.pagination?.total_items ?? summaryRows.length;
  const resolvedPage = periodsQuery.data?.pagination?.page ?? page;
  const resolvedPerPage = periodsQuery.data?.pagination?.per_page ?? perPage;

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    summaryRows.forEach((row) => {
      if (row.period_code.length >= 4) {
        years.add(row.period_code.slice(0, 4));
      }
    });

    if (filters.year !== "All Years") {
      years.add(filters.year);
    }

    return ["All Years", ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
  }, [filters.year, summaryRows]);

  const handleNavigateTab = (tab: TaxTabKey) => {
    if (tab === "summary") {
      return;
    }

    if (tab === "ppn-details") {
      router.push(ACCOUNTING_TAX_ROUTES.ppnDetails);
      return;
    }
    if (tab === "pph-records") {
      router.push(ACCOUNTING_TAX_ROUTES.pphRecords);
      return;
    }
    if (tab === "export-history") {
      router.push(ACCOUNTING_TAX_ROUTES.exportHistory);
      return;
    }
    router.push(ACCOUNTING_TAX_ROUTES.efakturExport);
  };

  const handleGenerateTaxReport = async () => {
    const activePeriodCode = overviewQuery.data?.active_period
      ? `${overviewQuery.data.active_period.year}-${String(overviewQuery.data.active_period.month).padStart(2, "0")}`
      : summaryRows[0]?.period_code;

    if (!activePeriodCode) {
      toast.error("Tax period is not available.");
      return;
    }

    try {
      await mutations.generateTaxReport.mutateAsync({
        payload: {
          period: activePeriodCode,
          report_types: ["PPNSummary", "PPhReport"],
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Tax report generation has been queued.");
    } catch (error) {
      toast.error(toAccountingTaxApiError(error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tax Management (PPN & PPh)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your tax obligations, generate reports, and export e-Faktur.
          </p>
        </div>
        <FeatureTaxTopActions
          onGenerateTaxReport={handleGenerateTaxReport}
          onExportEfaktur={() => router.push(ACCOUNTING_TAX_ROUTES.efakturExport)}
        />
      </section>

      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(overviewQuery.error).message}
        </div>
      ) : null}
      {periodsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(periodsQuery.error).message}
        </div>
      ) : null}
      {overviewQuery.isPending && !overviewQuery.data ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading tax overview...
        </div>
      ) : null}

      <FeatureTaxSummaryCards cards={summaryCards} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="summary" onChange={handleNavigateTab} />
        </div>
        <FeatureTaxSummaryFilterBar
          value={filters}
          yearOptions={yearOptions.length > 1 ? yearOptions : ["All Years", "2023", "2022"]}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
        {periodsQuery.isPending && !periodsQuery.data ? (
          <div className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
            Loading tax period summary...
          </div>
        ) : null}
        <FeatureTaxSummaryPeriodTable
          rows={summaryRows}
          onDetails={(row) => {
            const backQuery = buildTaxSummaryQueryString({ filters, page, perPage });
            const from = encodeURIComponent(backQuery);
            router.push(
              `${ACCOUNTING_TAX_ROUTES.ppnDetails}?period=${encodeURIComponent(row.period_code)}&from=${from}`,
            );
          }}
        />
        <FeatureTaxPaginationBar
          page={resolvedPage}
          perPage={resolvedPerPage}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
