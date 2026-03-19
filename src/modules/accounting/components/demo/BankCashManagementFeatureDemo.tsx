/** @format */

"use client";

import { useState } from "react";

import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { Button } from "@/components/ui/button";

import {
  DUMMY_ADD_BANK_ACCOUNT_DRAFT,
  DUMMY_IMPORT_STATEMENT_DRAFT,
} from "../../constants/bank-cash-dummy";
import type { AddBankAccountDraft, ImportStatementDraft } from "../../types/bank-cash";
import { FeatureAddBankAccountModal } from "../features/FeatureAddBankAccountModal";
import { FeatureBankAccountsGrid } from "../features/FeatureBankAccountsGrid";
import { FeatureCashRegistersGrid } from "../features/FeatureCashRegistersGrid";
import { FeatureImportBankStatementModal } from "../features/FeatureImportBankStatementModal";
import { FeatureUnreconciledTransactionsTable } from "../features/FeatureUnreconciledTransactionsTable";

export function BankCashManagementFeatureDemo() {
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<AddBankAccountDraft>(DUMMY_ADD_BANK_ACCOUNT_DRAFT);
  const [importDraft, setImportDraft] = useState<ImportStatementDraft>(
    DUMMY_IMPORT_STATEMENT_DRAFT
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-gray-200 dark:border-gray-700"
          onClick={() => setImportOpen(true)}
        >
          Import Statement
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => setAddOpen(true)}
        >
          Add Bank Account
        </Button>
      </div>

      <KpiCards
        items={[]}
        emptyState={
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-300">
            Ringkasan bank & kas belum tersedia.
          </div>
        }
      />
      <FeatureBankAccountsGrid />
      <FeatureUnreconciledTransactionsTable />
      <FeatureCashRegistersGrid />

      <FeatureAddBankAccountModal
        open={addOpen}
        onOpenChange={setAddOpen}
        draft={addDraft}
        onDraftChange={setAddDraft}
        onSubmit={() => setAddOpen(false)}
      />

      <FeatureImportBankStatementModal
        open={importOpen}
        onOpenChange={setImportOpen}
        draft={importDraft}
        onDraftChange={setImportDraft}
        onSubmit={() => setImportOpen(false)}
      />
    </section>
  );
}
