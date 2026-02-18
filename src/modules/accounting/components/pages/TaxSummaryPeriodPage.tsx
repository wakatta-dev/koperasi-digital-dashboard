/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxSummaryFilterValue,
  TaxSummaryMetricCard,
  TaxSummaryPeriodItem,
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

const SUMMARY_CARDS: TaxSummaryMetricCard[] = [
  {
    key: "total_ppn_keluaran",
    label: "Total PPN Keluaran",
    helper_text: "Output VAT (Collected)",
    value: "Rp 485.250.000",
    tone: "warning",
  },
  {
    key: "total_ppn_masukan",
    label: "Total PPN Masukan",
    helper_text: "Input VAT (Creditable)",
    value: "Rp 312.500.000",
    tone: "success",
  },
  {
    key: "ppn_kurang_bayar",
    label: "PPN Kurang Bayar",
    helper_text: "VAT Payable",
    value: "Rp 172.750.000",
    tone: "primary",
  },
  {
    key: "total_pph_terutang",
    label: "Total PPh Terutang",
    helper_text: "Income Tax (21, 23, 4(2))",
    value: "Rp 45.800.000",
    tone: "danger",
  },
];

const SUMMARY_ROWS: TaxSummaryPeriodItem[] = [
  {
    period_label: "November 2023",
    period_code: "2023-11",
    ppn_keluaran: 485_250_000,
    ppn_masukan: 312_500_000,
    net_amount: 172_750_000,
    net_position: "KB",
    total_pph: 45_800_000,
    status: "Open",
  },
  {
    period_label: "October 2023",
    period_code: "2023-10",
    ppn_keluaran: 430_100_000,
    ppn_masukan: 301_000_000,
    net_amount: 129_100_000,
    net_position: "KB",
    total_pph: 40_300_000,
    status: "Reported",
  },
  {
    period_label: "September 2023",
    period_code: "2023-09",
    ppn_keluaran: 375_700_000,
    ppn_masukan: 389_300_000,
    net_amount: 13_600_000,
    net_position: "LB",
    total_pph: 37_200_000,
    status: "Compensated",
  },
  {
    period_label: "August 2023",
    period_code: "2023-08",
    ppn_keluaran: 398_300_000,
    ppn_masukan: 276_200_000,
    net_amount: 122_100_000,
    net_position: "KB",
    total_pph: 34_900_000,
    status: "Reported",
  },
  {
    period_label: "July 2023",
    period_code: "2023-07",
    ppn_keluaran: 356_950_000,
    ppn_masukan: 248_150_000,
    net_amount: 108_800_000,
    net_position: "KB",
    total_pph: 33_100_000,
    status: "Reported",
  },
  {
    period_label: "June 2023",
    period_code: "2023-06",
    ppn_keluaran: 330_000_000,
    ppn_masukan: 210_000_000,
    net_amount: 120_000_000,
    net_position: "KB",
    total_pph: 30_750_000,
    status: "Reported",
  },
];

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

  useEffect(() => {
    const nextQuery = buildTaxSummaryQueryString({ filters, page, perPage });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [filters, page, perPage, pathname, router, searchParams]);

  const filteredRows = useMemo(() => {
    const needle = filters.q.trim().toLowerCase();

    return SUMMARY_ROWS.filter((row) => {
      const yearPass =
        filters.year === "All Years" || row.period_code.startsWith(filters.year);
      const statusPass = filters.status === "all" || row.status === filters.status;
      const searchPass =
        needle.length === 0 ||
        row.period_label.toLowerCase().includes(needle) ||
        row.period_code.toLowerCase().includes(needle);
      return yearPass && statusPass && searchPass;
    });
  }, [filters.q, filters.status, filters.year]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page, perPage]);

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
        <FeatureTaxTopActions />
      </section>

      <FeatureTaxSummaryCards cards={SUMMARY_CARDS} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <FeatureTaxTabNavigation value="summary" onChange={handleNavigateTab} />
        </div>
        <FeatureTaxSummaryFilterBar
          value={filters}
          yearOptions={["All Years", "2023", "2022"]}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
        <FeatureTaxSummaryPeriodTable
          rows={paginatedRows}
          onDetails={(row) => {
            const backQuery = buildTaxSummaryQueryString({ filters, page, perPage });
            const from = encodeURIComponent(backQuery);
            router.push(
              `${ACCOUNTING_TAX_ROUTES.ppnDetails}?period=${encodeURIComponent(row.period_code)}&from=${from}`,
            );
          }}
        />
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
