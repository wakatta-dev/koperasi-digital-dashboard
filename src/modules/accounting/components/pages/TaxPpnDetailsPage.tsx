/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

const VALID_PPN_PERIODS = new Set(PPN_PERIOD_OPTIONS.map((option) => option.value));

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

const PPN_ROWS: TaxPpnTransactionItem[] = [
  {
    period_code: "2023-11",
    date: "Nov 25, 2023",
    invoice_number: "INV/2023/11/001",
    counterparty_name: "PT Sinar Jaya Abadi",
    counterparty_npwp: "01.234.567.8-012.000",
    transaction_type: "Sales",
    tax_base_amount: 100_000_000,
    vat_amount: 11_000_000,
  },
  {
    period_code: "2023-11",
    date: "Nov 24, 2023",
    invoice_number: "INV/2023/11/002",
    counterparty_name: "CV Maju Bersama",
    counterparty_npwp: "22.111.987.6-123.000",
    transaction_type: "Purchase",
    tax_base_amount: 65_000_000,
    vat_amount: 7_150_000,
  },
  {
    period_code: "2023-11",
    date: "Nov 23, 2023",
    invoice_number: "INV/2023/11/003",
    counterparty_name: "PT Karya Niaga",
    counterparty_npwp: "74.888.765.4-543.000",
    transaction_type: "Sales",
    tax_base_amount: 82_000_000,
    vat_amount: 9_020_000,
  },
  {
    period_code: "2023-11",
    date: "Nov 22, 2023",
    invoice_number: "INV/2023/11/004",
    counterparty_name: "PT Mitra Sukses",
    counterparty_npwp: "11.222.333.4-555.000",
    transaction_type: "Purchase",
    tax_base_amount: 46_000_000,
    vat_amount: 5_060_000,
  },
  {
    period_code: "2023-11",
    date: "Nov 21, 2023",
    invoice_number: "INV/2023/11/005",
    counterparty_name: "UD Berkah Sentosa",
    counterparty_npwp: "45.333.222.1-000.000",
    transaction_type: "Sales",
    tax_base_amount: 38_000_000,
    vat_amount: 4_180_000,
  },
];

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

  const filteredRows = useMemo(() => {
    const searchNeedle = filters.q.trim().toLowerCase();

    return PPN_ROWS.filter((row) => {
      const periodPass =
        filters.period === "All Periods" ||
        row.period_code === filters.period;
      const typePass =
        filters.transaction_type === "All Types" || row.transaction_type === filters.transaction_type;
      const searchPass =
        searchNeedle.length === 0 ||
        row.invoice_number.toLowerCase().includes(searchNeedle) ||
        row.counterparty_name.toLowerCase().includes(searchNeedle);
      return periodPass && typePass && searchPass;
    });
  }, [filters.period, filters.q, filters.transaction_type]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page, perPage]);

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
          onDownload={() => undefined}
        />
      </section>

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
        <FeaturePpnDetailTable rows={paginatedRows} />
        <FeatureTaxPaginationBar
          page={page}
          perPage={perPage}
          totalItems={filteredRows.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
