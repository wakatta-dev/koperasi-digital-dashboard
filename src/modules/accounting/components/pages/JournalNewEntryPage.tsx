/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useAccountingJournalAuditLogs,
  useAccountingJournalMutations,
  useAccountingSettingsCoa,
} from "@/hooks/queries";
import { toAccountingJournalApiError } from "@/services/api/accounting-journal";

import { JOURNAL_INITIAL_NEW_ENTRY_METADATA } from "../../constants/journal-initial-state";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type {
  JournalInlineAuditAction,
  JournalInlineAuditItem,
  ManualJournalAccountOption,
  ManualJournalLineItem,
  ManualJournalMetadata,
} from "../../types/journal";
import { FeatureJournalInlineAuditLogTable } from "../features/FeatureJournalInlineAuditLogTable";
import { FeatureManualJournalHeaderActions } from "../features/FeatureManualJournalHeaderActions";
import { FeatureManualJournalLinesTable } from "../features/FeatureManualJournalLinesTable";
import { FeatureManualJournalMetadataForm } from "../features/FeatureManualJournalMetadataForm";

const INITIAL_LINES: ManualJournalLineItem[] = [
  {
    line_id: "line-1",
    account_code: "",
    label_description: "",
    debit_amount: 0,
    credit_amount: 0,
  },
  {
    line_id: "line-2",
    account_code: "",
    label_description: "",
    debit_amount: 0,
    credit_amount: 0,
  },
];

function normalizeJournalNumber(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.replaceAll("-", "/");
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

function toInlineAuditAction(action: string): JournalInlineAuditAction {
  const normalized = action.toLowerCase();
  if (normalized.includes("edit")) {
    return "Edited";
  }
  if (normalized.includes("draft")) {
    return "Draft Saved";
  }
  return "Created";
}

function formatInlineAuditTimestamp(value: string): string {
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
    hour12: true,
  });
}

export function JournalNewEntryPage() {
  const router = useRouter();
  const [metadata, setMetadata] = useState<ManualJournalMetadata>(
    JOURNAL_INITIAL_NEW_ENTRY_METADATA,
  );
  const [lines, setLines] = useState<ManualJournalLineItem[]>(INITIAL_LINES);
  const [activeJournalNumber, setActiveJournalNumber] = useState("");

  const coaQuery = useAccountingSettingsCoa({ page: 1, per_page: 200 });
  const mutations = useAccountingJournalMutations();

  const resolvedJournalNumber = useMemo(() => {
    if (activeJournalNumber) {
      return activeJournalNumber;
    }
    return normalizeJournalNumber(metadata.reference_number);
  }, [activeJournalNumber, metadata.reference_number]);

  const auditQuery = useAccountingJournalAuditLogs(
    {
      journal_number: resolvedJournalNumber || undefined,
      page: 1,
      per_page: 5,
    },
    { enabled: Boolean(resolvedJournalNumber) },
  );

  const accountOptionsFromBackend = useMemo<ManualJournalAccountOption[]>(
    () =>
      (coaQuery.data?.items ?? []).map((item) => ({
        value: item.account_code,
        label: `${item.account_code} - ${item.account_name}`,
      })),
    [coaQuery.data?.items],
  );

  useEffect(() => {
    if (accountOptionsFromBackend.length === 0) {
      return;
    }

    setLines((current) => {
      let changed = false;
      const next = current.map((line, index) => {
        if (line.account_code) {
          return line;
        }

        const defaultOption =
          accountOptionsFromBackend[Math.min(index, accountOptionsFromBackend.length - 1)];
        if (!defaultOption?.value) {
          return line;
        }

        changed = true;
        return {
          ...line,
          account_code: defaultOption.value,
        };
      });

      return changed ? next : current;
    });
  }, [accountOptionsFromBackend]);

  const accountOptions = useMemo<ManualJournalAccountOption[]>(() => {
    if (accountOptionsFromBackend.length > 0) {
      return accountOptionsFromBackend;
    }

    const uniqueCodes = Array.from(
      new Set(lines.map((line) => line.account_code.trim()).filter(Boolean)),
    );

    return uniqueCodes.map((code) => ({
      value: code,
      label: `${code} - ${code}`,
    }));
  }, [accountOptionsFromBackend, lines]);

  const inlineAuditRows = useMemo<JournalInlineAuditItem[]>(
    () =>
      (auditQuery.data?.items ?? []).map((row) => ({
        timestamp: formatInlineAuditTimestamp(row.timestamp),
        user_initial: toUserInitial(row.user),
        user_name: row.user,
        action: toInlineAuditAction(row.action),
        details: row.change_details,
      })),
    [auditQuery.data?.items],
  );

  const hasBalancedTotals = useMemo(() => {
    const debit = lines.reduce((sum, line) => sum + line.debit_amount, 0);
    const credit = lines.reduce((sum, line) => sum + line.credit_amount, 0);
    return debit > 0 && debit === credit;
  }, [lines]);

  const hasRequiredMetadata = useMemo(
    () =>
      metadata.journal_date.trim().length > 0 &&
      metadata.journal_reference.trim().length > 0,
    [metadata.journal_date, metadata.journal_reference],
  );

  const canSubmit = useMemo(
    () => hasBalancedTotals && hasRequiredMetadata && lines.every((line) => line.account_code),
    [hasBalancedTotals, hasRequiredMetadata, lines],
  );

  const submitJournal = async (saveMode: "draft" | "post") => {
    const normalizedLines = lines.map((line, index) => ({
      line_no: index + 1,
      account_code: line.account_code,
      label_description: line.label_description || undefined,
      debit_amount: line.debit_amount,
      credit_amount: line.credit_amount,
    }));

    try {
      const response = await mutations.createEntry.mutateAsync({
        payload: {
          journal_date: metadata.journal_date,
          journal_name: metadata.journal_reference,
          partner_entity: undefined,
          reference_number: metadata.reference_number || undefined,
          lines: normalizedLines,
          save_mode: saveMode,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });

      setActiveJournalNumber(response.journal_number);
      setMetadata((current) => ({
        ...current,
        reference_number: response.journal_number.replaceAll("/", "-"),
      }));

      if (saveMode === "post") {
        toast.success("Journal posted");
        router.push(ACCOUNTING_JOURNAL_ROUTES.detail(response.journal_number));
        return;
      }

      toast.success("Journal draft saved");
    } catch (error) {
      const parsed = toAccountingJournalApiError(error);
      if (parsed.statusCode === 409 || parsed.statusCode === 412 || parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const headerError =
    coaQuery.error || auditQuery.error
      ? toAccountingJournalApiError(coaQuery.error ?? auditQuery.error).message
      : null;

  return (
    <div className="space-y-6">
      <FeatureManualJournalHeaderActions
        onSaveDraft={() => submitJournal("draft")}
        onPostJournal={() => submitJournal("post")}
        saveDraftDisabled={mutations.createEntry.isPending}
        postJournalDisabled={!canSubmit || mutations.createEntry.isPending}
      />

      {coaQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading chart of accounts...
        </div>
      ) : null}

      {headerError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {headerError}
        </div>
      ) : null}

      <FeatureManualJournalMetadataForm value={metadata} onChange={setMetadata} />
      <FeatureManualJournalLinesTable
        lines={lines}
        accountOptions={accountOptions}
        onChange={setLines}
      />
      <FeatureJournalInlineAuditLogTable
        rows={inlineAuditRows}
        onViewFullHistory={() => {
          const query = resolvedJournalNumber
            ? `?journalNumber=${encodeURIComponent(resolvedJournalNumber)}`
            : "";
          router.push(`${ACCOUNTING_JOURNAL_ROUTES.auditLog}${query}`);
        }}
      />
    </div>
  );
}
