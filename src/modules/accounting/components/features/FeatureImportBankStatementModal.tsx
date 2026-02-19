/** @format */

"use client";

import { FileUp, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EMPTY_IMPORT_STATEMENT_DRAFT } from "../../constants/bank-cash-initial-state";
import type { ImportStatementDraft } from "../../types/bank-cash";

type AccountOption = {
  account_id: string;
  label: string;
};

type FeatureImportBankStatementModalProps = {
  open: boolean;
  draft?: ImportStatementDraft;
  accountOptions?: AccountOption[];
  onOpenChange: (open: boolean) => void;
  onDraftChange?: (draft: ImportStatementDraft) => void;
  onSubmit?: () => void;
};

const DEFAULT_ACCOUNTS: AccountOption[] = [
  // Intentional empty default: options should come from backend.
];

export function FeatureImportBankStatementModal({
  open,
  draft = EMPTY_IMPORT_STATEMENT_DRAFT,
  accountOptions = DEFAULT_ACCOUNTS,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: FeatureImportBankStatementModalProps) {
  const patch = (next: Partial<ImportStatementDraft>) => {
    onDraftChange?.({ ...draft, ...next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-slate-900/60 backdrop-blur-sm"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-700 dark:bg-slate-900"
      >
        <DialogHeader className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Import Bank Statement
          </DialogTitle>
          <DialogDescription className="sr-only">
            Import Bank Statement modal
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Target Bank Account
            </label>
            <Select
              value={draft.account_id}
              onValueChange={(next) => patch({ account_id: next })}
            >
              <SelectTrigger className="bg-gray-50 text-sm dark:bg-gray-800">
                <SelectValue placeholder="Select Bank Account" />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    Belum ada rekening bank
                  </SelectItem>
                ) : null}
                {accountOptions.map((option) => (
                  <SelectItem key={option.account_id} value={option.account_id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Upload Statement File
            </label>
            <button
              type="button"
              onClick={() =>
                patch({
                  file_name: "statement-nov-2023.csv",
                  file_type: "csv",
                  file_size_bytes: 1024,
                })
              }
              className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-800"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/30 dark:text-indigo-400">
                <FileUp className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: CSV, XLS, XLSX (Max 5MB)
              </p>
              {draft.file_name ? (
                <p className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  {draft.file_name}
                </p>
              ) : null}
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
            <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Not sure about the format?</span>
              <Button
                type="button"
                variant="link"
                className="ml-1 h-auto p-0 text-sm font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
              >
                Download Template
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
              Upload & Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
