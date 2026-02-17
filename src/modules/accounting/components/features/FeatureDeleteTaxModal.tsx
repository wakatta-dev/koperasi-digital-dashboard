/** @format */

"use client";

import { AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FeatureDeleteTaxModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxName?: string;
  onDelete?: () => void;
};

export function FeatureDeleteTaxModal({
  open,
  onOpenChange,
  taxName = "PPN 11%",
  onDelete,
}: FeatureDeleteTaxModalProps) {
  const handleDelete = () => {
    onDelete?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md overflow-hidden border-gray-100 p-0 dark:border-gray-700"
        overlayClassName="bg-slate-900/65 backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Hapus Pajak?
              </DialogTitle>
            </div>
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
          </div>
          <DialogDescription className="pt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus pajak{" "}
            <span className="font-semibold text-gray-900 dark:text-white">"{taxName}"</span>?
            Transaksi yang sudah menggunakan pajak ini tidak akan terpengaruh, namun Anda tidak
            dapat menggunakannya lagi untuk transaksi baru.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row dark:border-gray-700/50 dark:bg-gray-800/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Batal
          </Button>
          <Button type="button" onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
            Hapus Pajak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

