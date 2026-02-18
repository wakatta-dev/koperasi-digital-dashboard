/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxExportHistoryFilterValue,
  TaxExportHistoryItem,
  TaxSummaryMetricCard,
  TaxTabKey,
} from "../../types/tax";
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

const EXPORT_HISTORY_ROWS: TaxExportHistoryItem[] = [
  {
    export_id: "exp_001",
    date: "28 Nov 2023",
    time: "14:30 WIB",
    file_name: "efaktur_out_nov2023.csv",
    export_type: "EFaktur",
    status: "Success",
    can_retry: false,
    can_download: true,
  },
  {
    export_id: "exp_002",
    date: "25 Nov 2023",
    time: "09:15 WIB",
    file_name: "pph_report_masa_10.pdf",
    export_type: "PPhReport",
    status: "Success",
    can_retry: false,
    can_download: true,
  },
  {
    export_id: "exp_003",
    date: "20 Nov 2023",
    time: "11:00 WIB",
    file_name: "ppn_summary_oct2023.xlsx",
    export_type: "PPNSummary",
    status: "Failed",
    can_retry: true,
    can_download: false,
  },
  {
    export_id: "exp_004",
    date: "15 Oct 2023",
    time: "16:45 WIB",
    file_name: "efaktur_out_oct2023.csv",
    export_type: "EFaktur",
    status: "Success",
    can_retry: false,
    can_download: true,
  },
  {
    export_id: "exp_005",
    date: "15 Oct 2023",
    time: "10:00 WIB",
    file_name: "pph_21_sep2023_final.pdf",
    export_type: "PPhReport",
    status: "Success",
    can_retry: false,
    can_download: true,
  },
];

export function TaxExportHistoryPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TaxExportHistoryFilterValue>(
    DEFAULT_EXPORT_HISTORY_FILTERS,
  );
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const needle = filters.q.trim().toLowerCase();

    return EXPORT_HISTORY_ROWS.filter((row) => {
      const searchPass = needle.length === 0 || row.file_name.toLowerCase().includes(needle);
      const typePass = filters.type === "all" || row.export_type === filters.type;
      const statusPass = filters.status === "all" || row.status === filters.status;
      return searchPass && typePass && statusPass;
    });
  }, [filters.q, filters.status, filters.type]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * EXPORT_HISTORY_PER_PAGE;
    return filteredRows.slice(start, start + EXPORT_HISTORY_PER_PAGE);
  }, [filteredRows, page]);

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
          <FeatureTaxTabNavigation value="export-history" onChange={navigateTab} />
        </div>

        <FeatureTaxExportHistoryFilterBar
          value={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        <FeatureTaxExportHistoryTable
          rows={paginatedRows}
          onDownload={() => undefined}
          onRetry={() => undefined}
        />

        <FeatureTaxPaginationBar
          page={page}
          perPage={EXPORT_HISTORY_PER_PAGE}
          totalItems={filteredRows.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
