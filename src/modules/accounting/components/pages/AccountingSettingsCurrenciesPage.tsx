/** @format */

"use client";

import { useState } from "react";

import { FeatureAddCurrencyModal } from "../features/FeatureAddCurrencyModal";
import { FeatureCurrenciesSuccessToast } from "../features/FeatureCurrenciesSuccessToast";
import { FeatureCurrenciesTable } from "../features/FeatureCurrenciesTable";

export function AccountingSettingsCurrenciesPage() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <>
      <FeatureCurrenciesTable onAddCurrency={() => setAddModalOpen(true)} />
      <FeatureAddCurrencyModal
        open={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        onAddCurrency={() => setShowSuccessToast(true)}
      />
      <FeatureCurrenciesSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
