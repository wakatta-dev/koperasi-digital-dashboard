/** @format */

"use client";

import { useMemo, useState } from "react";

import { useAccountingSettingsTaxMutations, useAccountingSettingsTaxes } from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { FeatureCreateTaxModal } from "../features/FeatureCreateTaxModal";
import { FeatureDeleteTaxModal } from "../features/FeatureDeleteTaxModal";
import { FeatureEditTaxModal } from "../features/FeatureEditTaxModal";
import { FeatureTaxActionMenu } from "../features/FeatureTaxActionMenu";
import { FeatureTaxesTable } from "../features/FeatureTaxesTable";
import { mapTaxRows } from "../../utils/settings-api-mappers";
import type { TaxRow } from "../../types/settings";

export function AccountingSettingsTaxesPage() {
  const taxesQuery = useAccountingSettingsTaxes({ page: 1, per_page: 20 });
  const { createTax, updateTax, toggleTaxStatus, duplicateTax, deleteTax } =
    useAccountingSettingsTaxMutations();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRow | null>(null);
  const [deletingTax, setDeletingTax] = useState<TaxRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo(() => {
    return mapTaxRows(taxesQuery.data?.items ?? []);
  }, [taxesQuery.data?.items]);

  const queryErrorMessage = taxesQuery.error
    ? toAccountingSettingsApiError(taxesQuery.error).message
    : null;
  const errorMessage = actionError ?? queryErrorMessage;

  const handleCreateTax = async (payload: {
    tax_name: string;
    tax_type: "Sales" | "Purchase" | "Both" | "None";
    rate_percent: number;
    tax_account_code: string;
    description?: string;
    is_active: boolean;
  }) => {
    setActionError(null);
    try {
      await createTax.mutateAsync({ payload });
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleUpdateTax = async (payload: {
    tax_name: string;
    tax_type: "Sales" | "Purchase" | "Both" | "None";
    rate_percent: number;
    tax_account_code: string;
    description?: string;
    is_active?: boolean;
  }) => {
    if (!editingTax) return;

    setActionError(null);
    try {
      await updateTax.mutateAsync({ taxId: editingTax.tax_id, payload });
      setEditingTax(null);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleToggleTax = async (tax: TaxRow, next: boolean) => {
    setActionError(null);
    try {
      await toggleTaxStatus.mutateAsync({ taxId: tax.tax_id, isActive: next });
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleDuplicateTax = async (tax: TaxRow) => {
    setActionError(null);
    try {
      await duplicateTax.mutateAsync({ taxId: tax.tax_id, newName: `${tax.tax_name} Copy` });
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleDeleteTax = async () => {
    if (!deletingTax) return;

    setActionError(null);
    try {
      await deleteTax.mutateAsync({ taxId: deletingTax.tax_id });
      setDeletingTax(null);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <FeatureTaxesTable
        rows={rows}
        onCreateTax={() => setCreateModalOpen(true)}
        onToggleStatus={handleToggleTax}
        renderActions={(tax) => (
          <FeatureTaxActionMenu
            tax={tax}
            onEdit={setEditingTax}
            onDuplicate={handleDuplicateTax}
            onDelete={setDeletingTax}
          />
        )}
      />

      <FeatureCreateTaxModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={handleCreateTax}
      />

      <FeatureEditTaxModal
        open={Boolean(editingTax)}
        onOpenChange={(open) => {
          if (!open) setEditingTax(null);
        }}
        tax={editingTax}
        onSave={handleUpdateTax}
      />

      <FeatureDeleteTaxModal
        open={Boolean(deletingTax)}
        onOpenChange={(open) => {
          if (!open) setDeletingTax(null);
        }}
        taxName={deletingTax?.tax_name}
        onDelete={handleDeleteTax}
      />
    </>
  );
}
