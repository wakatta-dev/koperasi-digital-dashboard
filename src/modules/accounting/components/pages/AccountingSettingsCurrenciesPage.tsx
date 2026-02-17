/** @format */

"use client";

import { useState } from "react";

import { FeatureCurrenciesSuccessToast } from "../features/FeatureCurrenciesSuccessToast";
import { FeatureCurrenciesTable } from "../features/FeatureCurrenciesTable";

export function AccountingSettingsCurrenciesPage() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <>
      <FeatureCurrenciesTable onAddCurrency={() => setShowSuccessToast(true)} />
      <FeatureCurrenciesSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
