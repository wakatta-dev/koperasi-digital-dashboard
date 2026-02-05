/** @format */

"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type ConfirmActionDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  icon?: ReactNode;
  tone?: "destructive" | "primary";
}>;

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onConfirm,
  icon,
  tone = "destructive",
}: ConfirmActionDialogProps) {
  const handleCancel = () => onOpenChange(false);
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const iconStyles =
    tone === "destructive"
      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400";

  const confirmStyles =
    tone === "destructive"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        className="!bg-white dark:!bg-slate-900 w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-0 text-gray-900 dark:text-white"
        showCloseButton={false}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconStyles}`}>
              {icon ?? <Trash2 className="h-6 w-6" />}
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
          </div>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm ${confirmStyles}`}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
