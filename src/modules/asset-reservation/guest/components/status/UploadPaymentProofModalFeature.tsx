/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type UploadPaymentProofModalFeatureProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalLabel: string;
  onSubmit: (args: { file: File; note: string }) => void | Promise<void>;
  submitting?: boolean;
}>;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
}

function isPreviewableImage(file?: File | null) {
  if (!file) return false;
  const type = (file.type || "").toLowerCase();
  return type === "image/png" || type === "image/jpeg" || type === "image/jpg";
}

export function UploadPaymentProofModalFeature({
  open,
  onOpenChange,
  totalLabel,
  onSubmit,
  submitting,
}: UploadPaymentProofModalFeatureProps) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  const previewUrl = useMemo(() => {
    if (!open) return "";
    if (!file) return "";
    if (!isPreviewableImage(file)) return "";
    return URL.createObjectURL(file);
  }, [file, open]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setFile(null);
          setNote("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-gray-900/60 backdrop-blur-sm"
        className="bg-white dark:bg-surface-card-dark w-full max-w-lg rounded-2xl p-0 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Unggah Bukti Pembayaran
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => onOpenChange(false)}
          >
            <span className="material-icons-outlined">close</span>
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-start gap-3">
            <span className="material-icons-outlined text-brand-primary mt-0.5">
              info
            </span>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium text-brand-primary mb-1">
                Informasi Transfer
              </p>
              <p>
                Pastikan nominal transfer sesuai dengan total tagihan{" "}
                <strong>{totalLabel}</strong>. Foto bukti transfer harus jelas
                dan terbaca.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Upload Bukti Transfer
            </label>

            <div className="relative">
              <input
                id="payment-proof-file"
                type="file"
                className="sr-only"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null;
                  if (!selected) return;
                  if (selected.size > 5 * 1024 * 1024) return;
                  setFile(selected);
                }}
              />
              <label
                htmlFor="payment-proof-file"
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-brand-primary dark:hover:border-brand-primary bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl p-8 text-center transition-colors cursor-pointer group block"
              >
                <div className="w-16 h-16 bg-white dark:bg-surface-card-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons-outlined text-3xl text-brand-primary">
                    add_a_photo
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Klik untuk upload atau drag file kesini
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG, PDF (Maks. 5MB)
                </p>
              </label>
            </div>

            {file ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mt-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                  {isPreviewableImage(file) && previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Preview Bukti Bayar"
                      className="w-full h-full object-cover opacity-90"
                      src={previewUrl}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                      <span className="material-icons-outlined text-4xl">
                        description
                      </span>
                      <span className="text-sm font-medium">Preview Bukti Bayar</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => setFile(null)}
                    >
                      <span className="material-icons-outlined">delete</span>
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-surface-card-dark flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="material-icons-outlined text-green-500">
                      check_circle
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatBytes(file.size)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Catatan Tambahan (Opsional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition-shadow"
              placeholder="Contoh: Sudah transfer ke rekening BCA a.n BUMDes"
              rows={2}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={!file || Boolean(submitting)}
            className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2"
            onClick={() => {
              if (!file) return;
              void onSubmit({ file, note });
            }}
          >
            <span className="material-icons-outlined text-sm">send</span>
            Kirim Bukti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
