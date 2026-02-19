/** @format */

"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import {
  useAccountingJournalEntryDetail,
  useAccountingJournalMutations,
} from "@/hooks/queries";
import { toAccountingJournalApiError } from "@/services/api/accounting-journal";

import type {
  JournalDetailGeneralInformation,
  JournalDetailHeader,
  JournalDetailIntegrity,
  JournalDetailItem,
} from "../../types/journal";
import { FeatureJournalDetailGeneralInfo } from "../features/FeatureJournalDetailGeneralInfo";
import { FeatureJournalDetailHeader } from "../features/FeatureJournalDetailHeader";
import { FeatureJournalDetailIntegrityFooter } from "../features/FeatureJournalDetailIntegrityFooter";
import { FeatureJournalDetailItemsTable } from "../features/FeatureJournalDetailItemsTable";

type JournalEntryDetailPageProps = {
  journalNumber: string;
  returnToQuery?: string;
};

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatLongDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function JournalEntryDetailPage({
  journalNumber,
  returnToQuery,
}: JournalEntryDetailPageProps) {
  const detailQuery = useAccountingJournalEntryDetail(journalNumber);
  const mutations = useAccountingJournalMutations();

  const header = useMemo<JournalDetailHeader>(() => {
    const data = detailQuery.data;
    if (!data) {
      return {
        journal_number: journalNumber,
        status: "Draft",
        posted_label: "Draft entry",
      };
    }

    const postedBy = data.header.posted_by ? ` by ${data.header.posted_by}` : "";
    const postedLabel =
      data.header.status === "Posted"
        ? `Posted on ${formatDateTime(data.header.posted_at)}${postedBy}`
        : `${data.header.status} entry`;

    return {
      journal_number: data.header.journal_number,
      status: data.header.status,
      posted_label: postedLabel,
    };
  }, [detailQuery.data, journalNumber]);

  const generalInformation = useMemo<JournalDetailGeneralInformation>(() => {
    const data = detailQuery.data?.general_information;
    return {
      reference_number: data?.reference_number || header.journal_number,
      journal_date: data?.journal_date ? formatLongDate(data.journal_date) : "-",
      partner_entity: data?.partner_entity || "-",
      journal_name: data?.journal_name || "-",
    };
  }, [detailQuery.data?.general_information, header.journal_number]);

  const rows = useMemo<JournalDetailItem[]>(
    () =>
      (detailQuery.data?.line_items ?? []).map((line) => ({
        account_name: `${line.account_code} ${line.account_name}`.trim(),
        account_category: line.account_category ?? "-",
        label: line.label,
        debit_amount: formatAmount(line.debit_amount),
        credit_amount: formatAmount(line.credit_amount),
      })),
    [detailQuery.data?.line_items],
  );

  const totals = useMemo(
    () => ({
      debit_amount: formatAmount(detailQuery.data?.totals.debit_amount ?? 0),
      credit_amount: formatAmount(detailQuery.data?.totals.credit_amount ?? 0),
    }),
    [detailQuery.data?.totals.credit_amount, detailQuery.data?.totals.debit_amount],
  );

  const integrity = useMemo<JournalDetailIntegrity>(() => {
    const flags = detailQuery.data?.integrity_flags;
    return {
      balanced_label: flags?.balanced_entry ? "Balanced Entry" : "Unbalanced Entry",
      immutable_label: flags?.immutable_record ? "Immutable Record" : "Mutable Record",
      last_modified_label: flags?.last_modified_label || "Last modified: -",
    };
  }, [detailQuery.data?.integrity_flags]);

  const handleReverseEntry = async () => {
    try {
      await mutations.reverseEntry.mutateAsync({
        journalNumber,
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Journal entry reversed");
    } catch (error) {
      const parsed = toAccountingJournalApiError(error);
      if (parsed.statusCode === 409 || parsed.statusCode === 412 || parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await mutations.exportEntryPdf.mutateAsync(journalNumber);
      if (response.download_url) {
        window.open(response.download_url, "_blank", "noopener,noreferrer");
      }
      toast.success("Export metadata generated");
    } catch (error) {
      toast.error(toAccountingJournalApiError(error).message);
    }
  };

  return (
    <div className="space-y-6">
      {detailQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingJournalApiError(detailQuery.error).message}
        </div>
      ) : null}

      {detailQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading journal detail...
        </div>
      ) : null}

      <FeatureJournalDetailHeader
        header={header}
        returnToQuery={returnToQuery}
        onPrint={() => window.print()}
        onExportPdf={handleExportPdf}
        onReverseEntry={handleReverseEntry}
      />
      <FeatureJournalDetailGeneralInfo data={generalInformation} />
      <FeatureJournalDetailItemsTable rows={rows} totals={totals} />
      <FeatureJournalDetailIntegrityFooter data={integrity} />
    </div>
  );
}
