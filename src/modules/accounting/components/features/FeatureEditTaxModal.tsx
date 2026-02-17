/** @format */

"use client";

import { useEffect, useState } from "react";
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

import type { TaxRow } from "../../types/settings";

type FeatureEditTaxModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tax?: TaxRow | null;
  onSave?: (tax: TaxRow | null | undefined) => void;
};

export function FeatureEditTaxModal({
  open,
  onOpenChange,
  tax,
  onSave,
}: FeatureEditTaxModalProps) {
  const [taxName, setTaxName] = useState("PPN 11%");
  const [taxType, setTaxType] = useState("Sales");
  const [taxRate, setTaxRate] = useState("11.00");
  const [taxAccount, setTaxAccount] = useState("210101");
  const [description, setDescription] = useState("VAT 11 Percent");

  useEffect(() => {
    if (!tax) return;
    setTaxName(tax.tax_name);
    setTaxType(tax.tax_type);
    setTaxRate(tax.rate_percent.replace("%", ""));
    setTaxAccount(tax.tax_account.split(" - ")[0] ?? "210101");
    setDescription(tax.description);
  }, [tax]);

  const handleSave = () => {
    onSave?.(tax);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/75"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Pajak
          </DialogTitle>
          <DialogDescription className="sr-only">Edit konfigurasi pajak.</DialogDescription>
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
              Nama Pajak
            </Label>
            <Input
              value={taxName}
              onChange={(event) => setTaxName(event.target.value)}
              className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Jenis Pajak
              </Label>
              <Select value={taxType} onValueChange={setTaxType}>
                <SelectTrigger className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tarif (%)
              </Label>
              <div className="relative">
                <Input
                  value={taxRate}
                  onChange={(event) => setTaxRate(event.target.value)}
                  className="border-gray-300 px-3 py-2 pr-8 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                  %
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Akun Pajak
            </Label>
            <Select value={taxAccount} onValueChange={setTaxAccount}>
              <SelectTrigger className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="210101">210101 - PPN Keluaran</SelectItem>
                <SelectItem value="110501">110501 - PPN Masukan</SelectItem>
                <SelectItem value="210201">210201 - Hutang PPh 23</SelectItem>
                <SelectItem value="210202">210202 - Hutang PPh 21</SelectItem>
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
              rows={3}
              className="border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
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

