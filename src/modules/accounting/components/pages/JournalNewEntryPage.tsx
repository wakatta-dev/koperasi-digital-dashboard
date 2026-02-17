/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  JOURNAL_NEW_ENTRY_DEFAULT_LINES,
  JOURNAL_NEW_ENTRY_DEFAULT_METADATA,
  JOURNAL_NEW_ENTRY_INLINE_AUDIT,
} from "../../constants/journal-seed";
import { ACCOUNTING_JOURNAL_ROUTES } from "../../constants/journal-routes";
import type { ManualJournalLineItem, ManualJournalMetadata } from "../../types/journal";
import { FeatureJournalInlineAuditLogTable } from "../features/FeatureJournalInlineAuditLogTable";
import { FeatureManualJournalHeaderActions } from "../features/FeatureManualJournalHeaderActions";
import { FeatureManualJournalLinesTable } from "../features/FeatureManualJournalLinesTable";
import { FeatureManualJournalMetadataForm } from "../features/FeatureManualJournalMetadataForm";

export function JournalNewEntryPage() {
  const router = useRouter();
  const [metadata, setMetadata] = useState<ManualJournalMetadata>(JOURNAL_NEW_ENTRY_DEFAULT_METADATA);
  const [lines, setLines] = useState<ManualJournalLineItem[]>(JOURNAL_NEW_ENTRY_DEFAULT_LINES);

  const hasBalancedTotals = useMemo(() => {
    const debit = lines.reduce((sum, line) => sum + line.debit_amount, 0);
    const credit = lines.reduce((sum, line) => sum + line.credit_amount, 0);
    return debit > 0 && debit === credit;
  }, [lines]);

  const resolvedJournalNumber = useMemo(() => {
    if (!metadata.reference_number.trim()) {
      return "JE/2023/0089";
    }
    return metadata.reference_number.replaceAll("-", "/");
  }, [metadata.reference_number]);

  return (
    <div className="space-y-6">
      <FeatureManualJournalHeaderActions
        onPostJournal={() => router.push(ACCOUNTING_JOURNAL_ROUTES.detail(resolvedJournalNumber))}
        postJournalDisabled={!hasBalancedTotals}
      />
      <FeatureManualJournalMetadataForm value={metadata} onChange={setMetadata} />
      <FeatureManualJournalLinesTable lines={lines} onChange={setLines} />
      <FeatureJournalInlineAuditLogTable
        rows={JOURNAL_NEW_ENTRY_INLINE_AUDIT}
        onViewFullHistory={() =>
          router.push(
            `${ACCOUNTING_JOURNAL_ROUTES.auditLog}?journalNumber=${encodeURIComponent(resolvedJournalNumber)}`
          )
        }
      />
    </div>
  );
}
