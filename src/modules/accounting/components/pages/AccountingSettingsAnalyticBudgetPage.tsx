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

import { ANALYTIC_ACCOUNT_CARDS, BUDGET_ROWS } from "../../constants/settings-dummy";
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

  const [isCreateBudgetOpen, setCreateBudgetOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRow | null>(null);
  const [isDeleteBudgetOpen, setDeleteBudgetOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState<BudgetRow | null>(null);
  const [isAddAnalyticOpen, setAddAnalyticOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const budgetRows = useMemo(() => {
    if (!budgetsQuery.data?.items?.length) {
      return BUDGET_ROWS;
    }
    return mapBudgetRows(budgetsQuery.data.items);
  }, [budgetsQuery.data?.items]);

  const analyticAccountCards = useMemo(() => {
    if (!analyticAccountsQuery.data?.items?.length) {
      return ANALYTIC_ACCOUNT_CARDS;
    }
    return mapAnalyticAccountCards(analyticAccountsQuery.data.items);
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
    setActionError(null);
    try {
      await createBudget.mutateAsync({ payload });
      setShowSuccessToast(true);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
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

    setActionError(null);
    try {
      await updateBudget.mutateAsync({
        budgetId: editingBudget.budget_id,
        payload,
      });
      setEditingBudget(null);
      setShowSuccessToast(true);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleDeleteBudget = async () => {
    if (!deletingBudget) return;

    setActionError(null);
    try {
      await deleteBudget.mutateAsync({ budgetId: deletingBudget.budget_id });
      setDeletingBudget(null);
      setDeleteBudgetOpen(false);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleCreateAnalyticAccount = async (payload: {
    account_name: string;
    reference_code: string;
    parent_analytic_account_id?: string;
  }) => {
    setActionError(null);
    try {
      await createAnalyticAccount.mutateAsync({ payload });
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

      <FeatureAnalyticBudgetWorkspace
        budgetRows={budgetRows}
        analyticAccountCards={analyticAccountCards}
        onCreateBudget={() => setCreateBudgetOpen(true)}
        onAddAnalyticAccount={() => setAddAnalyticOpen(true)}
        onEditBudget={(budgetId) => {
          const selectedBudget = budgetRows.find((item) => item.budget_id === budgetId) ?? null;
          setEditingBudget(selectedBudget);
        }}
      />

      <FeatureCreateBudgetModal
        open={isCreateBudgetOpen}
        onOpenChange={setCreateBudgetOpen}
        onSave={handleCreateBudget}
      />

      <FeatureEditBudgetModal
        open={Boolean(editingBudget)}
        onOpenChange={(open) => {
          if (!open) setEditingBudget(null);
        }}
        onSave={handleUpdateBudget}
        onRequestDelete={() => {
          if (editingBudget) {
            setDeletingBudget(editingBudget);
          }
          setEditingBudget(null);
          setDeleteBudgetOpen(true);
        }}
      />

      <FeatureDeleteBudgetModal
        open={isDeleteBudgetOpen}
        onOpenChange={(open) => {
          setDeleteBudgetOpen(open);
          if (!open) setDeletingBudget(null);
        }}
        budgetName={deletingBudget?.budget_name}
        onDelete={handleDeleteBudget}
      />

      <FeatureAddAnalyticAccountModal
        open={isAddAnalyticOpen}
        onOpenChange={setAddAnalyticOpen}
        onSave={handleCreateAnalyticAccount}
      />

      <FeatureAnalyticBudgetSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
