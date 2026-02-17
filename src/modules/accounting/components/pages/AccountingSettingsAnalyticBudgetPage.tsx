/** @format */

"use client";

import { useState } from "react";

import { FeatureAnalyticBudgetSuccessToast } from "../features/FeatureAnalyticBudgetSuccessToast";
import { FeatureAnalyticBudgetWorkspace } from "../features/FeatureAnalyticBudgetWorkspace";

export function AccountingSettingsAnalyticBudgetPage() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <>
      <FeatureAnalyticBudgetWorkspace onCreateBudget={() => setShowSuccessToast(true)} />
      <FeatureAnalyticBudgetSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
