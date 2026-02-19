/** @format */

"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type FeatureAddCurrencyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCurrency?: (payload: {
    currency_name: string;
    currency_code: string;
    symbol: string;
    exchange_rate: number;
    auto_rate_update_enabled: boolean;
  }) => void;
};

export function FeatureAddCurrencyModal({
  open,
  onOpenChange,
  onAddCurrency,
}: FeatureAddCurrencyModalProps) {
  const [currencyName, setCurrencyName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [autoRateUpdate, setAutoRateUpdate] = useState(true);

  const handleAddCurrency = () => {
    onAddCurrency?.({
      currency_name: currencyName.trim(),
      currency_code: currencyCode.trim().toUpperCase(),
      symbol: symbol.trim(),
      exchange_rate: Number(exchangeRate || 0),
      auto_rate_update_enabled: autoRateUpdate,
    });
    onOpenChange(false);
    setCurrencyName("");
    setCurrencyCode("");
    setSymbol("");
    setExchangeRate("");
    setAutoRateUpdate(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/50 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Add New Currency
          </DialogTitle>
          <DialogDescription className="sr-only">Add a new currency.</DialogDescription>
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

        <div className="space-y-5 px-6 py-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency Name
            </Label>
            <Input
              value={currencyName}
              onChange={(event) => setCurrencyName(event.target.value)}
              placeholder="e.g. British Pound"
              className="border-gray-300 bg-white py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency Code
              </Label>
              <Input
                value={currencyCode}
                onChange={(event) => setCurrencyCode(event.target.value.toUpperCase())}
                placeholder="e.g. GBP"
                className="border-gray-300 bg-white py-2.5 uppercase dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Symbol
              </Label>
              <Input
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                placeholder="e.g. £"
                className="border-gray-300 bg-white py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exchange Rate
            </Label>
            <div className="relative rounded-md shadow-sm">
              <Input
                value={exchangeRate}
                onChange={(event) => setExchangeRate(event.target.value)}
                placeholder="0.0000"
                type="number"
                className="border-gray-300 bg-white py-2.5 pr-12 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                vs IDR
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Set the exchange rate relative to your base currency.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Automatic Rate Update
              </span>
              <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Sync daily from external source
              </span>
            </div>
            <Switch
              checked={autoRateUpdate}
              onCheckedChange={setAutoRateUpdate}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        </div>

        <DialogFooter className="justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddCurrency}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Add Currency
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
