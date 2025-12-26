/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DownloadProofModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proof?: {
    fileName?: string;
    fileSizeLabel?: string;
    downloadUrl?: string;
  } | null;
};

export function DownloadProofModal({
  open,
  onOpenChange,
  proof,
}: DownloadProofModalProps) {
  const fileName = proof?.fileName?.trim();
  const fileSizeLabel = proof?.fileSizeLabel?.trim();
  const downloadUrl = proof?.downloadUrl?.trim();
  const hasProof = Boolean(fileName && downloadUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-gray-900/60 backdrop-blur-sm z-[100]"
        className="sm:max-w-md bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl z-[101]"
        showCloseButton={false}
      >
        <div className="bg-white dark:bg-[#1e293b] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 sm:mx-0 sm:h-10 sm:w-10">
              <span className="material-icons-outlined text-[#4338ca] text-xl">download</span>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <DialogHeader className="text-left space-y-2">
                <DialogTitle className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                  Unduh Bukti Reservasi?
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Anda akan mengunduh bukti reservasi Anda dalam format PDF. Pastikan perangkat Anda
                  memiliki pembaca PDF.
                </DialogDescription>
              </DialogHeader>
                <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="material-icons-outlined text-red-500 text-3xl">picture_as_pdf</span>
                  <div className="overflow-hidden text-left">
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white truncate"
                      title={fileName || "Bukti reservasi belum tersedia"}
                    >
                      {fileName || "Bukti reservasi belum tersedia"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {fileSizeLabel ? `PDF Document • ${fileSizeLabel}` : "PDF Document"}
                    </p>
                  </div>
                </div>
                {!hasProof ? (
                  <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                    Bukti reservasi belum tersedia.
                  </p>
                ) : null}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
          <Button
            className="inline-flex w-full justify-center rounded-xl bg-[#4338ca] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 sm:ml-3 sm:w-auto transition-colors"
            disabled={!hasProof}
            asChild={Boolean(downloadUrl)}
          >
            {downloadUrl ? <a href={downloadUrl}>Ya, Unduh Sekarang</a> : "Ya, Unduh Sekarang"}
          </Button>
          <Button
            variant="ghost"
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white dark:bg-[#1e293b] px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto transition-colors"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
