/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CancelRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "cancel" | "reschedule";
  onConfirm?: () => Promise<void> | void;
  submitting?: boolean;
};

export function CancelRequestModal({
  open,
  onOpenChange,
  mode = "cancel",
  onConfirm,
  submitting,
}: CancelRequestModalProps) {
  const isReschedule = mode === "reschedule";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm z-[100]"
        className="max-w-lg surface-form rounded-2xl z-[101]"
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
              {isReschedule ? "event_repeat" : "warning"}
            </span>
          </div>
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {isReschedule ? "Ajukan Penjadwalan Ulang?" : "Batalkan Permintaan?"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {isReschedule
                ? "Ajukan jadwal baru; tim akan mengkonfirmasi ketersediaan. DP dapat mengikuti kebijakan yang berlaku."
                : "Pembatalan akan menghapus permintaan sewa ini. Anda bisa mengajukan ulang kapan saja."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {isReschedule ? (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Tanggal Mulai Baru
                </label>
                <Input
                  type="date"
                  className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Tanggal Selesai Baru
                </label>
                <Input
                  type="date"
                  className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2"
                />
              </div>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              DP dapat hangus sesuai kebijakan jika permintaan penjadwalan ulang terlalu dekat dengan hari-H.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            Pembatalan di H-3 atau kurang dapat menggugurkan DP sesuai kebijakan BUMDes.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            variant="ghost"
            className="w-full bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            onClick={() => onOpenChange(false)}
            >
            Kembali
          </Button>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-red-500/20 disabled:opacity-60"
            disabled={submitting}
            onClick={async () => {
              await onConfirm?.();
            }}
          >
            {submitting ? "Memproses..." : isReschedule ? "Kirim Permintaan" : "Ya, Batalkan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
