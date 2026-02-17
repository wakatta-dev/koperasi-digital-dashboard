/** @format */

"use client";

import { useState } from "react";
import { Info, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FeatureEditBudgetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (payload: {
    budget_name: string;
    analytic_account_id: string;
    start_date: string;
    end_date: string;
    currency_code: string;
    target_amount: number;
  }) => void;
  onRequestDelete?: () => void;
};

export function FeatureEditBudgetModal({
  open,
  onOpenChange,
  onSave,
  onRequestDelete,
}: FeatureEditBudgetModalProps) {
  const [budgetName, setBudgetName] = useState("Q1 Marketing Campaign");
  const [analyticAccount, setAnalyticAccount] = useState("marketing");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-31");
  const [targetAmount, setTargetAmount] = useState("50,000.00");

  const handleSave = () => {
    onSave?.({
      budget_name: budgetName.trim(),
      analytic_account_id: analyticAccount,
      start_date: startDate,
      end_date: endDate,
      currency_code: "USD",
      target_amount: Number(targetAmount.replace(/,/g, "") || 0),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-500/75 dark:bg-gray-900/80"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Pencil className="h-4 w-4 text-indigo-600" />
            Edit Budget
          </DialogTitle>
          <DialogDescription className="sr-only">Edit budget.</DialogDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-4 p-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget Name
            </Label>
            <Input
              value={budgetName}
              onChange={(event) => setBudgetName(event.target.value)}
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Analytic Account
            </Label>
            <Select value={analyticAccount} onValueChange={setAnalyticAccount}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing Dept (MKT-001)</SelectItem>
                <SelectItem value="it">Technology Dept (TECH-002)</SelectItem>
                <SelectItem value="hr">Human Resources (HR-005)</SelectItem>
                <SelectItem value="sales">Sales Dept (SLS-003)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Amount
            </Label>
            <div className="relative rounded-md shadow-sm">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">
                $
              </span>
              <Input
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                placeholder="0.00"
                className="border-gray-300 pl-7 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                USD
              </span>
            </div>
          </div>

          <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Changes to the period may affect existing analytic entries.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="ghost"
            className="gap-1 p-0 text-sm font-medium text-red-600 hover:bg-transparent hover:text-red-700"
            onClick={onRequestDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Budget
          </Button>
          <DialogFooter className="gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
