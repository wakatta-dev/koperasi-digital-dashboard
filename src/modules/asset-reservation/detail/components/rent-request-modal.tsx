/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RentRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId?: string;
  statusHref?: string;
};

export function RentRequestModal({ open, onOpenChange, requestId, statusHref }: RentRequestModalProps) {
  const absoluteStatusHref = statusHref
    ? statusHref.startsWith("http")
      ? statusHref
      : `${typeof window !== "undefined" ? window.location.origin : ""}${statusHref}`
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm z-[100]"
        className="max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 shadow-2xl z-[101]"
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

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
          <span className="material-icons-outlined text-5xl text-green-600 dark:text-green-400">
            check_circle
          </span>
        </div>

        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Permintaan Sewa Terkirim!
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Terima kasih! Permintaan Anda telah kami terima. Tim kami akan segera menghubungi Anda
            melalui WhatsApp atau Email untuk konfirmasi ketersediaan dan detail pembayaran.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {statusHref ? (
            <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
              <p className="font-semibold">Simpan tautan berikut untuk memantau status permintaan Anda.</p>
              <p className="text-amber-800/80 dark:text-amber-100/80">
                Tautan ini unik dan memerlukan signature. Salin dan simpan agar tidak hilang.
              </p>
              <div className="break-all font-mono text-[11px] text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded border border-amber-200 dark:border-amber-800 p-2">
                {absoluteStatusHref}
              </div>
            </div>
          ) : null}
          <Button
            className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition transform active:scale-[0.98]"
            asChild
          >
            <a href={absoluteStatusHref ?? statusHref ?? "/penyewaan-aset/status/req-1"}>
              Lihat Permintaan Saya
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl font-semibold transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            onClick={() => onOpenChange(false)}
          >
            Kembali ke Halaman Aset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
