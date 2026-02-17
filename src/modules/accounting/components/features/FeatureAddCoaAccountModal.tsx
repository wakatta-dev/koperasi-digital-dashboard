/** @format */

"use client";

import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";

type FeatureAddCoaAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
};

export function FeatureAddCoaAccountModal({
  open,
  onOpenChange,
  onSave,
}: FeatureAddCoaAccountModalProps) {
  const [accountCode, setAccountCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Asset");
  const [parentAccount, setParentAccount] = useState("11000");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
    setAccountCode("");
    setAccountName("");
    setAccountType("Asset");
    setParentAccount("11000");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/50 backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Tambah Akun Baru
          </DialogTitle>
          <DialogDescription className="sr-only">Tambah akun COA baru.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kode Akun
            </Label>
            <Input
              value={accountCode}
              onChange={(event) => setAccountCode(event.target.value)}
              placeholder="e.g. 11103"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Akun
            </Label>
            <Input
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              placeholder="e.g. Mandiri Bank"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipe Akun
            </Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih tipe akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Liability">Liability</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Akun Induk / Parent Account
            </Label>
            <Select value={parentAccount} onValueChange={setParentAccount}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih akun induk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">None (Root Account)</SelectItem>
                <SelectItem value="10000">10000 - Assets</SelectItem>
                <SelectItem value="11000">11000 - Current Assets</SelectItem>
                <SelectItem value="11100">11100 - Cash &amp; Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi
            </Label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description for this account..."
              rows={3}
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
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
            Simpan Akun
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

