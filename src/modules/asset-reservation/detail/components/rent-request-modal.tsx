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

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 border border-dashed border-gray-200 dark:border-gray-600">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1.5">
            ID Permintaan Anda
          </p>
          <div className="flex items-center justify-center gap-2 group cursor-pointer">
            <span className="text-lg font-mono font-bold text-[#4338ca] group-hover:text-indigo-600 transition">
              {requestId ?? "#REQ-ASSET-20231024-001"}
            </span>
            <span className="material-icons-outlined text-gray-400 group-hover:text-[#4338ca] text-sm transition">
              content_copy
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition transform active:scale-[0.98]"
            asChild
          >
            <a href={statusHref ?? "/penyewaan-aset/status/req-1"}>Lihat Permintaan Saya</a>
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
