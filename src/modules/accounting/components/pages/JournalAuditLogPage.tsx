/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  JOURNAL_AUDIT_LOG_DEFAULT_FILTERS,
  JOURNAL_AUDIT_LOG_ROWS,
} from "../../constants/journal-seed";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type { JournalAuditLogFilterValue } from "../../types/journal";
import { FeatureAuditLogFilterBar } from "../features/FeatureAuditLogFilterBar";
import { FeatureAuditLogHeaderActions } from "../features/FeatureAuditLogHeaderActions";
import { FeatureAuditLogSummaryCounters } from "../features/FeatureAuditLogSummaryCounters";
import { FeatureAuditLogTable } from "../features/FeatureAuditLogTable";

type JournalAuditLogPageProps = {
  journalNumber?: string;
};

export function JournalAuditLogPage({ journalNumber }: JournalAuditLogPageProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JournalAuditLogFilterValue>({
    ...JOURNAL_AUDIT_LOG_DEFAULT_FILTERS,
    journal_number: journalNumber ?? "",
  });

  const filteredRows = useMemo(() => {
    return JOURNAL_AUDIT_LOG_ROWS.filter((row) => {
      if (filters.journal_number && row.reference_no !== filters.journal_number) {
        return false;
      }

      if (filters.user === "shadcn" && row.user_name !== "Shadcn") {
        return false;
      }
      if (filters.user === "jdoe" && row.user_name !== "John Doe") {
        return false;
      }
      if (filters.user === "system" && row.user_name !== "System") {
        return false;
      }

      if (filters.module !== "all") {
        const moduleMap = {
          journal: "Journal",
          invoice: "Invoice",
          bill: "Vendor Bill",
          payment: "Payment",
          setting: "Setting",
        } as const;
        if (row.module !== moduleMap[filters.module]) {
          return false;
        }
      }

      const keyword = filters.q.trim().toLowerCase();
      if (keyword) {
        const haystack = `${row.reference_no} ${row.change_details} ${row.user_name}`.toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const isFiltered =
    filters.journal_number.length > 0 ||
    filters.q.trim().length > 0 ||
    filters.user !== "all" ||
    filters.module !== "all" ||
    filters.date_from.length > 0 ||
    filters.date_to.length > 0;

  const rows = filteredRows.slice((page - 1) * 5, page * 5);
  const totalItems = isFiltered ? filteredRows.length : 2840;

  return (
    <div className="space-y-6">
      <FeatureAuditLogHeaderActions
        journalNumber={journalNumber}
        onBackToJournal={() => router.push(ACCOUNTING_JOURNAL_ROUTES.index)}
      />
      <FeatureAuditLogFilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />
      <FeatureAuditLogTable
        rows={rows}
        page={page}
        perPage={5}
        totalItems={Math.max(totalItems, rows.length)}
        onPageChange={setPage}
        onReferenceClick={(referenceNo) =>
          router.push(ACCOUNTING_JOURNAL_ROUTES.detail(referenceNo))
        }
      />
      <FeatureAuditLogSummaryCounters />
    </div>
  );
}
