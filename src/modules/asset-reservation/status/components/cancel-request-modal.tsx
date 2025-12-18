/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CancelRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CancelRequestModal({ open, onOpenChange }: CancelRequestModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm z-[100]"
        className="max-w-lg p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 shadow-2xl z-[101]"
        showCloseButton={false}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition"
          onClick={() => onOpenChange(false)}
          aria-label="Tutup"
        >
          <span className="material-icons-outlined">close</span>
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <span className="material-icons-outlined text-red-600 dark:text-red-400 text-2xl">
              warning
            </span>
          </div>
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Batalkan Permintaan?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Pembatalan akan menghapus permintaan sewa ini. Anda bisa mengajukan ulang kapan saja.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            variant="ghost"
            className="w-full bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            onClick={() => onOpenChange(false)}
          >
            Kembali
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-red-500/20">
            Ya, Batalkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
