/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxMutations,
  useAccountingTaxPphRecords,
} from "@/hooks/queries";
import { toAccountingTaxApiError } from "@/services/api/accounting-tax";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxPphFilterValue,
  TaxPphRecordItem,
  TaxPphSummaryCard,
  TaxPphSummaryTone,
  TaxTabKey,
} from "../../types/tax";
import {
  buildTaxPphQueryString,
  parseTaxPphQueryState,
} from "../../utils/tax-query-state";
import { FeaturePphFilterBar } from "../features/FeaturePphFilterBar";
import { FeaturePphHeaderAction } from "../features/FeaturePphHeaderAction";
import { FeaturePphRecordsTable } from "../features/FeaturePphRecordsTable";
import { FeaturePphSummaryCards } from "../features/FeaturePphSummaryCards";
import { FeatureTaxPaginationBar } from "../features/FeatureTaxPaginationBar";
import { FeatureTaxTabNavigation } from "../features/FeatureTaxTabNavigation";

const DEFAULT_PPH_FILTERS: TaxPphFilterValue = {
  q: "",
  period: "All Periods",
  type: "All Types",
};

const PPH_PER_PAGE = 5;

const PPH_TONES: TaxPphSummaryTone[] = ["neutral", "purple", "teal", "orange"];

const PPH_NOTES_BY_KEY: Record<string, string> = {
  total_pph_withheld: "Across 18 transactions",
  pph_21: "Employee Deductions",
  pph_23: "Service Withholding",
  pph_4_2: "Final Tax",
};

function currentPeriodCode() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function TaxPphRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(
    () =>
      parseTaxPphQueryState(searchParams, {
        filters: DEFAULT_PPH_FILTERS,
        page: 1,
        perPage: PPH_PER_PAGE,
      }),
    [searchParams],
  );

  const [filters, setFilters] = useState<TaxPphFilterValue>(initialQueryState.filters);
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;

  const pphRecordsQuery = useAccountingTaxPphRecords({
    period: filters.period === "All Periods" ? undefined : filters.period,
    type: filters.type === "All Types" ? undefined : filters.type,
    q: filters.q || undefined,
    page,
    per_page: perPage,
  });
  const mutations = useAccountingTaxMutations();

  useEffect(() => {
    const nextQuery = buildTaxPphQueryString({ filters, page, perPage });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [filters, page, pathname, perPage, router, searchParams]);

  const summaryCards = useMemo<TaxPphSummaryCard[]>(() => {
    return (pphRecordsQuery.data?.summary_cards ?? []).map((card, index) => ({
      key: card.key,
      label: card.label,
      helper_text: card.helper_text ?? "",
      value: card.value,
      note: PPH_NOTES_BY_KEY[card.key] ?? "",
      tone: PPH_TONES[index] ?? "neutral",
    }));
  }, [pphRecordsQuery.data?.summary_cards]);

  const rows = useMemo<TaxPphRecordItem[]>(() => {
    return (pphRecordsQuery.data?.items ?? []).map((item) => ({
      date: item.date,
      reference_number: item.reference_number,
      partner_name: item.partner_name,
      partner_npwp: item.partner_npwp,
      pph_type: item.pph_type,
      gross_amount: item.gross_amount,
      withheld_amount: item.withheld_amount,
      category_label: item.category_label,
    }));
  }, [pphRecordsQuery.data?.items]);

  const totalItems = pphRecordsQuery.data?.pagination?.total_items ?? rows.length;
  const resolvedPage = pphRecordsQuery.data?.pagination?.page ?? page;
  const resolvedPerPage = pphRecordsQuery.data?.pagination?.per_page ?? perPage;

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
      return;
    }
    if (tab === "export-history") {
      router.push(ACCOUNTING_TAX_ROUTES.exportHistory);
      return;
    }
    router.push(ACCOUNTING_TAX_ROUTES.efakturExport);
  };

  const handleExportPphReport = async () => {
    const resolvedPeriod =
      filters.period === "All Periods"
        ? searchParams.get("period") ?? currentPeriodCode()
        : filters.period;

    const selectedTypes =
      filters.type === "All Types"
        ? (["PPh21", "PPh23", "PPh4_2", "PPhFinal"] as const)
        : ([filters.type] as const);

    try {
      await mutations.exportPphReport.mutateAsync({
        payload: {
          period: resolvedPeriod,
          types: [...selectedTypes],
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("PPh report export has been queued.");
    } catch (error) {
      toast.error(toAccountingTaxApiError(error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daftar Rekaman PPh (Income Tax)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed list of income tax withheld and payable for current period.
          </p>
        </div>
        <FeaturePphHeaderAction onExport={handleExportPphReport} />
      </section>

      {pphRecordsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(pphRecordsQuery.error).message}
        </div>
      ) : null}

      <FeaturePphSummaryCards cards={summaryCards} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="pph-records" onChange={navigateTab} />
        </div>
        <FeaturePphFilterBar
          value={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
        {pphRecordsQuery.isPending && !pphRecordsQuery.data ? (
          <div className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
            Loading PPh records...
          </div>
        ) : null}
        <FeaturePphRecordsTable rows={rows} />
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
