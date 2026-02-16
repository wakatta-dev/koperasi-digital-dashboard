/** @format */

"use client";

import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import type { ReservationStatus } from "@/modules/asset-reservation/types";

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

export type GuestRequestPaymentInstruction = {
  mode: "dp" | "settlement";
  modeLabel: "DP" | "Pelunasan";
  amountLabel: string;
  description: string;
  ctaLabel: string;
};

export type GuestRequestStatusResult = {
  requestTitle: string;
  ticketLabel: string;
  badgeLabel: string;
  variant: GuestRequestStatusVariant;
  status: ReservationStatus;
  statusDescription?: string;
  details: GuestRequestStatusDetails;
  rejectionReason?: string;
  paymentInstruction?: GuestRequestPaymentInstruction;
  onOpenUploadProof?: () => void;
};

type GuestRequestStatusFeatureProps = Readonly<{
  ticketValue: string;
  onTicketValueChange: (value: string) => void;
  contactValue: string;
  onContactValueChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  result?: GuestRequestStatusResult | null;
}>;

type StepTone = "done" | "active" | "pending" | "failed";

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

function stepTones(status: ReservationStatus): StepTone[] {
  switch (status) {
    case "pending_review":
      return ["done", "active", "pending", "pending"];
    case "awaiting_dp":
    case "awaiting_payment_verification":
    case "confirmed_dp":
    case "awaiting_settlement":
      return ["done", "done", "active", "pending"];
    case "confirmed_full":
      return ["done", "done", "done", "done"];
    case "cancelled":
    case "expired":
    case "rejected":
      return ["done", "done", "pending", "failed"];
    default:
      return ["done", "active", "pending", "pending"];
  }
}

function stepCircleClasses(tone: StepTone) {
  switch (tone) {
    case "done":
      return "bg-green-500 text-white";
    case "active":
      return "bg-brand-primary text-white";
    case "failed":
      return "bg-red-500 text-white";
    case "pending":
    default:
      return "bg-gray-200 dark:bg-gray-700 text-gray-500";
  }
}

function stepTitleClasses(tone: StepTone) {
  switch (tone) {
    case "done":
      return "text-green-600 dark:text-green-400";
    case "active":
      return "text-gray-900 dark:text-white";
    case "failed":
      return "text-red-600 dark:text-red-400";
    case "pending":
    default:
      return "text-gray-500 dark:text-gray-400";
  }
}

function paymentStepSubtitle(result: GuestRequestStatusResult) {
  if (result.status === "awaiting_payment_verification") {
    return "Bukti pembayaran sedang diverifikasi admin";
  }
  if (result.paymentInstruction) {
    return `Aksi sekarang: ${result.paymentInstruction.modeLabel}`;
  }
  if (result.status === "confirmed_full") {
    return "Pembayaran sudah lunas";
  }
  if (result.status === "confirmed_dp") {
    return "Tahap berikutnya: Pelunasan";
  }
  return "Belum ada aksi pembayaran";
}

export function GuestRequestStatusFeature({
  ticketValue,
  onTicketValueChange,
  contactValue,
  onContactValueChange,
  onSubmit,
  submitting,
  result,
}: GuestRequestStatusFeatureProps) {
  const status = result?.status ?? "pending_review";
  const tones = stepTones(status);

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
              <InputField
                id="ticket_number"
                label="Nomor Tiket Pengajuan"
                size="lg"
                startIcon={
                  <span className="material-icons-outlined text-xl">
                    confirmation_number
                  </span>
                }
                value={ticketValue}
                onValueChange={onTicketValueChange}
                placeholder="Masukkan Nomor Pengajuan (Contoh: #SQ-99210)"
              />
              <InputField
                id="contact_lookup"
                label="Kontak Pemohon (Nomor HP atau Email)"
                size="lg"
                startIcon={
                  <span className="material-icons-outlined text-xl">
                    person_search
                  </span>
                }
                value={contactValue}
                onValueChange={onContactValueChange}
                placeholder="Masukkan kontak yang dipakai saat pengajuan"
              />
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
              <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                    {result.statusDescription ? (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {result.statusDescription}
                      </p>
                    ) : null}
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

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                    Stepper Status
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Pengajuan",
                        subtitle: "Tiket sewa berhasil dibuat",
                        icon: "check",
                      },
                      {
                        title: "Review Admin",
                        subtitle:
                          status === "pending_review"
                            ? "Admin sedang meninjau pengajuan"
                            : "Review admin selesai",
                        icon: "manage_search",
                      },
                      {
                        title: "Pembayaran",
                        subtitle: paymentStepSubtitle(result),
                        icon: "payments",
                      },
                      {
                        title:
                          status === "rejected" ||
                          status === "cancelled" ||
                          status === "expired"
                            ? "Ditutup"
                            : "Selesai",
                        subtitle:
                          status === "confirmed_full"
                            ? "Reservasi terkonfirmasi penuh"
                            : status === "rejected"
                              ? "Pengajuan ditolak"
                              : status === "cancelled"
                                ? "Reservasi dibatalkan"
                                : status === "expired"
                                  ? "Reservasi kedaluwarsa"
                                  : "Menunggu penyelesaian",
                        icon:
                          status === "rejected" ||
                          status === "cancelled" ||
                          status === "expired"
                            ? "close"
                            : "flag",
                      },
                    ].map((step, idx) => {
                      const tone = tones[idx];
                      const icon = tone === "done" ? "check" : step.icon;
                      return (
                        <div
                          key={step.title}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${stepCircleClasses(tone)}`}
                          >
                            <span className="material-icons-outlined text-sm">
                              {icon}
                            </span>
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${stepTitleClasses(tone)}`}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {step.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {result.variant === "rejected" ? (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
                      Alasan Penolakan
                    </h4>
                    <p className="text-red-700 dark:text-red-200/80">
                      {result.rejectionReason || "Tidak ada alasan tambahan."}
                    </p>
                  </div>
                ) : null}

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
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
                </div>

                {result.paymentInstruction ? (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-white dark:bg-surface-card-dark text-brand-primary flex items-center justify-center">
                        <span className="material-icons-outlined text-sm">
                          payments
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Pembayaran yang perlu dilakukan:{" "}
                          {result.paymentInstruction.modeLabel}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {result.paymentInstruction.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-700 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Nominal {result.paymentInstruction.modeLabel}
                        </p>
                        <p className="text-2xl font-bold text-brand-primary">
                          {result.paymentInstruction.amountLabel}
                        </p>
                      </div>
                      <Button
                        type="button"
                        className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                        onClick={() => result.onOpenUploadProof?.()}
                        disabled={!result.onOpenUploadProof}
                      >
                        <span className="material-icons-outlined text-sm mr-1">
                          upload_file
                        </span>
                        {result.paymentInstruction.ctaLabel}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {result.status === "awaiting_payment_verification" ? (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
                    Bukti pembayaran Anda sudah diterima. Saat ini admin sedang
                    melakukan verifikasi. Tidak perlu mengunggah ulang kecuali
                    diminta.
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
