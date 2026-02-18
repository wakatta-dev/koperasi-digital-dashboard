/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxExportHistory,
  useAccountingTaxMutations,
  useAccountingTaxOverview,
} from "@/hooks/queries";
import { toAccountingTaxApiError } from "@/services/api/accounting-tax";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxExportHistoryFilterValue,
  TaxExportHistoryItem,
  TaxSummaryMetricCard,
  TaxSummaryTone,
  TaxTabKey,
} from "../../types/tax";
import {
  buildTaxExportHistoryQueryString,
  parseTaxExportHistoryQueryState,
} from "../../utils/tax-query-state";
import { FeatureTaxExportHistoryFilterBar } from "../features/FeatureTaxExportHistoryFilterBar";
import { FeatureTaxExportHistoryTable } from "../features/FeatureTaxExportHistoryTable";
import { FeatureTaxPaginationBar } from "../features/FeatureTaxPaginationBar";
import { FeatureTaxSummaryCards } from "../features/FeatureTaxSummaryCards";
import { FeatureTaxTabNavigation } from "../features/FeatureTaxTabNavigation";
import { FeatureTaxTopActions } from "../features/FeatureTaxTopActions";

const DEFAULT_EXPORT_HISTORY_FILTERS: TaxExportHistoryFilterValue = {
  q: "",
  type: "all",
  status: "all",
};

const EXPORT_HISTORY_PER_PAGE = 5;

function toSummaryTone(tone?: string): TaxSummaryTone {
  if (tone === "warning" || tone === "success" || tone === "danger" || tone === "primary") {
    return tone;
  }
  return "primary";
}

export function TaxExportHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(
    () =>
      parseTaxExportHistoryQueryState(searchParams, {
        filters: DEFAULT_EXPORT_HISTORY_FILTERS,
        page: 1,
        perPage: EXPORT_HISTORY_PER_PAGE,
      }),
    [searchParams],
  );

  const [filters, setFilters] = useState<TaxExportHistoryFilterValue>(
    initialQueryState.filters,
  );
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;

  const overviewQuery = useAccountingTaxOverview();
  const exportHistoryQuery = useAccountingTaxExportHistory({
    q: filters.q || undefined,
    type: filters.type === "all" ? undefined : filters.type,
    status: filters.status === "all" ? undefined : filters.status,
    page,
    per_page: perPage,
  });
  const mutations = useAccountingTaxMutations();

  useEffect(() => {
    const nextQuery = buildTaxExportHistoryQueryString({ filters, page, perPage });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [filters, page, pathname, perPage, router, searchParams]);

  const summaryCards = useMemo<TaxSummaryMetricCard[]>(() => {
    return (overviewQuery.data?.cards ?? []).map((card) => ({
      key: card.key,
      label: card.label,
      value: card.value,
      helper_text: card.helper_text,
      tone: toSummaryTone(card.tone),
    }));
  }, [overviewQuery.data?.cards]);

  const rows = useMemo<TaxExportHistoryItem[]>(() => {
    return (exportHistoryQuery.data?.items ?? []).map((item) => ({
      export_id: item.export_id,
      date: item.date,
      time: item.time,
      file_name: item.file_name,
      export_type: item.export_type,
      status: item.status,
      can_retry: item.can_retry,
      can_download: item.can_download,
    }));
  }, [exportHistoryQuery.data?.items]);

  const totalItems = exportHistoryQuery.data?.pagination?.total_items ?? rows.length;
  const resolvedPage = exportHistoryQuery.data?.pagination?.page ?? page;
  const resolvedPerPage = exportHistoryQuery.data?.pagination?.per_page ?? perPage;

  const navigateTab = (tab: TaxTabKey) => {
    if (tab === "summary") {
      router.push(ACCOUNTING_TAX_ROUTES.summary);
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
      return;
    }
    router.push(ACCOUNTING_TAX_ROUTES.efakturExport);
  };

  const handleGenerateTaxReport = async () => {
    const activePeriodCode = overviewQuery.data?.active_period
      ? `${overviewQuery.data.active_period.year}-${String(overviewQuery.data.active_period.month).padStart(2, "0")}`
      : undefined;

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

  const handleRetryExport = async (row: TaxExportHistoryItem) => {
    try {
      await mutations.retryExportHistory.mutateAsync({
        exportId: row.export_id,
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Export retry has been queued.");
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
      {exportHistoryQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(exportHistoryQuery.error).message}
        </div>
      ) : null}

      <FeatureTaxSummaryCards cards={summaryCards} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="export-history" onChange={navigateTab} />
        </div>

        <FeatureTaxExportHistoryFilterBar
          value={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {exportHistoryQuery.isPending && !exportHistoryQuery.data ? (
          <div className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
            Loading tax export history...
          </div>
        ) : null}

        <FeatureTaxExportHistoryTable
          rows={rows}
          onDownload={() => toast.success("Download link requested.")}
          onRetry={handleRetryExport}
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
