/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxMutations,
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

const PPN_PERIOD_OPTIONS = [
  { label: "All Periods", value: "All Periods" },
  { label: "November 2023", value: "2023-11" },
  { label: "October 2023", value: "2023-10" },
  { label: "September 2023", value: "2023-09" },
] as const;

const PPN_PERIOD_LABEL_TO_VALUE: Record<string, string> = {
  "All Periods": "All Periods",
  "November 2023": "2023-11",
  "October 2023": "2023-10",
  "September 2023": "2023-09",
};

const VALID_PPN_PERIODS = new Set<string>(
  PPN_PERIOD_OPTIONS.map((option) => option.value),
);

function normalizePpnPeriod(rawPeriod: string) {
  if (VALID_PPN_PERIODS.has(rawPeriod)) {
    return rawPeriod;
  }

  const normalized = PPN_PERIOD_LABEL_TO_VALUE[rawPeriod];
  if (normalized) {
    return normalized;
  }

  return DEFAULT_PPN_FILTERS.period;
}

export function TaxPpnDetailsPage({
  period,
  returnToQuery,
}: TaxPpnDetailsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(() => {
    const parsed = parseTaxPpnQueryState(searchParams, {
      filters: {
        ...DEFAULT_PPN_FILTERS,
        period: period ?? searchParams.get("period") ?? DEFAULT_PPN_FILTERS.period,
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
  }, [period, searchParams]);

  const [filters, setFilters] = useState<TaxPpnFilterValue>(initialQueryState.filters);
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;

  const vatTransactionsQuery = useAccountingTaxVatTransactions({
    period: filters.period === "All Periods" ? undefined : filters.period,
    transaction_type:
      filters.transaction_type === "All Types" ? undefined : filters.transaction_type,
    q: filters.q || undefined,
    page,
    per_page: perPage,
  });
  const mutations = useAccountingTaxMutations();

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
      ? normalizePpnPeriod(period ?? searchParams.get("period") ?? "All Periods")
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="ppn-details" onChange={navigateTab} />
        </div>
        <FeaturePpnDetailFilterBar
          value={filters}
          periodOptions={PPN_PERIOD_OPTIONS}
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
