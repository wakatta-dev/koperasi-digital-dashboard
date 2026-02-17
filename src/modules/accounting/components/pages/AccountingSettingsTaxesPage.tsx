/** @format */

"use client";

import { useState } from "react";

import { FeatureCreateTaxModal } from "../features/FeatureCreateTaxModal";
import { FeatureDeleteTaxModal } from "../features/FeatureDeleteTaxModal";
import { FeatureEditTaxModal } from "../features/FeatureEditTaxModal";
import { FeatureTaxActionMenu } from "../features/FeatureTaxActionMenu";
import { FeatureTaxesTable } from "../features/FeatureTaxesTable";
import type { TaxRow } from "../../types/settings";

export function AccountingSettingsTaxesPage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRow | null>(null);
  const [deletingTax, setDeletingTax] = useState<TaxRow | null>(null);

  return (
    <>
      <FeatureTaxesTable
        onCreateTax={() => setCreateModalOpen(true)}
        renderActions={(tax) => (
          <FeatureTaxActionMenu
            tax={tax}
            onEdit={setEditingTax}
            onDuplicate={() => setCreateModalOpen(true)}
            onDelete={setDeletingTax}
          />
        )}
      />

      <FeatureCreateTaxModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} />

      <FeatureEditTaxModal
        open={Boolean(editingTax)}
        onOpenChange={(open) => {
          if (!open) setEditingTax(null);
        }}
        tax={editingTax}
      />

      <FeatureDeleteTaxModal
        open={Boolean(deletingTax)}
        onOpenChange={(open) => {
          if (!open) setDeletingTax(null);
        }}
        taxName={deletingTax?.tax_name}
      />
    </>
  );
}
