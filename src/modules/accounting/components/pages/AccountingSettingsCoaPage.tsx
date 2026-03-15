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
  const [page, setPage] = useState(1);
  const perPage = 45;
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const coaQuery = useAccountingSettingsCoa({ page, per_page: perPage });
  const coaLookupQuery = useAccountingSettingsCoa(
    { page: 1, per_page: 100 },
    { enabled: isAddModalOpen }
  );
  const { createCoa, updateCoa, deleteCoa } = useAccountingSettingsCoaMutations();

  const [editingAccount, setEditingAccount] = useState<CoaAccountRow | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<CoaAccountRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
    setActionError(null);
    try {
      await createCoa.mutateAsync({ payload });
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
      throw err;
    }
  };

  const handleUpdateAccount = async (payload: {
    account_code: string;
    account_name: string;
    account_type: string;
    parent_account_code?: string;
  }) => {
    setActionError(null);
    try {
      await updateCoa.mutateAsync({
        accountCode: editingAccount?.account_code ?? payload.account_code,
        payload: {
          account_name: payload.account_name,
          account_type: payload.account_type,
          parent_account_code: payload.parent_account_code,
        },
      });
      setEditingAccount(null);
    } catch (err) {
      setActionError(toAccountingSettingsApiError(err).message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;

    setActionError(null);
    try {
      await deleteCoa.mutateAsync({ accountCode: deletingAccount.account_code });
      setDeletingAccount(null);
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

      <FeatureCoaTable
        rows={rows}
        onAddAccount={() => setAddModalOpen(true)}
        onEditAccount={(account) => setEditingAccount(account)}
        onDeleteAccount={(account) => setDeletingAccount(account)}
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
        onPageChange={setPage}
      />

      <FeatureAddCoaAccountModal
        open={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        accountTypeOptions={accountTypeOptions}
        parentAccountOptions={parentAccountOptions}
        optionsLoading={isAddModalOpen && coaLookupQuery.isLoading && coaLookupItems.length === 0}
        onSave={handleCreateAccount}
      />

      <FeatureEditCoaAccountModal
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) setEditingAccount(null);
        }}
        account={editingAccount}
        onSave={handleUpdateAccount}
      />

      <FeatureDeleteCoaAccountModal
        open={Boolean(deletingAccount)}
        onOpenChange={(open) => {
          if (!open) setDeletingAccount(null);
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
