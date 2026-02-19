/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAccountingJournalAuditLogs } from "@/hooks/queries";
import { toAccountingJournalApiError } from "@/services/api/accounting-journal";

import { JOURNAL_INITIAL_AUDIT_LOG_FILTERS } from "../../constants/journal-initial-state";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type {
  JournalAuditAction,
  JournalAuditLogFilterValue,
  JournalAuditLogRow,
  JournalAuditModule,
  JournalAuditSummaryCounter,
} from "../../types/journal";
import { FeatureAuditLogFilterBar } from "../features/FeatureAuditLogFilterBar";
import { FeatureAuditLogHeaderActions } from "../features/FeatureAuditLogHeaderActions";
import { FeatureAuditLogSummaryCounters } from "../features/FeatureAuditLogSummaryCounters";
import { FeatureAuditLogTable } from "../features/FeatureAuditLogTable";

type JournalAuditLogPageProps = {
  journalNumber?: string;
};

const PER_PAGE = 5;

function toAuditModule(value: string): JournalAuditModule {
  const normalized = value.toLowerCase();
  if (normalized === "invoice") return "Invoice";
  if (normalized === "vendor bill" || normalized === "bill") return "Vendor Bill";
  if (normalized === "payment") return "Payment";
  if (normalized === "setting") return "Setting";
  return "Journal";
}

function toAuditAction(value: string): JournalAuditAction {
  const normalized = value.toLowerCase();
  if (normalized.includes("post")) return "Posted";
  if (normalized.includes("edit")) return "Edited";
  if (normalized.includes("delete")) return "Deleted";
  if (normalized.includes("lock")) return "Locked";
  return "Created";
}

function formatAuditTimestamp(value: string): { timestamp_date: string; timestamp_time: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return {
      timestamp_date: value,
      timestamp_time: "-",
    };
  }

  return {
    timestamp_date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    timestamp_time: `${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })} WIB`,
  };
}

function toUserInitial(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "U";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function JournalAuditLogPage({ journalNumber }: JournalAuditLogPageProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JournalAuditLogFilterValue>({
    ...JOURNAL_INITIAL_AUDIT_LOG_FILTERS,
    journal_number: journalNumber ?? "",
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      journal_number: journalNumber ?? "",
    }));
  }, [journalNumber]);

  const queryParams = useMemo(() => {
    const userValueMap: Record<JournalAuditLogFilterValue["user"], string | undefined> = {
      all: undefined,
      shadcn: "Shadcn",
      jdoe: "John Doe",
      system: "System",
    };
    const moduleValueMap: Record<JournalAuditLogFilterValue["module"], string | undefined> = {
      all: undefined,
      journal: "Journal",
      invoice: "Invoice",
      bill: "Vendor Bill",
      payment: "Payment",
      setting: "Setting",
    };

    return {
      q: filters.q.trim() || undefined,
      user: userValueMap[filters.user],
      module: moduleValueMap[filters.module],
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      journal_number: filters.journal_number || undefined,
      page,
      per_page: PER_PAGE,
    };
  }, [filters, page]);

  const auditQuery = useAccountingJournalAuditLogs(queryParams);

  const rows = useMemo<JournalAuditLogRow[]>(
    () =>
      (auditQuery.data?.items ?? []).map((item) => {
        const { timestamp_date, timestamp_time } = formatAuditTimestamp(item.timestamp);
        return {
          timestamp_date,
          timestamp_time,
          user_initial: toUserInitial(item.user),
          user_name: item.user,
          module: toAuditModule(item.module),
          action: toAuditAction(item.action),
          reference_no: item.reference_no,
          change_details: item.change_details,
        };
      }),
    [auditQuery.data?.items],
  );

  const counters = useMemo<JournalAuditSummaryCounter[]>(() => {
    const summary = auditQuery.data?.summary_counters;
    return [
      {
        key: "created",
        label: "Created",
        value: (summary?.created ?? 0).toLocaleString("en-US"),
        tone: "emerald",
      },
      {
        key: "edited",
        label: "Edited",
        value: (summary?.edited ?? 0).toLocaleString("en-US"),
        tone: "amber",
      },
      {
        key: "deleted",
        label: "Deleted",
        value: (summary?.deleted ?? 0).toLocaleString("en-US"),
        tone: "red",
      },
      {
        key: "posted",
        label: "Posted",
        value: (summary?.posted ?? 0).toLocaleString("en-US"),
        tone: "blue",
      },
    ];
  }, [auditQuery.data?.summary_counters]);

  return (
    <div className="space-y-6">
      <FeatureAuditLogHeaderActions
        journalNumber={filters.journal_number || undefined}
        onBackToJournal={() => router.push(ACCOUNTING_JOURNAL_ROUTES.index)}
        onExportCsv={() => toast.info("CSV export is not available yet.")}
      />

      {auditQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingJournalApiError(auditQuery.error).message}
        </div>
      ) : null}

      {auditQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading audit logs...
        </div>
      ) : null}

      <FeatureAuditLogFilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onApplyFilter={() => setPage(1)}
      />
      <FeatureAuditLogTable
        rows={rows}
        page={page}
        perPage={PER_PAGE}
        totalItems={Math.max(auditQuery.data?.pagination.total_items ?? 0, rows.length)}
        onPageChange={setPage}
        onReferenceClick={(referenceNo) =>
          router.push(ACCOUNTING_JOURNAL_ROUTES.detail(referenceNo))
        }
      />
      <FeatureAuditLogSummaryCounters counters={counters} />
    </div>
  );
}
