/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxMutations,
  useAccountingTaxOverview,
  useAccountingTaxVatTransactions,
} from "@/hooks/queries";
import { toAccountingTaxApiError } from "@/services/api/accounting-tax";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxPpnFilterValue,
  TaxPpnTransactionItem,
  TaxTabKey,
} from "../../types/tax";
import {
  buildTaxPpnQueryString,
  parseTaxPpnQueryState,
} from "../../utils/tax-query-state";
import { FeaturePpnDetailFilterBar } from "../features/FeaturePpnDetailFilterBar";
import { FeaturePpnDetailHeaderAction } from "../features/FeaturePpnDetailHeaderAction";
import { FeaturePpnDetailTable } from "../features/FeaturePpnDetailTable";
import { FeatureTaxPaginationBar } from "../features/FeatureTaxPaginationBar";
import { FeatureTaxTabNavigation } from "../features/FeatureTaxTabNavigation";

type TaxPpnDetailsPageProps = {
  period?: string;
  returnToQuery?: string;
};

const DEFAULT_PPN_FILTERS: TaxPpnFilterValue = {
  q: "",
  period: "All Periods",
  transaction_type: "All Types",
};

const PPN_PER_PAGE = 5;

function normalizePpnPeriod(rawPeriod: string) {
  const trimmed = rawPeriod.trim();
  return trimmed || DEFAULT_PPN_FILTERS.period;
}

function formatPeriodLabel(periodCode: string): string {
  const parsed = /^(\d{4})-(\d{2})$/.exec(periodCode);
  if (!parsed) {
    return periodCode;
  }
  const year = Number(parsed[1]);
  const month = Number(parsed[2]);
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return periodCode;
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function TaxPpnDetailsPage({
  period,
  returnToQuery,
}: TaxPpnDetailsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const periodFromQuery = searchParams.get("period") ?? "";

  const initialQueryState = useMemo(() => {
    const parsed = parseTaxPpnQueryState(searchParams, {
      filters: {
        ...DEFAULT_PPN_FILTERS,
        period: period ?? periodFromQuery ?? DEFAULT_PPN_FILTERS.period,
      },
      page: 1,
      perPage: PPN_PER_PAGE,
    });

    return {
      ...parsed,
      filters: {
        ...parsed.filters,
        period: normalizePpnPeriod(parsed.filters.period),
      },
    };
  }, [period, periodFromQuery, searchParams]);

  const [filters, setFilters] = useState<TaxPpnFilterValue>(initialQueryState.filters);
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;

  const overviewQuery = useAccountingTaxOverview();
  const vatTransactionsQuery = useAccountingTaxVatTransactions({
    period: filters.period === "All Periods" ? undefined : filters.period,
    transaction_type:
      filters.transaction_type === "All Types" ? undefined : filters.transaction_type,
    q: filters.q || undefined,
    page,
    per_page: perPage,
  });
  const mutations = useAccountingTaxMutations();

  const periodOptions = useMemo<ReadonlyArray<{ label: string; value: string }>>(() => {
    const optionMap = new Map<string, string>([["All Periods", "All Periods"]]);
    const activePeriodCode = overviewQuery.data?.active_period
      ? `${overviewQuery.data.active_period.year}-${String(overviewQuery.data.active_period.month).padStart(2, "0")}`
      : "";
    if (activePeriodCode) {
      optionMap.set(activePeriodCode, overviewQuery.data?.active_period.label || activePeriodCode);
    }
    if (filters.period !== "All Periods") {
      optionMap.set(filters.period, formatPeriodLabel(filters.period));
    }
    const fromQuery = period || periodFromQuery || "";
    if (fromQuery && fromQuery !== "All Periods") {
      optionMap.set(fromQuery, formatPeriodLabel(fromQuery));
    }

    return Array.from(optionMap.entries()).map(([value, label]) => ({ value, label }));
  }, [
    filters.period,
    overviewQuery.data?.active_period,
    periodFromQuery,
    period,
  ]);

  useEffect(() => {
    const baseQuery = buildTaxPpnQueryString({ filters, page, perPage });
    const params = new URLSearchParams(baseQuery);
    const fromValue = searchParams.get("from") ?? returnToQuery;
    if (fromValue) {
      params.set("from", fromValue);
    }
    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [filters, page, pathname, perPage, returnToQuery, router, searchParams]);

  const activePeriodCode =
    filters.period === "All Periods"
      ? normalizePpnPeriod(
          period ??
            periodFromQuery ??
            (overviewQuery.data?.active_period
              ? `${overviewQuery.data.active_period.year}-${String(overviewQuery.data.active_period.month).padStart(2, "0")}`
              : "All Periods"),
        )
      : filters.period;

  const rows = useMemo<TaxPpnTransactionItem[]>(() => {
    return (vatTransactionsQuery.data?.items ?? []).map((item) => ({
      period_code: activePeriodCode,
      date: item.date,
      invoice_number: item.invoice_number,
      counterparty_name: item.counterparty_name,
      counterparty_npwp: item.counterparty_npwp,
      transaction_type: item.transaction_type,
      tax_base_amount: item.tax_base_amount,
      vat_amount: item.vat_amount,
    }));
  }, [activePeriodCode, vatTransactionsQuery.data?.items]);

  const totalItems = vatTransactionsQuery.data?.pagination?.total_items ?? rows.length;
  const resolvedPage = vatTransactionsQuery.data?.pagination?.page ?? page;
  const resolvedPerPage = vatTransactionsQuery.data?.pagination?.per_page ?? perPage;

  const navigateTab = (tab: TaxTabKey) => {
    if (tab === "summary") {
      const fromValue = searchParams.get("from") ?? returnToQuery;
      if (fromValue) {
        try {
          const decoded = decodeURIComponent(fromValue);
          router.push(
            decoded
              ? `${ACCOUNTING_TAX_ROUTES.summary}?${decoded}`
              : ACCOUNTING_TAX_ROUTES.summary,
          );
          return;
        } catch {
          router.push(ACCOUNTING_TAX_ROUTES.summary);
          return;
        }
      }
      router.push(ACCOUNTING_TAX_ROUTES.summary);
      return;
    }
    if (tab === "ppn-details") {
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

  const handleDownloadRecapitulation = async () => {
    const selectedPeriod = filters.period === "All Periods" ? activePeriodCode : filters.period;
    if (!selectedPeriod || selectedPeriod === "All Periods") {
      toast.error("Select a tax period before downloading recapitulation.");
      return;
    }

    try {
      await mutations.exportPpnRecapitulation.mutateAsync({
        payload: {
          period: selectedPeriod,
          transaction_type:
            filters.transaction_type === "All Types" ? undefined : filters.transaction_type,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("PPN recapitulation export has been queued.");
    } catch (error) {
      toast.error(toAccountingTaxApiError(error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detail Transaksi PPN (VAT)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review detailed list of all transactions subject to VAT.
          </p>
        </div>
        <FeaturePpnDetailHeaderAction
          onBackToSummary={() => navigateTab("summary")}
          onDownload={handleDownloadRecapitulation}
        />
      </section>

      {vatTransactionsQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(vatTransactionsQuery.error).message}
        </div>
      ) : null}
      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(overviewQuery.error).message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="ppn-details" onChange={navigateTab} />
        </div>
        <FeaturePpnDetailFilterBar
          value={filters}
          periodOptions={periodOptions}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
        {vatTransactionsQuery.isPending && !vatTransactionsQuery.data ? (
          <div className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
            Loading VAT transactions...
          </div>
        ) : null}
        <FeaturePpnDetailTable
          rows={rows}
          vatAmountTotal={vatTransactionsQuery.data?.totals?.vat_amount_total}
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
