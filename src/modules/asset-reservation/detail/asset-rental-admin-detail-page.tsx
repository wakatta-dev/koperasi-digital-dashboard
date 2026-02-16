/** @format */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Link2,
  MapPin,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { getAssetById } from "@/services/api/assets";
import {
  completeAssetBooking,
  getAssetRentalBookings,
  updateAssetBookingStatus,
} from "@/services/api/asset-rental";


type AssetRentalAdminDetailPageProps = Readonly<{
  bookingId: string;
  section: "penyewaan" | "pengajuan" | "pengembalian";
}>;

const backPathBySection: Record<
  AssetRentalAdminDetailPageProps["section"],
  string
> = {
  penyewaan: "/bumdes/asset/penyewaan",
  pengajuan: "/bumdes/asset/pengajuan-sewa",
  pengembalian: "/bumdes/asset/pengembalian",
};

function formatDateTime(unixSeconds?: number) {
  if (!unixSeconds) return "-";
  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount?: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function parseLocation(location?: string, description?: string) {
  if (location?.trim()) return location.trim();
  const text = (description ?? "").trim();
  if (!text) return "Lokasi belum diatur";
  const match = text.match(/Lokasi:\s*([^\n;]+)/i);
  return match?.[1]?.trim() || "Lokasi belum diatur";
}

function toStatusMeta(status?: string) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "PENDING_REVIEW") {
    return {
      label: "Menunggu",
      badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (normalized === "AWAITING_DP") {
    return {
      label: "Menunggu Pembayaran",
      badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (normalized === "REJECTED" || normalized === "CANCELLED") {
    return {
      label: "Ditolak",
      badgeClass: "border border-red-200 bg-red-50 text-red-700",
    };
  }
  if (normalized === "COMPLETED") {
    return {
      label: "Selesai",
      badgeClass: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }
  return {
    label: "Berjalan",
    badgeClass: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  };
}

function toReadableLabel(value?: string) {
  const normalized = (value ?? "").trim();
  if (!normalized) return "-";
  return normalized
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toReturnConditionLabel(value?: string, status?: string) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "baik" || normalized === "normal") return "Baik";
  if (normalized === "rusak") return "Rusak";
  if (normalized === "perbaikan") return "Perlu Perbaikan";
  if (normalized) return toReadableLabel(normalized);
  if ((status ?? "").toUpperCase() === "COMPLETED") return "Belum dicatat";
  return "-";
}

function isImageProofUrl(url?: string) {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"].some((ext) =>
    normalized.includes(ext)
  );
}

export function AssetRentalAdminDetailPage({
  bookingId,
  section,
}: AssetRentalAdminDetailPageProps) {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: QK.assetRental.bookings({ source: "asset-rental-detail", bookingId }),
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail penyewaan");
      }
      return response.data;
    },
  });

  const booking = useMemo(
    () => bookingsQuery.data?.find((item) => String(item.id) === bookingId) ?? null,
    [bookingsQuery.data, bookingId]
  );

  const assetQuery = useQuery({
    enabled: Boolean(booking?.asset_id),
    queryKey: QK.assetRental.detail(booking?.asset_id ?? "unknown"),
    queryFn: async () => {
      const response = await getAssetById(booking?.asset_id ?? "");
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail aset");
      }
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!booking) {
        throw new Error("Booking tidak ditemukan");
      }
      const response = await updateAssetBookingStatus(
        booking.id,
        status,
        status === "REJECTED" ? "Ditolak oleh admin" : undefined
      );
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui status booking");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["asset-rental", "bookings"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!booking) {
        throw new Error("Booking tidak ditemukan");
      }
      const response = await completeAssetBooking(booking.id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menyelesaikan penyewaan");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["asset-rental", "bookings"] });
    },
  });

  const statusMeta = toStatusMeta(booking?.status);
  const isBusy = updateStatusMutation.isPending || completeMutation.isPending;

  const canApprove = (booking?.status || "").toUpperCase() === "PENDING_REVIEW";
  const canReject = ["PENDING_REVIEW", "BOOKED"].includes(
    (booking?.status || "").toUpperCase()
  );
  const canComplete = ["AWAITING_SETTLEMENT", "CONFIRMED_FULL"].includes(
    (booking?.status || "").toUpperCase()
  );
  const latestPayment = booking?.latest_payment;
  const rejectionReason = booking?.rejection_reason?.trim() || "-";
  const returnConditionLabel = toReturnConditionLabel(
    booking?.return_condition,
    booking?.status
  );
  const returnConditionNotes = booking?.return_condition_notes?.trim() || "-";

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync("AWAITING_DP");
      showToastSuccess("Pengajuan disetujui", "Status booking berhasil diperbarui.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyetujui pengajuan";
      showToastError("Gagal menyetujui", message);
    }
  };

  const handleReject = async () => {
    try {
      await updateStatusMutation.mutateAsync("REJECTED");
      showToastSuccess("Pengajuan ditolak", "Status booking berhasil diperbarui.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menolak pengajuan";
      showToastError("Gagal menolak", message);
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync();
      showToastSuccess("Penyewaan diselesaikan", "Status booking telah ditandai selesai.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyelesaikan penyewaan";
      showToastError("Gagal menyelesaikan", message);
    }
  };

  const backPath = backPathBySection[section];

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Detail Penyewaan</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ringkasan transaksi penyewaan untuk ID {bookingId}
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 border-slate-200">
            <Link href={backPath}>
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>

        {bookingsQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Memuat detail penyewaan...
          </div>
        ) : null}

        {bookingsQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {(bookingsQuery.error as Error).message}
          </div>
        ) : null}

        {!bookingsQuery.isLoading && !bookingsQuery.isError && !booking ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-700">
            Detail penyewaan tidak ditemukan.
          </div>
        ) : null}

        {booking ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusMeta.badgeClass}>{statusMeta.label}</Badge>
              <span className="text-xs text-slate-500">Booking ID: {booking.id}</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Informasi Aset
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{booking.asset_name}</p>
                  <p className="text-sm text-slate-500">AST-{String(booking.asset_id).padStart(3, "0")}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-indigo-600" />
                    <span>{parseLocation(assetQuery.data?.location, assetQuery.data?.description)}</span>
                  </div>
                  <p>
                    Tarif: <span className="font-medium text-slate-900">{formatCurrency(assetQuery.data?.rate_amount)}</span>
                    <span className="text-slate-500">/{(assetQuery.data?.rate_type || "DAILY").toUpperCase() === "HOURLY" ? "jam" : "hari"}</span>
                  </p>
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Informasi Penyewa
                  </p>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-700">
                    <UserRound className="mt-0.5 h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-medium text-slate-900">{booking.renter_name || "-"}</p>
                      <p>{booking.renter_contact || "Kontak belum diisi"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tujuan</p>
                  <p className="mt-1 text-sm text-slate-700">{booking.purpose || "-"}</p>
                </div>
              </section>
            </div>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Jadwal & Nilai Transaksi
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Mulai</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(booking.start_time)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Selesai</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(booking.end_time)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(booking.total_amount)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canApprove ? (
                  <Button
                    type="button"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={handleApprove}
                    disabled={isBusy}
                  >
                    Setujui
                  </Button>
                ) : null}
                {canReject ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleReject}
                    disabled={isBusy}
                  >
                    Tolak
                  </Button>
                ) : null}
                {canComplete ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={handleComplete}
                    disabled={isBusy}
                  >
                    Tandai Selesai
                  </Button>
                ) : null}
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pembayaran & Verifikasi
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Bukti Pembayaran
                  </p>
                  {latestPayment?.proof_url ? (
                    <div className="space-y-3">
                      {isImageProofUrl(latestPayment.proof_url) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestPayment.proof_url}
                          alt={`Bukti pembayaran booking ${booking.id}`}
                          className="max-h-56 w-full rounded-md border border-slate-200 object-cover"
                        />
                      ) : null}
                      <Button asChild type="button" variant="outline" className="border-slate-300">
                        <a
                          href={latestPayment.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <Link2 className="h-4 w-4" />
                          Lihat Bukti Pembayaran
                        </a>
                      </Button>
                      <p className="text-xs text-slate-500">
                        Catatan: {latestPayment.proof_note?.trim() || "-"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Belum ada bukti pembayaran diunggah.</p>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Detail Pembayaran Terakhir
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <p>
                      ID Pembayaran: <span className="font-medium text-slate-900">{latestPayment?.id || "-"}</span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-slate-900">
                        {toReadableLabel(latestPayment?.status)}
                      </span>
                    </p>
                    <p>
                      Tipe: <span className="font-medium text-slate-900">{toReadableLabel(latestPayment?.type)}</span>
                    </p>
                    <p>
                      Metode:{" "}
                      <span className="font-medium text-slate-900">{toReadableLabel(latestPayment?.method)}</span>
                    </p>
                    <p>
                      Nominal:{" "}
                      <span className="font-medium text-slate-900">
                        {latestPayment ? formatCurrency(latestPayment.amount) : "-"}
                      </span>
                    </p>
                    <p>
                      Batas Bayar:{" "}
                      <span className="font-medium text-slate-900">
                        {formatDateTime(latestPayment?.pay_by)}
                      </span>
                    </p>
                    <p>
                      Update Pembayaran:{" "}
                      <span className="font-medium text-slate-900">
                        {formatDateTime(latestPayment?.updated_at)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Penolakan & Pengembalian
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Alasan Penolakan
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{rejectionReason}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kondisi Pengembalian
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{returnConditionLabel}</p>
                  <p className="mt-2 text-xs text-slate-500">Catatan: {returnConditionNotes}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Detail Audit
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    <p>Dibuat: {formatDateTime(booking.created_at || booking.start_time)}</p>
                    <p>Diperbarui: {formatDateTime(booking.updated_at || booking.completed_at)}</p>
                    <p>Selesai: {formatDateTime(booking.completed_at)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarClock className="h-4 w-4 text-indigo-600" />
                <span>
                  Penyewa: {booking.renter_name || "-"} • Kontak: {booking.renter_contact || "-"} • Email:{" "}
                  {booking.renter_email || "-"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
                <span>
                  Status saat ini: {statusMeta.label} • Pembayaran: {toReadableLabel(latestPayment?.status)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>
                  Catatan bukti pembayaran: {latestPayment?.proof_note?.trim() || "-"}
                </span>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </div>
  );
}
