/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type GuestRequestStatusVariant =
  | "verifying"
  | "approved"
  | "completed"
  | "rejected";

export type GuestRequestStatusDetails = {
  renterName: string;
  assetKind: string;
  dateRangeLabel: string;
  totalLabel: string;
};

export type GuestRequestStatusResult = {
  requestTitle: string;
  ticketLabel: string;
  badgeLabel: string;
  variant: GuestRequestStatusVariant;
  details: GuestRequestStatusDetails;
  rejectionReason?: string;
  onOpenUploadProof?: () => void;
};

type GuestRequestStatusFeatureProps = Readonly<{
  ticketValue: string;
  onTicketValueChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  result?: GuestRequestStatusResult | null;
}>;

function badgeClasses(variant: GuestRequestStatusVariant) {
  switch (variant) {
    case "approved":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    case "verifying":
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  }
}

function progressStyle(variant: GuestRequestStatusVariant) {
  switch (variant) {
    case "approved":
      return {
        barClass: "bg-brand-primary",
        barStyle: "md:w-[75%] bottom-1/4",
      };
    case "completed":
      return { barClass: "bg-green-500", barStyle: "md:w-full bottom-0" };
    case "rejected":
      return { barClass: "bg-brand-primary", barStyle: "md:w-1/3 bottom-1/2" };
    case "verifying":
    default:
      return { barClass: "bg-brand-primary", barStyle: "md:w-1/2 bottom-1/2" };
  }
}

export function GuestRequestStatusFeature({
  ticketValue,
  onTicketValueChange,
  onSubmit,
  submitting,
  result,
}: GuestRequestStatusFeatureProps) {
  const variant = result?.variant ?? "verifying";
  const progress = progressStyle(variant);

  return (
    <section className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Cek Status Pengajuan
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Pantau proses pengajuan sewa aset atau layanan BUMDes Anda secara
            realtime.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col gap-4 mb-8">
              <label
                className="text-sm font-semibold text-gray-900 dark:text-white"
                htmlFor="ticket_number"
              >
                Nomor Tiket Pengajuan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 text-xl">
                    confirmation_number
                  </span>
                </div>
                <Input
                  id="ticket_number"
                  value={ticketValue}
                  onChange={(e) => onTicketValueChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-lg rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary block pl-12 p-4 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Masukkan Nomor Pengajuan (Contoh: #SQ-99210)"
                />
              </div>
              <Button
                type="button"
                disabled={Boolean(submitting)}
                onClick={onSubmit}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-base font-bold py-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span className="material-icons-outlined">search</span>
                Cek Status
              </Button>
            </div>

            {result ? (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.requestTitle}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nomor Tiket:{" "}
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        {result.ticketLabel}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeClasses(
                      result.variant,
                    )}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        result.variant === "rejected"
                          ? "bg-red-500"
                          : result.variant === "approved"
                            ? "bg-green-500 animate-pulse"
                            : result.variant === "completed"
                              ? "bg-green-500"
                              : "bg-yellow-500 animate-pulse"
                      }`}
                    />
                    {result.badgeLabel}
                  </div>
                </div>

                <div
                  className={`relative ${result.variant === "completed" ? "mb-10" : ""}`}
                >
                  <div className="absolute left-4 md:left-0 top-0 bottom-0 md:top-5 md:bottom-auto md:w-full md:h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-10"></div>
                  <div
                    className={`absolute left-4 md:left-0 top-0 md:top-5 md:bottom-auto md:h-1 rounded-full -z-10 ${progress.barClass} ${progress.barStyle}`}
                  ></div>

                  <div className="flex flex-col md:flex-row justify-between h-full md:h-auto gap-8 md:gap-0">
                    <div className="flex md:flex-col items-center gap-4 md:gap-2 group">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-surface-card-dark shadow-md z-10 ${
                          result.variant === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-brand-primary text-white"
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span
                          className={`text-sm font-bold ${
                            result.variant === "completed"
                              ? "text-green-600 dark:text-green-400"
                              : "text-brand-primary"
                          }`}
                        >
                          Diajukan
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center gap-4 md:gap-2 group">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-surface-card-dark shadow-md z-10 ${
                          result.variant === "completed"
                            ? "bg-green-500 text-white"
                            : result.variant === "verifying"
                              ? "bg-white dark:bg-surface-card-dark text-brand-primary border-4 border-brand-primary"
                              : "bg-brand-primary text-white"
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          {result.variant === "verifying" ? "sync" : "check"}
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span
                          className={`text-sm font-bold ${
                            result.variant === "verifying"
                              ? "text-gray-900 dark:text-white"
                              : result.variant === "completed"
                                ? "text-green-600 dark:text-green-400"
                                : "text-brand-primary"
                          }`}
                        >
                          Verifikasi
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.variant === "verifying"
                            ? "Sedang diproses"
                            : "-"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex md:flex-col items-center gap-4 md:gap-2 group ${result.variant === "verifying" || result.variant === "rejected" ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-surface-card-dark shadow-md z-10 ${
                          result.variant === "approved"
                            ? "bg-white dark:bg-surface-card-dark text-brand-primary border-4 border-brand-primary"
                            : result.variant === "completed"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          {result.variant === "approved"
                            ? "verified"
                            : result.variant === "completed"
                              ? "check"
                              : "3"}
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span
                          className={`text-sm ${result.variant === "completed" ? "font-bold text-green-600 dark:text-green-400" : result.variant === "approved" ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-500 dark:text-gray-400"}`}
                        >
                          Disetujui
                        </span>
                        <span
                          className={`text-xs ${result.variant === "approved" ? "text-brand-primary font-medium" : "text-transparent select-none"}`}
                        >
                          Menunggu Pembayaran
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex md:flex-col items-center gap-4 md:gap-2 group ${result.variant === "completed" ? "" : "opacity-50"}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-surface-card-dark z-10 ${
                          result.variant === "completed"
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          {result.variant === "completed" ? "check" : "4"}
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span
                          className={`text-sm ${result.variant === "completed" ? "font-bold text-green-600 dark:text-green-400" : "font-medium text-gray-500 dark:text-gray-400"}`}
                        >
                          Selesai
                        </span>
                        <span className="text-xs text-transparent select-none">
                          -
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {result.variant === "rejected" ? (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                        <span className="material-icons-outlined">
                          report_problem
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
                          Alasan Penolakan
                        </h4>
                        <p className="text-red-700 dark:text-red-200/80 mb-4">
                          Mohon maaf, pengajuan sewa Anda belum dapat kami
                          proses karena:{" "}
                          <span className="font-semibold">
                            {result.rejectionReason || "-"}
                          </span>
                        </p>
                        <Button
                          type="button"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <span className="material-icons-outlined text-sm">
                            chat
                          </span>
                          Hubungi Admin
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Detail Permintaan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Nama Pemohon
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.details.renterName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Jenis Aset
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.details.assetKind}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Tanggal Sewa
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.details.dateRangeLabel}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Total Biaya
                      </p>
                      <p className="font-bold text-brand-primary">
                        {result.details.totalLabel}
                      </p>
                    </div>
                  </div>

                  {result.variant === "verifying" ? (
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 text-sm text-brand-primary font-medium hover:underline flex items-center justify-center gap-1">
                        <span className="material-icons-outlined text-sm">
                          print
                        </span>{" "}
                        Cetak Bukti
                      </button>
                      <button className="flex-1 text-sm text-gray-500 font-medium hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1">
                        <span className="material-icons-outlined text-sm">
                          help_outline
                        </span>{" "}
                        Bantuan
                      </button>
                    </div>
                  ) : null}

                  {result.variant === "rejected" ? (
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 text-sm text-brand-primary font-medium hover:underline flex items-center justify-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="material-icons-outlined text-sm">
                          print
                        </span>{" "}
                        Cetak Bukti
                      </button>
                      <button className="flex-1 text-sm text-gray-500 font-medium hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1">
                        <span className="material-icons-outlined text-sm">
                          help_outline
                        </span>{" "}
                        Bantuan
                      </button>
                    </div>
                  ) : null}
                </div>

                {result.variant === "approved" ? (
                  <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
                    <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/40 border-b border-indigo-100 dark:border-indigo-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-surface-card-dark items-center justify-center text-brand-primary shadow-sm flex">
                          <span className="material-icons-outlined">
                            payments
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                            Informasi Pembayaran
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Selesaikan pembayaran untuk memproses tiket.
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="material-icons-outlined text-sm">
                          schedule
                        </span>
                        Menunggu Pelunasan
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-surface-card-dark p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Total Tagihan
                          </span>
                          <span className="text-2xl font-extrabold text-brand-primary">
                            {result.details.totalLabel}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Metode Pembayaran Tersedia
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
                              <span className="material-icons-outlined text-brand-primary text-2xl group-hover:scale-110 transition-transform">
                                account_balance
                              </span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                                Transfer Bank
                              </span>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
                              <span className="material-icons-outlined text-brand-primary text-2xl group-hover:scale-110 transition-transform">
                                qr_code_2
                              </span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                                QRIS
                              </span>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
                              <span className="material-icons-outlined text-brand-primary text-2xl group-hover:scale-110 transition-transform">
                                storefront
                              </span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                                Bayar di Kantor
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] flex items-center justify-center gap-2">
                            <span className="material-icons-outlined">
                              credit_card
                            </span>
                            Bayar Sekarang
                          </button>
                          <button
                            type="button"
                            onClick={() => result.onOpenUploadProof?.()}
                            className="flex-1 bg-white dark:bg-surface-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 text-sm font-bold px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-icons-outlined">
                              upload_file
                            </span>
                            Unggah Bukti Pembayaran
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {result.variant === "completed" ? (
                  <div className="mt-6 bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-100 dark:border-green-800/50">
                    <div className="flex items-center gap-3 mb-4 border-b border-green-200 dark:border-green-800 pb-2">
                      <span className="material-icons-outlined text-green-600 dark:text-green-400">
                        assignment_turned_in
                      </span>
                      <h4 className="font-bold text-green-800 dark:text-green-300">
                        Informasi Pengembalian
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-xs text-green-700/70 dark:text-green-300/70 uppercase tracking-wider mb-1">
                          Tanggal Dikembalikan
                        </p>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          -
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700/70 dark:text-green-300/70 uppercase tracking-wider mb-1">
                          Kondisi Aset
                        </p>
                        <p className="font-medium text-green-900 dark:text-green-100 flex items-center gap-1">
                          <span className="material-icons-outlined text-sm">
                            thumb_up
                          </span>{" "}
                          Baik
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700/70 dark:text-green-300/70 uppercase tracking-wider mb-1">
                          Diterima Oleh
                        </p>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          -
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700/70 dark:text-green-300/70 uppercase tracking-wider mb-1">
                          Catatan Tambahan
                        </p>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          -
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-green-600/20 hover:shadow-green-600/30 flex items-center justify-center gap-2">
                        <span className="material-icons-outlined">
                          download
                        </span>{" "}
                        Download Bukti Selesai
                      </button>
                      <button className="flex-1 text-sm text-brand-primary font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-3 rounded-xl transition-colors flex items-center justify-center gap-1 border border-brand-primary/20">
                        <span className="material-icons-outlined text-sm">
                          print
                        </span>{" "}
                        Cetak Invoice
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mengalami kendala saat mengecek status?{" "}
            <a
              className="text-brand-primary hover:text-brand-primary-hover font-medium"
              href="#"
            >
              Hubungi Admin Desa
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
