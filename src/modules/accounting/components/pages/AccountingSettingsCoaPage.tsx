/** @format */

"use client";

import { useState } from "react";

import { FeatureAddCoaAccountModal } from "../features/FeatureAddCoaAccountModal";
import { FeatureCoaTable } from "../features/FeatureCoaTable";
import { FeatureDeleteCoaAccountModal } from "../features/FeatureDeleteCoaAccountModal";
import { FeatureEditCoaAccountModal } from "../features/FeatureEditCoaAccountModal";

import type { CoaAccountRow } from "../../types/settings";

export function AccountingSettingsCoaPage() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CoaAccountRow | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<CoaAccountRow | null>(null);

  return (
    <>
      <FeatureCoaTable
        onAddAccount={() => setAddModalOpen(true)}
        onEditAccount={(account) => setEditingAccount(account)}
        onDeleteAccount={(account) => setDeletingAccount(account)}
      />

      <FeatureAddCoaAccountModal open={isAddModalOpen} onOpenChange={setAddModalOpen} />

      <FeatureEditCoaAccountModal
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) setEditingAccount(null);
        }}
        account={editingAccount}
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
      />
    </>
  );
}
