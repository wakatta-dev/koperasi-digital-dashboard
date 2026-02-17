/** @format */

"use client";

import { useState } from "react";

import { FeatureAddAnalyticAccountModal } from "../features/FeatureAddAnalyticAccountModal";
import { FeatureAnalyticBudgetSuccessToast } from "../features/FeatureAnalyticBudgetSuccessToast";
import { FeatureAnalyticBudgetWorkspace } from "../features/FeatureAnalyticBudgetWorkspace";
import { FeatureCreateBudgetModal } from "../features/FeatureCreateBudgetModal";
import { FeatureDeleteBudgetModal } from "../features/FeatureDeleteBudgetModal";
import { FeatureEditBudgetModal } from "../features/FeatureEditBudgetModal";

export function AccountingSettingsAnalyticBudgetPage() {
  const [isCreateBudgetOpen, setCreateBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setEditBudgetOpen] = useState(false);
  const [isDeleteBudgetOpen, setDeleteBudgetOpen] = useState(false);
  const [isAddAnalyticOpen, setAddAnalyticOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <>
      <FeatureAnalyticBudgetWorkspace
        onCreateBudget={() => setCreateBudgetOpen(true)}
        onAddAnalyticAccount={() => setAddAnalyticOpen(true)}
        onEditBudget={() => setEditBudgetOpen(true)}
      />

      <FeatureCreateBudgetModal
        open={isCreateBudgetOpen}
        onOpenChange={setCreateBudgetOpen}
        onSave={() => setShowSuccessToast(true)}
      />

      <FeatureEditBudgetModal
        open={isEditBudgetOpen}
        onOpenChange={setEditBudgetOpen}
        onRequestDelete={() => {
          setEditBudgetOpen(false);
          setDeleteBudgetOpen(true);
        }}
      />

      <FeatureDeleteBudgetModal open={isDeleteBudgetOpen} onOpenChange={setDeleteBudgetOpen} />

      <FeatureAddAnalyticAccountModal open={isAddAnalyticOpen} onOpenChange={setAddAnalyticOpen} />

      <FeatureAnalyticBudgetSuccessToast
        open={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
