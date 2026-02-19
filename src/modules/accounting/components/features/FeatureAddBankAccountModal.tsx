/** @format */

"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EMPTY_ADD_BANK_ACCOUNT_DRAFT } from "../../constants/bank-cash-initial-state";
import type { AddBankAccountDraft } from "../../types/bank-cash";

type FeatureAddBankAccountModalProps = {
  open: boolean;
  draft?: AddBankAccountDraft;
  onOpenChange: (open: boolean) => void;
  onDraftChange?: (draft: AddBankAccountDraft) => void;
  onSubmit?: () => void;
};

export function FeatureAddBankAccountModal({
  open,
  draft = EMPTY_ADD_BANK_ACCOUNT_DRAFT,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: FeatureAddBankAccountModalProps) {
  const patch = (next: Partial<AddBankAccountDraft>) => {
    onDraftChange?.({ ...draft, ...next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-700 dark:bg-slate-900"
      >
        <DialogHeader className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Add Bank Account
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add Bank Account modal
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bank Name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={draft.bank_name}
                onChange={(event) => patch({ bank_name: event.target.value })}
                placeholder="Search bank (e.g. BCA, Mandiri...)"
                className="bg-gray-50 pl-10 text-sm dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <Input
              type="text"
              value={draft.account_name}
              onChange={(event) => patch({ account_name: event.target.value })}
              placeholder="e.g. Operational Account"
              className="bg-gray-50 text-sm dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Number
            </label>
            <Input
              type="text"
              value={draft.account_number}
              onChange={(event) => patch({ account_number: event.target.value })}
              placeholder="e.g. 1234567890"
              className="bg-gray-50 font-mono text-sm dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <Select
                value={draft.currency_code}
                onValueChange={(next) => patch({ currency_code: next })}
              >
                <SelectTrigger className="bg-gray-50 text-sm dark:bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Initial Balance
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-gray-400">
                  Rp
                </span>
                <Input
                  type="number"
                  value={draft.initial_balance_amount}
                  onChange={(event) =>
                    patch({ initial_balance_amount: event.target.value })
                  }
                  placeholder="0"
                  className="bg-gray-50 pl-9 text-sm dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
