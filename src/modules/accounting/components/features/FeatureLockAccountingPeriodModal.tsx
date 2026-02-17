/** @format */

import { AlertTriangle, Lock } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

import { JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD } from "../../constants/journal-seed";
import type { JournalPeriodLockSelection } from "../../types/journal";

type FeatureLockAccountingPeriodModalProps = {
  open: boolean;
  selection?: JournalPeriodLockSelection;
  onSelectionChange?: (next: JournalPeriodLockSelection) => void;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

export function FeatureLockAccountingPeriodModal({
  open,
  selection = JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD,
  onSelectionChange,
  onOpenChange,
  onConfirm,
}: FeatureLockAccountingPeriodModalProps) {
  const patch = (next: Partial<JournalPeriodLockSelection>) => {
    onSelectionChange?.({ ...selection, ...next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/50 backdrop-blur-sm"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-700 dark:bg-slate-900"
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Lock className="h-5 w-5 text-indigo-600" />
            Lock Accounting Period
          </DialogTitle>
          <DialogDescription className="sr-only">
            Lock accounting period dialog
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <Alert className="border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription>
              Locking this period will prevent any new entries or modifications to existing journals within this date range.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Period to Lock
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Month
                </label>
                <Select value={selection.month} onValueChange={(next) => patch({ month: next })}>
                  <SelectTrigger className="bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Year
                </label>
                <Select value={selection.year} onValueChange={(next) => patch({ year: next })}>
                  <SelectTrigger className="bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/30">
          <Button
            type="button"
            variant="ghost"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700"
            onClick={onConfirm}
          >
            <Lock className="mr-2 h-4 w-4" />
            Lock Period
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
