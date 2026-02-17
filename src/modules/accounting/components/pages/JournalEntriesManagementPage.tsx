/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  JOURNAL_ENTRIES_BASE_PAGINATION,
  JOURNAL_ENTRIES_DEFAULT_FILTERS,
  JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD,
  JOURNAL_ENTRIES_ROWS,
  JOURNAL_ENTRIES_SUMMARY_CARDS,
} from "../../constants/journal-seed";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type { JournalEntriesFilterValue, JournalEntriesPagination } from "../../types/journal";
import { FeatureJournalEntriesActionBar } from "../features/FeatureJournalEntriesActionBar";
import { FeatureJournalEntriesFilterBar } from "../features/FeatureJournalEntriesFilterBar";
import { FeatureJournalEntriesSummaryCards } from "../features/FeatureJournalEntriesSummaryCards";
import { FeatureJournalEntriesTable } from "../features/FeatureJournalEntriesTable";
import { FeatureLockAccountingPeriodModal } from "../features/FeatureLockAccountingPeriodModal";

export function JournalEntriesManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<JournalEntriesFilterValue>(JOURNAL_ENTRIES_DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<JournalEntriesPagination>({
    ...JOURNAL_ENTRIES_BASE_PAGINATION,
  });
  const [lockPeriodOpen, setLockPeriodOpen] = useState(false);
  const [lockPeriodSelection, setLockPeriodSelection] = useState({
    ...JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD,
  });

  const filteredRows = useMemo(() => {
    return JOURNAL_ENTRIES_ROWS.filter((row) => {
      if (filters.type !== "all_types" && row.journal_type !== filters.type) {
        return false;
      }

      if (filters.status !== "all_status" && row.status.toLowerCase() !== filters.status) {
        return false;
      }

      if (filters.date === "this_month" && !row.journal_date_value.startsWith("2023-11")) {
        return false;
      }
      if (filters.date === "last_month" && !row.journal_date_value.startsWith("2023-10")) {
        return false;
      }
      if (filters.date === "this_year" && !row.journal_date_value.startsWith("2023")) {
        return false;
      }

      const normalizedSearch = filters.q.trim().toLowerCase();
      if (!normalizedSearch) {
        return true;
      }

      return (
        row.journal_number.toLowerCase().includes(normalizedSearch) ||
        row.journal_name.toLowerCase().includes(normalizedSearch) ||
        row.partner.toLowerCase().includes(normalizedSearch) ||
        row.debit_amount.includes(normalizedSearch) ||
        row.credit_amount.includes(normalizedSearch)
      );
    });
  }, [filters]);

  const isFiltering =
    filters.q.trim().length > 0 ||
    filters.date !== "all_dates" ||
    filters.type !== "all_types" ||
    filters.status !== "all_status";

  const resolvedPagination = useMemo<JournalEntriesPagination>(() => {
    if (!isFiltering) {
      return pagination;
    }

    return {
      page: 1,
      per_page: Math.max(filteredRows.length, 1),
      total_items: filteredRows.length,
    };
  }, [filteredRows.length, isFiltering, pagination]);

  const visibleRows = isFiltering ? filteredRows : JOURNAL_ENTRIES_ROWS;

  return (
    <div className="space-y-6">
      <FeatureJournalEntriesActionBar
        onAuditLogClick={() => router.push(ACCOUNTING_JOURNAL_ROUTES.auditLog)}
        onNewJournalEntryClick={() => router.push(ACCOUNTING_JOURNAL_ROUTES.create)}
      />
      <FeatureJournalEntriesSummaryCards
        cards={JOURNAL_ENTRIES_SUMMARY_CARDS}
        onLockedPeriodsClick={() => setLockPeriodOpen(true)}
      />
      <FeatureJournalEntriesFilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
      />
      <FeatureJournalEntriesTable
        rows={visibleRows}
        pagination={resolvedPagination}
        onReferenceClick={(journalNumber) => router.push(ACCOUNTING_JOURNAL_ROUTES.detail(journalNumber))}
        onPageChange={(nextPage) =>
          setPagination((current) => ({
            ...current,
            page: nextPage,
          }))
        }
      />
      <FeatureLockAccountingPeriodModal
        open={lockPeriodOpen}
        onOpenChange={setLockPeriodOpen}
        selection={lockPeriodSelection}
        onSelectionChange={setLockPeriodSelection}
        onConfirm={() => setLockPeriodOpen(false)}
      />
    </div>
  );
}
