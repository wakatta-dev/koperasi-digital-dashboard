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
  const [uiState, setUiState] = useState({
    page: 1,
    isCreateModalOpen: false,
    editingTax: null as TaxRow | null,
    deletingTax: null as TaxRow | null,
    actionError: null as string | null,
  });
  const perPage = 20;
  const { page, isCreateModalOpen, editingTax, deletingTax, actionError } =
    uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };
  const taxesQuery = useAccountingSettingsTaxes({ page, per_page: perPage });
  const { createTax, updateTax, toggleTaxStatus, duplicateTax, deleteTax } =
    useAccountingSettingsTaxMutations();

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
    patchUiState({ actionError: null });
    try {
      await createTax.mutateAsync({ payload });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
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

    patchUiState({ actionError: null });
    try {
      await updateTax.mutateAsync({ taxId: editingTax.tax_id, payload });
      patchUiState({ editingTax: null });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleToggleTax = async (tax: TaxRow, next: boolean) => {
    patchUiState({ actionError: null });
    try {
      await toggleTaxStatus.mutateAsync({ taxId: tax.tax_id, isActive: next });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleDuplicateTax = async (tax: TaxRow) => {
    patchUiState({ actionError: null });
    try {
      await duplicateTax.mutateAsync({ taxId: tax.tax_id, newName: `${tax.tax_name} Copy` });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleDeleteTax = async () => {
    if (!deletingTax) return;

    patchUiState({ actionError: null });
    try {
      await deleteTax.mutateAsync({ taxId: deletingTax.tax_id });
      patchUiState({ deletingTax: null });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
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
        onCreateTax={() => patchUiState({ isCreateModalOpen: true })}
        onToggleStatus={handleToggleTax}
        pagination={
          taxesQuery.data?.pagination
            ? {
                page: taxesQuery.data.pagination.page,
                pageSize: taxesQuery.data.pagination.per_page,
                totalItems: taxesQuery.data.pagination.total_items,
                totalPages: taxesQuery.data.pagination.total_pages,
              }
            : {
                page,
                pageSize: perPage,
                totalItems: rows.length,
                totalPages: 1,
              }
        }
        onPageChange={(nextPage) => patchUiState({ page: nextPage })}
        renderActions={(tax) => (
          <FeatureTaxActionMenu
            tax={tax}
            onEdit={(value) => patchUiState({ editingTax: value })}
            onDuplicate={handleDuplicateTax}
            onDelete={(value) => patchUiState({ deletingTax: value })}
          />
        )}
      />

      <FeatureCreateTaxModal
        open={isCreateModalOpen}
        onOpenChange={(open) => patchUiState({ isCreateModalOpen: open })}
        onSave={handleCreateTax}
      />

      <FeatureEditTaxModal
        open={Boolean(editingTax)}
        onOpenChange={(open) => {
          if (!open) patchUiState({ editingTax: null });
        }}
        tax={editingTax}
        onSave={handleUpdateTax}
      />

      <FeatureDeleteTaxModal
        open={Boolean(deletingTax)}
        onOpenChange={(open) => {
          if (!open) patchUiState({ deletingTax: null });
        }}
        taxName={deletingTax?.tax_name}
        onDelete={handleDeleteTax}
      />
    </>
  );
}
