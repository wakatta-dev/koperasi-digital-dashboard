/** @format */

"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FeatureDeleteBudgetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetName?: string;
  onDelete?: () => void;
};

export function FeatureDeleteBudgetModal({
  open,
  onOpenChange,
  budgetName = "Q1 Marketing Campaign",
  onDelete,
}: FeatureDeleteBudgetModalProps) {
  const handleDelete = () => {
    onDelete?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-100 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/60 backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-3">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2 text-left">
              <DialogTitle className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Delete Budget?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the budget{" "}
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  "{budgetName}"
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

