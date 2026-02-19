/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingTaxCompliance,
  useAccountingTaxEfakturReady,
  useAccountingTaxIncomeTaxReport,
  useAccountingTaxMutations,
  useAccountingTaxOverview,
} from "@/hooks/queries";
import { toAccountingTaxApiError } from "@/services/api/accounting-tax";

import { ACCOUNTING_TAX_ROUTES } from "../../constants/tax-routes";
import type {
  TaxComplianceStep,
  TaxEfakturFilterValue,
  TaxEfakturReadyItem,
  TaxIncomeTaxReportLine,
} from "../../types/tax";
import {
  buildTaxEfakturQueryString,
  parseTaxEfakturQueryState,
} from "../../utils/tax-query-state";
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

const EFAKTUR_PER_PAGE = 5;

export function TaxEfakturExportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(
    () =>
      parseTaxEfakturQueryState(searchParams, {
        filters: DEFAULT_EFAKTUR_FILTERS,
        page: 1,
        perPage: EFAKTUR_PER_PAGE,
      }),
    [searchParams],
  );

  const [filters, setFilters] = useState<TaxEfakturFilterValue>(initialQueryState.filters);
  const [page, setPage] = useState(initialQueryState.page);
  const perPage = initialQueryState.perPage;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const overviewQuery = useAccountingTaxOverview();
  const efakturReadyQuery = useAccountingTaxEfakturReady({
    date_range: filters.date_range,
    tax_type: filters.tax_type,
    status: filters.status,
    page,
    per_page: perPage,
  });
  const incomeTaxReportQuery = useAccountingTaxIncomeTaxReport();
  const complianceQuery = useAccountingTaxCompliance();
  const mutations = useAccountingTaxMutations();

  useEffect(() => {
    const nextQuery = buildTaxEfakturQueryString({ filters, page, perPage });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [filters, page, pathname, perPage, router, searchParams]);

  useEffect(() => {
    const defaults = (efakturReadyQuery.data?.items ?? [])
      .filter((item) => item.is_selected_default)
      .map((item) => item.invoice_id);
    setSelectedIds((current) => {
      if (
        current.length === defaults.length &&
        current.every((id, index) => id === defaults[index])
      ) {
        return current;
      }
      return defaults;
    });
  }, [efakturReadyQuery.data?.items]);

  const rows = useMemo<TaxEfakturReadyItem[]>(() => {
    return (efakturReadyQuery.data?.items ?? []).map((item) => ({
      invoice_id: item.invoice_id,
      invoice_number: item.invoice_number,
      date: item.date,
      counterparty: item.counterparty,
      tax_base_amount: item.tax_base_amount,
      vat_amount: item.vat_amount,
      is_selected_default: item.is_selected_default,
    }));
  }, [efakturReadyQuery.data?.items]);

  const incomeTaxLines = useMemo<TaxIncomeTaxReportLine[]>(() => {
    if (!incomeTaxReportQuery.data) {
      return [];
    }

    return [
      {
        key: "pph_21",
        label: "PPh 21",
        helper_text: "Employee Tax",
        value: incomeTaxReportQuery.data.pph21_amount,
        tone: "blue",
      },
      {
        key: "pph_23",
        label: "PPh 23",
        helper_text: "Services & Royalty",
        value: incomeTaxReportQuery.data.pph23_amount,
        tone: "purple",
      },
      {
        key: "pph_4_2",
        label: "PPh 4 ayat 2",
        helper_text: "Final Tax (Rent)",
        value: incomeTaxReportQuery.data.pph4_2_amount,
        tone: "orange",
      },
    ];
  }, [incomeTaxReportQuery.data]);

  const complianceSteps = useMemo<TaxComplianceStep[]>(() => {
    return (complianceQuery.data?.steps ?? []).map((step) => ({
      key: step.key,
      label: step.label,
      status: step.status,
    }));
  }, [complianceQuery.data?.steps]);

  const totalItems = efakturReadyQuery.data?.pagination?.total_items ?? rows.length;
  const resolvedPage = efakturReadyQuery.data?.pagination?.page ?? page;
  const resolvedPerPage = efakturReadyQuery.data?.pagination?.per_page ?? perPage;

  const toggleAllRows = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(rows.map((row) => row.invoice_id));
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

  const handleExportEfaktur = async () => {
    try {
      await mutations.exportEfaktur.mutateAsync({
        payload: {
          invoice_ids: selectedIds,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("e-Faktur export has been queued.");
      router.push(ACCOUNTING_TAX_ROUTES.summary);
    } catch (error) {
      toast.error(toAccountingTaxApiError(error).message);
    }
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
          onDownloadCsv={handleExportEfaktur}
        />
      </section>

      {efakturReadyQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(efakturReadyQuery.error).message}
        </div>
      ) : null}
      {incomeTaxReportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(incomeTaxReportQuery.error).message}
        </div>
      ) : null}
      {complianceQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(complianceQuery.error).message}
        </div>
      ) : null}
      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingTaxApiError(overviewQuery.error).message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FeatureEfakturFilterPanel
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />

          {efakturReadyQuery.isPending && !efakturReadyQuery.data ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
              Loading e-Faktur queue...
            </div>
          ) : null}

          <FeatureEfakturReadyTable
            rows={rows}
            selectedIds={selectedIds}
            page={resolvedPage}
            perPage={resolvedPerPage}
            totalItems={totalItems}
            onToggleAll={toggleAllRows}
            onToggleRow={toggleRow}
            onPageChange={setPage}
          />
        </div>

        <div className="space-y-6">
          <FeatureIncomeTaxReportCard
            lines={incomeTaxLines}
            totalTaxPayable={incomeTaxReportQuery.data?.total_tax_payable ?? 0}
            onViewDetailedReport={() => undefined}
          />

          <FeatureTaxComplianceCard
            periodLabel={overviewQuery.data?.active_period?.label ?? complianceQuery.data?.as_of ?? "-"}
            steps={complianceSteps}
            deadline={complianceQuery.data?.deadline ?? "-"}
          />
        </div>
      </div>
    </div>
  );
}
