/** @format */

"use client";

import { useMemo, useState } from "react";

import { useAccountingSettingsCoa, useAccountingSettingsCoaMutations } from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { FeatureAddCoaAccountModal } from "../features/FeatureAddCoaAccountModal";
import { FeatureCoaTable } from "../features/FeatureCoaTable";
import { FeatureDeleteCoaAccountModal } from "../features/FeatureDeleteCoaAccountModal";
import { FeatureEditCoaAccountModal } from "../features/FeatureEditCoaAccountModal";
import { mapCoaRows } from "../../utils/settings-api-mappers";

import type { CoaAccountRow } from "../../types/settings";

export function AccountingSettingsCoaPage() {
  const [uiState, setUiState] = useState({
    page: 1,
    isAddModalOpen: false,
    editingAccount: null as CoaAccountRow | null,
    deletingAccount: null as CoaAccountRow | null,
    actionError: null as string | null,
  });
  const perPage = 45;
  const { page, isAddModalOpen, editingAccount, deletingAccount, actionError } =
    uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };
  const coaQuery = useAccountingSettingsCoa({ page, per_page: perPage });
  const coaLookupQuery = useAccountingSettingsCoa(
    { page: 1, per_page: 100 },
    { enabled: isAddModalOpen }
  );
  const { createCoa, updateCoa, deleteCoa } = useAccountingSettingsCoaMutations();

  const rows = useMemo(() => {
    return mapCoaRows(coaQuery.data?.items ?? []);
  }, [coaQuery.data?.items]);

  const coaLookupItems = useMemo(() => {
    if ((coaLookupQuery.data?.items?.length ?? 0) > 0) {
      return coaLookupQuery.data?.items ?? [];
    }

    return coaQuery.data?.items ?? [];
  }, [coaLookupQuery.data?.items, coaQuery.data?.items]);

  const accountTypeOptions = useMemo(() => {
    const seen = new Set<string>();

    return coaLookupItems
      .map((item) => item.account_type.trim())
      .filter((value) => {
        if (!value || seen.has(value)) return false;
        seen.add(value);
        return true;
      })
      .map((value) => ({
        value,
        label: value,
      }));
  }, [coaLookupItems]);

  const parentAccountOptions = useMemo(() => {
    return coaLookupItems
      .filter((item) => item.is_active)
      .map((item) => ({
        value: item.account_code,
        label: `${item.account_code} - ${item.account_name}`,
      }));
  }, [coaLookupItems]);

  const queryErrorMessage = isAddModalOpen && coaLookupQuery.error
    ? toAccountingSettingsApiError(coaLookupQuery.error).message
    : coaQuery.error
      ? toAccountingSettingsApiError(coaQuery.error).message
      : null;
  const errorMessage = actionError ?? queryErrorMessage;

  const handleCreateAccount = async (payload: {
    account_code: string;
    account_name: string;
    account_type: string;
    parent_account_code?: string;
    description?: string;
  }) => {
    patchUiState({ actionError: null });
    try {
      await createCoa.mutateAsync({ payload });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
      throw err;
    }
  };

  const handleUpdateAccount = async (payload: {
    account_code: string;
    account_name: string;
    account_type: string;
    parent_account_code?: string;
  }) => {
    patchUiState({ actionError: null });
    try {
      await updateCoa.mutateAsync({
        accountCode: editingAccount?.account_code ?? payload.account_code,
        payload: {
          account_name: payload.account_name,
          account_type: payload.account_type,
          parent_account_code: payload.parent_account_code,
        },
      });
      patchUiState({ editingAccount: null });
    } catch (err) {
      patchUiState({ actionError: toAccountingSettingsApiError(err).message });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;

    patchUiState({ actionError: null });
    try {
      await deleteCoa.mutateAsync({ accountCode: deletingAccount.account_code });
      patchUiState({ deletingAccount: null });
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

      <FeatureCoaTable
        rows={rows}
        onAddAccount={() => patchUiState({ isAddModalOpen: true })}
        onEditAccount={(account) => patchUiState({ editingAccount: account })}
        onDeleteAccount={(account) => patchUiState({ deletingAccount: account })}
        pagination={
          coaQuery.data?.pagination
            ? {
                page: coaQuery.data.pagination.page,
                pageSize: coaQuery.data.pagination.per_page,
                totalItems: coaQuery.data.pagination.total_items,
                totalPages: coaQuery.data.pagination.total_pages,
              }
            : {
                page,
                pageSize: perPage,
                totalItems: rows.length,
                totalPages: 1,
              }
        }
        onPageChange={(nextPage) => patchUiState({ page: nextPage })}
      />

      <FeatureAddCoaAccountModal
        open={isAddModalOpen}
        onOpenChange={(open) => patchUiState({ isAddModalOpen: open })}
        accountTypeOptions={accountTypeOptions}
        parentAccountOptions={parentAccountOptions}
        optionsLoading={isAddModalOpen && coaLookupQuery.isLoading && coaLookupItems.length === 0}
        onSave={handleCreateAccount}
      />

      <FeatureEditCoaAccountModal
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) patchUiState({ editingAccount: null });
        }}
        account={editingAccount}
        onSave={handleUpdateAccount}
      />

      <FeatureDeleteCoaAccountModal
        open={Boolean(deletingAccount)}
        onOpenChange={(open) => {
          if (!open) patchUiState({ deletingAccount: null });
        }}
        accountLabel={
          deletingAccount
            ? `"${deletingAccount.account_name} (${deletingAccount.account_code})"`
            : undefined
        }
        onDelete={handleDeleteAccount}
      />
    </>
  );
}
