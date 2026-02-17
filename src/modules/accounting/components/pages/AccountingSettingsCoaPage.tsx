/** @format */

"use client";

import { useMemo, useState } from "react";

import { useAccountingSettingsCoa, useAccountingSettingsCoaMutations } from "@/hooks/queries";
import { toAccountingSettingsApiError } from "@/services/api/accounting-settings";

import { COA_ROWS } from "../../constants/settings-dummy";
import { FeatureAddCoaAccountModal } from "../features/FeatureAddCoaAccountModal";
import { FeatureCoaTable } from "../features/FeatureCoaTable";
import { FeatureDeleteCoaAccountModal } from "../features/FeatureDeleteCoaAccountModal";
import { FeatureEditCoaAccountModal } from "../features/FeatureEditCoaAccountModal";
import { mapCoaRows } from "../../utils/settings-api-mappers";

import type { CoaAccountRow } from "../../types/settings";

export function AccountingSettingsCoaPage() {
  const coaQuery = useAccountingSettingsCoa({ page: 1, per_page: 45 });
  const { createCoa, updateCoa, deleteCoa } = useAccountingSettingsCoaMutations();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CoaAccountRow | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<CoaAccountRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!coaQuery.data?.items?.length) {
      return COA_ROWS;
    }

    return mapCoaRows(coaQuery.data.items);
  }, [coaQuery.data?.items]);

  const queryErrorMessage = coaQuery.error ? toAccountingSettingsApiError(coaQuery.error).message : null;
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
      />

      <FeatureAddCoaAccountModal
        open={isAddModalOpen}
        onOpenChange={setAddModalOpen}
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
