/** @format */

"use client";

import { useMemo, useState } from "react";

import {
  useAccountingSettingsAnalyticAccounts,
  useAccountingSettingsAnalyticMutations,
  useAccountingSettingsBudgetMutations,
  useAccountingSettingsBudgets,
} from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { FeatureAddAnalyticAccountModal } from "../features/FeatureAddAnalyticAccountModal";
import { FeatureAnalyticBudgetSuccessToast } from "../features/FeatureAnalyticBudgetSuccessToast";
import { FeatureAnalyticBudgetWorkspace } from "../features/FeatureAnalyticBudgetWorkspace";
import { FeatureCreateBudgetModal } from "../features/FeatureCreateBudgetModal";
import { FeatureDeleteBudgetModal } from "../features/FeatureDeleteBudgetModal";
import { FeatureEditBudgetModal } from "../features/FeatureEditBudgetModal";
import { mapAnalyticAccountCards, mapBudgetRows } from "../../utils/settings-api-mappers";

import type { BudgetRow } from "../../types/settings";

export function AccountingSettingsAnalyticBudgetPage() {
  const analyticAccountsQuery = useAccountingSettingsAnalyticAccounts({ page: 1, per_page: 20 });
  const budgetsQuery = useAccountingSettingsBudgets({ page: 1, per_page: 20 });
  const { createAnalyticAccount } = useAccountingSettingsAnalyticMutations();
  const { createBudget, updateBudget, deleteBudget } = useAccountingSettingsBudgetMutations();

  const [uiState, setUiState] = useState({
    isCreateBudgetOpen: false,
    editingBudget: null as BudgetRow | null,
    isDeleteBudgetOpen: false,
    deletingBudget: null as BudgetRow | null,
    isAddAnalyticOpen: false,
    showSuccessToast: false,
    actionError: null as string | null,
  });
  const {
    isCreateBudgetOpen,
    editingBudget,
    isDeleteBudgetOpen,
    deletingBudget,
    isAddAnalyticOpen,
    showSuccessToast,
    actionError,
  } = uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  const budgetRows = useMemo(() => {
    return mapBudgetRows(budgetsQuery.data?.items ?? []);
  }, [budgetsQuery.data?.items]);

  const analyticAccountCards = useMemo(() => {
    return mapAnalyticAccountCards(analyticAccountsQuery.data?.items ?? []);
  }, [analyticAccountsQuery.data?.items]);

  const queryErrorMessage =
    (budgetsQuery.error && toAccountingSettingsApiError(budgetsQuery.error).message) ||
    (analyticAccountsQuery.error && toAccountingSettingsApiError(analyticAccountsQuery.error).message) ||
    null;
  const errorMessage = actionError ?? queryErrorMessage;

  const handleCreateBudget = async (payload: {
    budget_name: string;
    analytic_account_id: string;
    start_date: string;
    end_date: string;
    currency_code: string;
    target_amount: number;
  }) => {
    patchUiState({ actionError: null });
    try {
      await createBudget.mutateAsync({ payload });
      patchUiState({ showSuccessToast: true });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleUpdateBudget = async (payload: {
    budget_name: string;
    analytic_account_id: string;
    start_date: string;
    end_date: string;
    currency_code: string;
    target_amount: number;
  }) => {
    if (!editingBudget) return;

    patchUiState({ actionError: null });
    try {
      await updateBudget.mutateAsync({
        budgetId: editingBudget.budget_id,
        payload,
      });
      patchUiState({ editingBudget: null, showSuccessToast: true });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleDeleteBudget = async () => {
    if (!deletingBudget) return;

    patchUiState({ actionError: null });
    try {
      await deleteBudget.mutateAsync({ budgetId: deletingBudget.budget_id });
      patchUiState({ deletingBudget: null, isDeleteBudgetOpen: false });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleCreateAnalyticAccount = async (payload: {
    account_name: string;
    reference_code: string;
    parent_analytic_account_id?: string;
  }) => {
    patchUiState({ actionError: null });
    try {
      await createAnalyticAccount.mutateAsync({ payload });
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

      <FeatureAnalyticBudgetWorkspace
        budgetRows={budgetRows}
        analyticAccountCards={analyticAccountCards}
        onCreateBudget={() => patchUiState({ isCreateBudgetOpen: true })}
        onAddAnalyticAccount={() => patchUiState({ isAddAnalyticOpen: true })}
        onEditBudget={(budgetId) => {
          const selectedBudget = budgetRows.find((item) => item.budget_id === budgetId) ?? null;
          patchUiState({ editingBudget: selectedBudget });
        }}
      />

      <FeatureCreateBudgetModal
        open={isCreateBudgetOpen}
        onOpenChange={(open) => patchUiState({ isCreateBudgetOpen: open })}
        onSave={handleCreateBudget}
      />

      <FeatureEditBudgetModal
        open={Boolean(editingBudget)}
        onOpenChange={(open) => {
          if (!open) patchUiState({ editingBudget: null });
        }}
        onSave={handleUpdateBudget}
        onRequestDelete={() => {
          if (editingBudget) {
            patchUiState({ deletingBudget: editingBudget });
          }
          patchUiState({
            editingBudget: null,
            isDeleteBudgetOpen: true,
          });
        }}
      />

      <FeatureDeleteBudgetModal
        open={isDeleteBudgetOpen}
        onOpenChange={(open) => {
          patchUiState({
            isDeleteBudgetOpen: open,
            deletingBudget: open ? deletingBudget : null,
          });
        }}
        budgetName={deletingBudget?.budget_name}
        onDelete={handleDeleteBudget}
      />

      <FeatureAddAnalyticAccountModal
        open={isAddAnalyticOpen}
        onOpenChange={(open) => patchUiState({ isAddAnalyticOpen: open })}
        onSave={handleCreateAnalyticAccount}
      />

      <FeatureAnalyticBudgetSuccessToast
        open={showSuccessToast}
        onClose={() => patchUiState({ showSuccessToast: false })}
      />
    </>
  );
}
