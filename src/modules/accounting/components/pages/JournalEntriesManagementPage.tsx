/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingJournalCurrentPeriodLock,
  useAccountingJournalEntries,
  useAccountingJournalMutations,
  useAccountingJournalOverview,
} from "@/hooks/queries";
import { toAccountingJournalApiError } from "@/services/api/accounting-journal";

import {
  JOURNAL_ENTRIES_BASE_PAGINATION,
  JOURNAL_ENTRIES_DEFAULT_FILTERS,
  JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD,
} from "../../constants/journal-seed";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type {
  JournalEntriesFilterValue,
  JournalEntriesPagination,
  JournalEntryStatus,
} from "../../types/journal";
import {
  JOURNAL_DEFAULT_SORT,
  buildJournalListQueryString,
  parseJournalListQueryState,
} from "../../utils/journal-query-state";
import { FeatureJournalEntriesActionBar } from "../features/FeatureJournalEntriesActionBar";
import { FeatureJournalEntriesFilterBar } from "../features/FeatureJournalEntriesFilterBar";
import { FeatureJournalEntriesSummaryCards } from "../features/FeatureJournalEntriesSummaryCards";
import { FeatureJournalEntriesTable } from "../features/FeatureJournalEntriesTable";
import { FeatureLockAccountingPeriodModal } from "../features/FeatureLockAccountingPeriodModal";

function formatJournalShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return `${month}/${year}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toJournalStatusFilter(status: JournalEntriesFilterValue["status"]) {
  switch (status) {
    case "draft":
      return "Draft";
    case "posted":
      return "Posted";
    case "locked":
      return "Locked";
    case "reversed":
      return "Reversed";
    default:
      return undefined;
  }
}

function toJournalEntryType(value?: string): "sales" | "purchase" | "cash" | "general" {
  const normalized = (value ?? "").toLowerCase();
  if (normalized === "sales") return "sales";
  if (normalized === "purchase") return "purchase";
  if (normalized === "cash" || normalized === "cash_bank" || normalized === "cash/bank") {
    return "cash";
  }
  return "general";
}

function toJournalEntryStatus(value?: string): JournalEntryStatus {
  if (value === "Draft" || value === "Posted" || value === "Locked") {
    return value;
  }
  return "Reversed";
}

export function JournalEntriesManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryState = useMemo(
    () =>
      parseJournalListQueryState(searchParams, {
        filters: JOURNAL_ENTRIES_DEFAULT_FILTERS,
        pagination: JOURNAL_ENTRIES_BASE_PAGINATION,
        sort: JOURNAL_DEFAULT_SORT,
      }),
    [searchParams],
  );

  const [filters, setFilters] = useState<JournalEntriesFilterValue>(
    initialQueryState.filters,
  );
  const [pagination, setPagination] = useState<JournalEntriesPagination>(
    initialQueryState.pagination,
  );
  const [sort] = useState(initialQueryState.sort);
  const [lockPeriodOpen, setLockPeriodOpen] = useState(false);
  const [lockPeriodSelection, setLockPeriodSelection] = useState({
    ...JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD,
  });

  const overviewQuery = useAccountingJournalOverview();
  const entriesQuery = useAccountingJournalEntries({
    q: filters.q || undefined,
    date: filters.date === "all_dates" ? undefined : filters.date,
    type: filters.type === "all_types" ? undefined : filters.type,
    status: toJournalStatusFilter(filters.status),
    sort,
    page: pagination.page,
    per_page: pagination.per_page,
  });
  const periodLockQuery = useAccountingJournalCurrentPeriodLock();
  const mutations = useAccountingJournalMutations();
  const periodLockMonth = periodLockQuery.data?.month;
  const periodLockYear = periodLockQuery.data?.year;

  useEffect(() => {
    const nextQuery = buildJournalListQueryString({
      filters,
      pagination,
      sort,
    });
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [filters, pagination, pathname, router, searchParams, sort]);

  useEffect(() => {
    if (periodLockMonth === undefined && periodLockYear === undefined) {
      return;
    }

    setLockPeriodSelection((current) => ({
      month: String(
        periodLockMonth ??
          (Number.isFinite(Number.parseInt(current.month, 10))
            ? Number.parseInt(current.month, 10)
            : 1),
      ),
      year: String(
        periodLockYear ??
          (Number.isFinite(Number.parseInt(current.year, 10))
            ? Number.parseInt(current.year, 10)
            : 2023),
      ),
    }));
  }, [periodLockMonth, periodLockYear]);

  const summaryCards = useMemo(() => {
    const cardsByKey = new Map(
      (overviewQuery.data?.cards ?? []).map((card) => [card.key, card]),
    );

    const overviewDraft = cardsByKey.get("draft_entries");
    const overviewPosted = cardsByKey.get("posted_entries");
    const overviewLocked = cardsByKey.get("locked_periods");
    const lockFromSummary = entriesQuery.data?.summary?.locked_period_label ?? "-";
    const lockFromCurrentStatus =
      periodLockQuery.data?.status === "Locked" &&
      typeof periodLockQuery.data.month === "number" &&
      typeof periodLockQuery.data.year === "number"
        ? formatMonthYear(periodLockQuery.data.month, periodLockQuery.data.year)
        : "-";

    return [
      {
        key: "draft_entries" as const,
        label: "Draft Entries",
        value:
          overviewDraft?.value ??
          String(entriesQuery.data?.summary?.draft_entries ?? 0),
        helper_value: "Action Required",
        helper_text: overviewDraft?.helper_text ?? "Review needed",
        tone: "warning" as const,
      },
      {
        key: "posted_entries" as const,
        label: "Posted Entries",
        value:
          overviewPosted?.value ??
          (entriesQuery.data?.summary?.posted_entries ?? 0).toLocaleString("en-US"),
        helper_value: "",
        helper_text: overviewPosted?.helper_text ?? "this month",
        tone: "success" as const,
      },
      {
        key: "locked_periods" as const,
        label: "Locked Periods",
        value:
          lockFromCurrentStatus !== "-"
            ? lockFromCurrentStatus
            : overviewLocked?.value ?? lockFromSummary,
        helper_text: overviewLocked?.helper_text ?? "Last closed period",
        tone: "danger" as const,
      },
    ];
  }, [
    entriesQuery.data?.summary?.draft_entries,
    entriesQuery.data?.summary?.posted_entries,
    entriesQuery.data?.summary?.locked_period_label,
    overviewQuery.data?.cards,
    periodLockQuery.data?.month,
    periodLockQuery.data?.status,
    periodLockQuery.data?.year,
  ]);

  const visibleRows = useMemo(() => {
    return (entriesQuery.data?.items ?? []).map((item) => ({
      journal_number: item.journal_number,
      journal_date: formatJournalShortDate(item.journal_date),
      journal_date_value: item.journal_date,
      journal_name: item.journal_name,
      journal_type: toJournalEntryType(item.journal_type),
      partner: item.partner || "Internal",
      debit_amount: Math.round(item.debit_amount).toLocaleString("en-US"),
      credit_amount: Math.round(item.credit_amount).toLocaleString("en-US"),
      status: toJournalEntryStatus(item.status),
    }));
  }, [entriesQuery.data?.items]);

  const resolvedPagination = useMemo<JournalEntriesPagination>(() => {
    if (!entriesQuery.data?.pagination) {
      return pagination;
    }

    return {
      page: entriesQuery.data.pagination.page,
      per_page: entriesQuery.data.pagination.per_page,
      total_items: entriesQuery.data.pagination.total_items,
    };
  }, [entriesQuery.data?.pagination, pagination]);

  const listQuery = buildJournalListQueryString({
    filters,
    pagination,
    sort,
  });
  const isLoadingEntries = entriesQuery.isPending && !entriesQuery.data;
  const isLoadingOverview = overviewQuery.isPending && !overviewQuery.data;
  const isLoadingPeriodLock = periodLockQuery.isPending && !periodLockQuery.data;

  return (
    <div className="space-y-6">
      <FeatureJournalEntriesActionBar
        onAuditLogClick={() => router.push(ACCOUNTING_JOURNAL_ROUTES.auditLog)}
        onNewJournalEntryClick={() => router.push(ACCOUNTING_JOURNAL_ROUTES.create)}
      />
      {isLoadingOverview || isLoadingPeriodLock ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading journal overview...
        </div>
      ) : null}
      <FeatureJournalEntriesSummaryCards
        cards={summaryCards}
        onLockedPeriodsClick={() => setLockPeriodOpen(true)}
      />
      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingJournalApiError(overviewQuery.error).message}
        </div>
      ) : null}
        <FeatureJournalEntriesFilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
      />
      {entriesQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingJournalApiError(entriesQuery.error).message}
        </div>
      ) : null}
      {isLoadingEntries ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading journal entries...
        </div>
      ) : null}
      <FeatureJournalEntriesTable
        rows={visibleRows}
        pagination={resolvedPagination}
        onReferenceClick={(journalNumber) => {
          const detailHref = ACCOUNTING_JOURNAL_ROUTES.detail(journalNumber);
          const withReturnContext = listQuery
            ? `${detailHref}?from=${encodeURIComponent(listQuery)}`
            : detailHref;
          router.push(withReturnContext);
        }}
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
        onConfirm={async () => {
          try {
            const month = Number(lockPeriodSelection.month);
            const year = Number(lockPeriodSelection.year);
            if (!Number.isFinite(month) || !Number.isFinite(year)) {
              toast.error("Select a valid accounting period.");
              return;
            }

            await mutations.createPeriodLock.mutateAsync({
              payload: {
                year,
                month,
              },
              idempotencyKey:
                globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
            });
            toast.success("Period locked");
            setLockPeriodOpen(false);
          } catch (error) {
            toast.error(toAccountingJournalApiError(error).message);
          }
        }}
      />
    </div>
  );
}
