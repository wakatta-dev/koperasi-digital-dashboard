/** @format */

"use client";

import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type OrderStatusModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  currentStatusLabel: string;
  status: string;
  statusOptions: ReadonlyArray<{ value: string; label: string }>;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  note: string;
  reasonRequired?: boolean;
  noteError?: string;
  onStatusChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
}>;

export function OrderStatusModal({
  open,
  onOpenChange,
  orderNumber,
  currentStatusLabel,
  status,
  statusOptions,
  submitDisabled = false,
  isSubmitting = false,
  note,
  reasonRequired = false,
  noteError,
  onStatusChange,
  onNoteChange,
  onSubmit,
}: OrderStatusModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        className="bg-white dark:bg-surface-dark w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Update Status Pesanan</DialogTitle>
        <DialogDescription className="sr-only">
          Pilih status lanjutan untuk pesanan {orderNumber}.
        </DialogDescription>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Status Pesanan
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Pesanan
            </label>
            <div className="relative">
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 pr-10 focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Status saat ini:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {currentStatusLabel}
              </span>
            </p>
            {statusOptions.length === 0 ? (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Tidak ada transisi status lanjutan untuk pesanan{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {orderNumber}
                </span>
                .
              </p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan Internal{" "}
              <span className="text-xs font-normal text-gray-400">
                {reasonRequired ? "(Wajib)" : "(Opsional)"}
              </span>
            </label>
            <Textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder={
                reasonRequired
                  ? "Wajib isi alasan perubahan status ini..."
                  : "Tambahkan alasan atau catatan untuk perubahan ini..."
              }
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 focus-visible:ring-2 focus-visible:ring-indigo-600/50 focus-visible:border-indigo-600 transition-all resize-none"
              aria-invalid={Boolean(noteError)}
            />
            {noteError ? (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{noteError}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>
              {reasonRequired
                ? "Alasan wajib untuk transisi berisiko agar jejak audit tetap aman."
                : "Catatan membantu audit internal saat status pesanan diperbarui."}
            </span>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitDisabled || isSubmitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {isSubmitting ? "Menyimpan..." : "Perbarui Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
