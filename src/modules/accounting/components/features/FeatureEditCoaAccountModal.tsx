/** @format */

"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

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

import type { CoaAccountRow } from "../../types/settings";

type FeatureEditCoaAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: CoaAccountRow | null;
  onSave?: (account: CoaAccountRow | null | undefined) => void;
};

export function FeatureEditCoaAccountModal({
  open,
  onOpenChange,
  account,
  onSave,
}: FeatureEditCoaAccountModalProps) {
  const [accountCode, setAccountCode] = useState("11101");
  const [accountName, setAccountName] = useState("Bank BCA");
  const [accountType, setAccountType] = useState("Bank & Cash");
  const [parentAccount, setParentAccount] = useState("11100");

  useEffect(() => {
    if (!account) return;
    setAccountCode(account.account_code);
    setAccountName(account.account_name);
    setAccountType(account.account_type);
    setParentAccount(account.level > 0 ? "11100" : "root");
  }, [account]);

  const handleSave = () => {
    onSave?.(account);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/50 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Edit Akun
          </DialogTitle>
          <DialogDescription className="sr-only">Edit akun COA.</DialogDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto px-6 py-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kode Akun <span className="text-red-500">*</span>
            </Label>
            <Input
              value={accountCode}
              onChange={(event) => setAccountCode(event.target.value)}
              className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Akun <span className="text-red-500">*</span>
            </Label>
            <Input
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipe Akun <span className="text-red-500">*</span>
            </Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Bank & Cash">Bank & Cash</SelectItem>
                <SelectItem value="Receivable">Receivable</SelectItem>
                <SelectItem value="Liability">Liability</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Akun Induk
            </Label>
            <Select value={parentAccount} onValueChange={setParentAccount}>
              <SelectTrigger className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">None</SelectItem>
                <SelectItem value="11100">11100 - Cash &amp; Bank</SelectItem>
                <SelectItem value="10000">10000 - Assets</SelectItem>
                <SelectItem value="11000">11000 - Current Assets</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Info className="h-3.5 w-3.5 text-indigo-500" />
              Akun ini akan menjadi sub-akun dari akun induk yang dipilih.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

