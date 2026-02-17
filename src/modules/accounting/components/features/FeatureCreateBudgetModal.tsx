/** @format */

"use client";

import { useState } from "react";
import { Calendar, Search, X } from "lucide-react";

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

type FeatureCreateBudgetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
};

export function FeatureCreateBudgetModal({
  open,
  onOpenChange,
  onSave,
}: FeatureCreateBudgetModalProps) {
  const [budgetName, setBudgetName] = useState("");
  const [analyticAccount, setAnalyticAccount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
    setBudgetName("");
    setAnalyticAccount("");
    setStartDate("");
    setEndDate("");
    setTargetAmount("");
    setCurrency("USD");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-500/75 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Budget
          </DialogTitle>
          <DialogDescription className="sr-only">Create a new budget.</DialogDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-500"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget Name
            </Label>
            <Input
              value={budgetName}
              onChange={(event) => setBudgetName(event.target.value)}
              placeholder="e.g. Q2 Marketing Campaign"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Analytic Account
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={analyticAccount}
                onChange={(event) => setAnalyticAccount(event.target.value)}
                placeholder="Search department or project..."
                className="border-gray-300 pl-10 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Link this budget to a cost center like Marketing or IT.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="border-gray-300 pl-10 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="border-gray-300 pl-10 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Amount
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">
                  $
                </span>
                <Input
                  value={targetAmount}
                  onChange={(event) => setTargetAmount(event.target.value)}
                  placeholder="0.00"
                  type="number"
                  className="border-gray-300 pl-7 pr-12 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                  USD
                </span>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Save Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

