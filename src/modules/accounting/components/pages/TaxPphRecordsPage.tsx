/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxPphFilterValue,
  TaxPphRecordItem,
  TaxPphSummaryCard,
  TaxTabKey,
} from "../../types/tax";
import { FeaturePphFilterBar } from "../features/FeaturePphFilterBar";
import { FeaturePphHeaderAction } from "../features/FeaturePphHeaderAction";
import { FeaturePphRecordsTable } from "../features/FeaturePphRecordsTable";
import { FeaturePphSummaryCards } from "../features/FeaturePphSummaryCards";
import { FeatureTaxPaginationBar } from "../features/FeatureTaxPaginationBar";
import { FeatureTaxTabNavigation } from "../features/FeatureTaxTabNavigation";

const DEFAULT_PPH_FILTERS: TaxPphFilterValue = {
  q: "",
  period: "November 2023",
  type: "All Types",
};

const PPH_PER_PAGE = 5;

const PPH_SUMMARY_CARDS: TaxPphSummaryCard[] = [
  {
    key: "total_pph_withheld",
    label: "Total PPh Withheld",
    helper_text: "Current Period (Nov 2023)",
    value: "Rp 45.800.000",
    note: "Across 18 transactions",
    tone: "neutral",
  },
  {
    key: "pph_21_employee",
    label: "PPh 21 (Employee)",
    helper_text: "Payroll Tax",
    value: "Rp 28.500.000",
    note: "Employee Deductions",
    tone: "purple",
  },
  {
    key: "pph_23_services",
    label: "PPh 23 (Services)",
    helper_text: "Services & Rental",
    value: "Rp 12.300.000",
    note: "Service Withholding",
    tone: "teal",
  },
  {
    key: "pph_4_2_final",
    label: "PPh 4(2) Final",
    helper_text: "Construction & Rent",
    value: "Rp 5.000.000",
    note: "Final Tax",
    tone: "orange",
  },
];

const PPH_ROWS: TaxPphRecordItem[] = [
  {
    date: "28 Nov 2023",
    reference_number: "INV/2023/11/045",
    partner_name: "PT. Mandiri Jaya",
    partner_npwp: "01.234.567.8-123.000",
    pph_type: "PPh23",
    gross_amount: 25_000_000,
    withheld_amount: 500_000,
    category_label: "Jasa Teknik",
  },
  {
    date: "25 Nov 2023",
    reference_number: "BILL/2023/11/012",
    partner_name: "CV. Abadi Sentosa",
    partner_npwp: "02.456.789.1-456.000",
    pph_type: "PPh4_2",
    gross_amount: 50_000_000,
    withheld_amount: 5_000_000,
    category_label: "Sewa Tanah/Bangunan",
  },
  {
    date: "20 Nov 2023",
    reference_number: "PAY/2023/11/001",
    partner_name: "Employee Payroll Nov",
    pph_type: "PPh21",
    gross_amount: 450_000_000,
    withheld_amount: 28_500_000,
    category_label: "Pegawai Tetap",
  },
  {
    date: "15 Nov 2023",
    reference_number: "INV/2023/11/022",
    partner_name: "PT. Solusi IT Global",
    partner_npwp: "03.111.222.3-333.000",
    pph_type: "PPh23",
    gross_amount: 15_000_000,
    withheld_amount: 300_000,
    category_label: "Jasa Konsultan",
  },
  {
    date: "12 Nov 2023",
    reference_number: "INV/2023/11/018",
    partner_name: "PT. Konstruksi Utama",
    partner_npwp: "05.888.999.0-000.000",
    pph_type: "PPh23",
    gross_amount: 100_000_000,
    withheld_amount: 2_000_000,
    category_label: "Jasa Konstruksi",
  },
];

export function TaxPphRecordsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TaxPphFilterValue>(DEFAULT_PPH_FILTERS);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const searchNeedle = filters.q.trim().toLowerCase();

    return PPH_ROWS.filter((row) => {
      const searchPass =
        searchNeedle.length === 0 ||
        row.reference_number.toLowerCase().includes(searchNeedle) ||
        row.partner_name.toLowerCase().includes(searchNeedle);
      const typePass = filters.type === "All Types" || row.pph_type === filters.type;
      return searchPass && typePass;
    });
  }, [filters.q, filters.type]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PPH_PER_PAGE;
    return filteredRows.slice(start, start + PPH_PER_PAGE);
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
            Daftar Rekaman PPh (Income Tax)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed list of income tax withheld and payable for current period.
          </p>
        </div>
        <FeaturePphHeaderAction onExport={() => undefined} />
      </section>

      <FeaturePphSummaryCards cards={PPH_SUMMARY_CARDS} />

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
        <FeaturePphRecordsTable rows={paginatedRows} />
        <FeatureTaxPaginationBar
          page={page}
          perPage={PPH_PER_PAGE}
          totalItems={filteredRows.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
