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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type FeatureCreateTaxModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (payload: {
    tax_name: string;
    tax_type: "Sales" | "Purchase" | "Both" | "None";
    rate_percent: number;
    tax_account_code: string;
    description?: string;
    is_active: boolean;
  }) => void;
};

export function FeatureCreateTaxModal({
  open,
  onOpenChange,
  onSave,
}: FeatureCreateTaxModalProps) {
  const [taxName, setTaxName] = useState("");
  const [taxType, setTaxType] = useState("Sales");
  const [taxRate, setTaxRate] = useState("0");
  const [taxAccount, setTaxAccount] = useState("none");
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    onSave?.({
      tax_name: taxName.trim(),
      tax_type: taxType as "Sales" | "Purchase" | "Both" | "None",
      rate_percent: Number(taxRate || 0),
      tax_account_code: taxAccount === "none" ? "" : taxAccount,
      description: undefined,
      is_active: isActive,
    });
    onOpenChange(false);
    setTaxName("");
    setTaxType("Sales");
    setTaxRate("0");
    setTaxAccount("none");
    setIsActive(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-100 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/50 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Tambah Pajak Baru
          </DialogTitle>
          <DialogDescription className="sr-only">Tambah konfigurasi pajak baru.</DialogDescription>
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

        <div className="space-y-5 bg-white px-6 py-6 dark:bg-slate-900">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Pajak
            </Label>
            <Input
              value={taxName}
              onChange={(event) => setTaxName(event.target.value)}
              placeholder="Contoh: PPN 11%"
              className="border-gray-300 bg-white py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipe Pajak
              </Label>
              <Select value={taxType} onValueChange={setTaxType}>
                <SelectTrigger className="border-gray-300 bg-white py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
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
                  placeholder="0"
                  type="number"
                  className="border-gray-300 bg-white py-2.5 pr-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
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
              <SelectTrigger className="border-gray-300 bg-white py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih Akun COA..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pilih Akun COA...</SelectItem>
                <SelectItem value="210101">210101 - PPN Keluaran (Liability)</SelectItem>
                <SelectItem value="110501">110501 - PPN Masukan (Asset)</SelectItem>
                <SelectItem value="210201">210201 - Hutang PPh 23 (Liability)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Status Aktif</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Aktifkan pajak ini untuk digunakan dalam transaksi.
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Simpan Pajak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
