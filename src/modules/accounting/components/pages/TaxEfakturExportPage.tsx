/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxComplianceStep,
  TaxEfakturFilterValue,
  TaxEfakturReadyItem,
  TaxIncomeTaxReportLine,
} from "../../types/tax";
import { FeatureEfakturFilterPanel } from "../features/FeatureEfakturFilterPanel";
import { FeatureEfakturReadyTable } from "../features/FeatureEfakturReadyTable";
import { FeatureEfakturTopActions } from "../features/FeatureEfakturTopActions";
import { FeatureIncomeTaxReportCard } from "../features/FeatureIncomeTaxReportCard";
import { FeatureTaxComplianceCard } from "../features/FeatureTaxComplianceCard";

const DEFAULT_EFAKTUR_FILTERS: TaxEfakturFilterValue = {
  date_range: "Last 30 days",
  tax_type: "All Types",
  status: "Ready to Export",
};

const EFAKTUR_ROWS: TaxEfakturReadyItem[] = [
  {
    invoice_id: "inv_1001",
    invoice_number: "INV/2023/1001",
    date: "Oct 24, 2023",
    counterparty: "PT. Maju Jaya",
    tax_base_amount: 100_000_000,
    vat_amount: 11_000_000,
    is_selected_default: true,
  },
  {
    invoice_id: "inv_1002",
    invoice_number: "INV/2023/1002",
    date: "Oct 25, 2023",
    counterparty: "CV. Abadi Sentosa",
    tax_base_amount: 50_000_000,
    vat_amount: 5_500_000,
    is_selected_default: true,
  },
  {
    invoice_id: "inv_1003",
    invoice_number: "INV/2023/1003",
    date: "Oct 26, 2023",
    counterparty: "PT. Sumber Makmur",
    tax_base_amount: 75_000_000,
    vat_amount: 8_250_000,
    is_selected_default: true,
  },
  {
    invoice_id: "inv_1004",
    invoice_number: "INV/2023/1004",
    date: "Oct 26, 2023",
    counterparty: "PT. Global Tech",
    tax_base_amount: 25_000_000,
    vat_amount: 2_750_000,
    is_selected_default: false,
  },
  {
    invoice_id: "inv_1005",
    invoice_number: "INV/2023/1005",
    date: "Oct 27, 2023",
    counterparty: "UD. Berkah",
    tax_base_amount: 10_000_000,
    vat_amount: 1_100_000,
    is_selected_default: false,
  },
];

const INCOME_TAX_LINES: TaxIncomeTaxReportLine[] = [
  {
    key: "pph_21",
    label: "PPh 21",
    helper_text: "Employee Tax",
    value: 12_500_000,
    tone: "blue",
  },
  {
    key: "pph_23",
    label: "PPh 23",
    helper_text: "Services & Royalty",
    value: 4_250_000,
    tone: "purple",
  },
  {
    key: "pph_4_2",
    label: "PPh 4 ayat 2",
    helper_text: "Final Tax (Rent)",
    value: 1_500_000,
    tone: "orange",
  },
];

const TAX_COMPLIANCE_STEPS: TaxComplianceStep[] = [
  {
    key: "efaktur_uploaded",
    label: "e-Faktur Uploaded",
    status: "Completed",
  },
  {
    key: "pph_calculated",
    label: "PPh Calculated",
    status: "Completed",
  },
  {
    key: "payment_submitted",
    label: "Payment Submitted",
    status: "Pending",
  },
];

export function TaxEfakturExportPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TaxEfakturFilterValue>(DEFAULT_EFAKTUR_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    EFAKTUR_ROWS.filter((row) => row.is_selected_default).map((row) => row.invoice_id),
  );

  const perPage = 5;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return EFAKTUR_ROWS.slice(start, start + perPage);
  }, [page]);

  const totalTaxPayable = useMemo(
    () => INCOME_TAX_LINES.reduce((total, line) => total + line.value, 0),
    [],
  );

  const toggleAllRows = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(paginatedRows.map((row) => row.invoice_id));
  };

  const toggleRow = (invoiceId: string, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) {
        if (current.includes(invoiceId)) {
          return current;
        }
        return [...current, invoiceId];
      }
      return current.filter((selectedId) => selectedId !== invoiceId);
    });
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            e-Faktur Export & Tax Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage tax invoices and generate reports for DJP compliance.
          </p>
        </div>
        <FeatureEfakturTopActions
          onFilter={() => undefined}
          onDownloadCsv={() => {
            router.push(ACCOUNTING_TAX_ROUTES.summary);
          }}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FeatureEfakturFilterPanel value={filters} onChange={setFilters} />

          <FeatureEfakturReadyTable
            rows={paginatedRows}
            selectedIds={selectedIds}
            page={page}
            perPage={perPage}
            totalItems={EFAKTUR_ROWS.length}
            onToggleAll={toggleAllRows}
            onToggleRow={toggleRow}
            onPageChange={setPage}
          />
        </div>

        <div className="space-y-6">
          <FeatureIncomeTaxReportCard
            lines={INCOME_TAX_LINES}
            totalTaxPayable={totalTaxPayable}
            onViewDetailedReport={() => undefined}
          />

          <FeatureTaxComplianceCard
            periodLabel="October 2023"
            steps={TAX_COMPLIANCE_STEPS}
            deadline="Nov 15, 2023"
          />
        </div>
      </div>
    </div>
  );
}
