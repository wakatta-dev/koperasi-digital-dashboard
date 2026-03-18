/** @format */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QK } from "@/hooks/queries/queryKeys";
import {
  ASSET_RENTAL_BOOKING_STATUS,
  resolveAssetRentalBookingStatus,
} from "@/lib/asset-rental-booking-status";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  getAssetById,
  registerAssetFixedAsset,
  updateAssetFixedAssetProfile,
} from "@/services/api/assets";
import {
  completeAssetBooking,
  getAssetRentalBookings,
  updateAssetBookingStatus,
} from "@/services/api/asset-rental";
import { finalizePayment, getReservation } from "@/services/api/reservations";

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

function toSentenceCase(value?: string | null) {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll("_", " ");
  if (!normalized) return "-";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
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
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.pendingReview) {
    return {
      label: "Menunggu",
      badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingDP) {
    return {
      label: "Menunggu Pembayaran",
      badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification) {
    return {
      label: "Menunggu Verifikasi Pembayaran",
      badgeClass: "border border-orange-200 bg-orange-50 text-orange-700",
    };
  }
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.confirmedDP) {
    return {
      label: "Menunggu Hari Pakai",
      badgeClass: "border border-indigo-200 bg-indigo-50 text-indigo-700",
    };
  }
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement) {
    return {
      label: "Menunggu Pelunasan",
      badgeClass: "border border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (
    normalized === ASSET_RENTAL_BOOKING_STATUS.rejected ||
    normalized === ASSET_RENTAL_BOOKING_STATUS.cancelled
  ) {
    return {
      label: "Ditolak",
      badgeClass: "border border-red-200 bg-red-50 text-red-700",
    };
  }
  if (normalized === ASSET_RENTAL_BOOKING_STATUS.completed) {
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
    normalized.includes(ext),
  );
}

function humanizeRentalEvent(event?: string) {
  const normalized = (event ?? "").trim();
  if (!normalized) return "Pembaruan Status";
  return normalized
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveRentalPaymentWorkspace(booking: any, reservation: any) {
  const paymentStatus = (
    reservation?.latest_payment?.status ||
    booking?.latest_payment?.status ||
    ""
  )
    .trim()
    .toLowerCase();

  if (paymentStatus === "pending_verification") {
    return {
      label: "Menunggu Verifikasi Pembayaran",
      helper:
        "Bukti pembayaran sudah diterima dan masih menunggu keputusan admin.",
      className: "border border-orange-200 bg-orange-50 text-orange-700",
    };
  }

  if (paymentStatus === "succeeded") {
    return {
      label: "Pembayaran Terkonfirmasi",
      helper:
        "Pembayaran terakhir sudah berhasil diverifikasi, tetapi penyewaan tetap perlu dilanjutkan melalui langkah operasional yang eksplisit.",
      className: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (paymentStatus === "failed" || paymentStatus === "expired") {
    return {
      label: "Pembayaran Bermasalah",
      helper:
        "Pembayaran terakhir gagal atau kedaluwarsa dan membutuhkan tindak lanjut.",
      className: "border border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    label: "Menunggu Pembayaran",
    helper: "Booking belum memiliki pembayaran yang tervalidasi.",
    className: "border border-amber-200 bg-amber-50 text-amber-700",
  };
}

function resolveRentalAccountingWorkspace(booking: any, reservation: any) {
  const readiness =
    reservation?.accounting_readiness || booking?.accounting_readiness;
  const readinessStatus = String(readiness?.status ?? "")
    .trim()
    .toLowerCase();

  if (readinessStatus === "not_applicable") {
    return {
      label: "Tidak Perlu Posting",
      helper:
        readiness?.reason ||
        "Booking dibatalkan atau ditolak sehingga tidak perlu diteruskan ke accounting.",
      className: "border border-slate-200 bg-slate-50 text-slate-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "problematic") {
    return {
      label: "Bermasalah",
      helper:
        readiness?.reason ||
        "Ada masalah pada pembayaran sehingga handoff accounting harus ditahan.",
      className: "border border-red-200 bg-red-50 text-red-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "not_ready") {
    return {
      label: "Belum Siap",
      helper:
        readiness?.reason ||
        "Accounting menunggu kepastian pembayaran atau status rental yang lebih lanjut.",
      className: "border border-amber-200 bg-amber-50 text-amber-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "ready") {
    return {
      label: "Siap Ditinjau",
      helper:
        readiness?.reason ||
        "Booking sudah cukup matang untuk diteruskan ke proses accounting berikutnya.",
      className: "border border-indigo-200 bg-indigo-50 text-indigo-700",
      reference: readiness?.reference || null,
    };
  }

  const bookingStatus = (
    booking?.booking_state ||
    booking?.status ||
    ""
  )
    .trim()
    .toUpperCase();
  const paymentStatus = (
    reservation?.payment_state ||
    booking?.payment_state ||
    reservation?.latest_payment?.status ||
    booking?.latest_payment?.status ||
    ""
  )
    .trim()
    .toLowerCase();

  if (bookingStatus === "REJECTED" || bookingStatus === "CANCELLED") {
    return {
      label: "Tidak Perlu Posting",
      helper:
        "Booking dibatalkan atau ditolak sehingga tidak perlu diteruskan ke accounting.",
      className: "border border-slate-200 bg-slate-50 text-slate-700",
      reference: null,
    };
  }

  if (paymentStatus === "failed" || paymentStatus === "expired") {
    return {
      label: "Bermasalah",
      helper:
        "Ada masalah pada pembayaran sehingga handoff accounting harus ditahan.",
      className: "border border-red-200 bg-red-50 text-red-700",
      reference: null,
    };
  }

  if (
    [
      "PENDING_REVIEW",
      "AWAITING_DP",
      "AWAITING_PAYMENT_VERIFICATION",
      "AWAITING_SETTLEMENT",
    ].includes(bookingStatus)
  ) {
    return {
      label: "Belum Siap",
      helper:
        "Accounting menunggu kepastian pembayaran atau status rental yang lebih lanjut.",
      className: "border border-amber-200 bg-amber-50 text-amber-700",
      reference: null,
    };
  }

  return {
    label: "Siap Ditinjau",
    helper:
      "Booking sudah cukup matang untuk diteruskan ke proses accounting berikutnya.",
    className: "border border-indigo-200 bg-indigo-50 text-indigo-700",
    reference: null,
  };
}

export function AssetRentalAdminDetailPage({
  bookingId,
  section,
}: AssetRentalAdminDetailPageProps) {
  const queryClient = useQueryClient();
  const [paymentDecisionNote, setPaymentDecisionNote] = useState("");
  const [paymentDecisionError, setPaymentDecisionError] = useState<
    string | null
  >(null);
  const [fixedAssetCategory, setFixedAssetCategory] = useState("");
  const [fixedAssetRecognitionDate, setFixedAssetRecognitionDate] =
    useState("");
  const [depreciationMethod, setDepreciationMethod] = useState("");
  const [usefulLifeMonths, setUsefulLifeMonths] = useState("");
  const [residualValue, setResidualValue] = useState("");
  const [maintenanceClassification, setMaintenanceClassification] =
    useState("");
  const [maintenanceNotes, setMaintenanceNotes] = useState("");

  const bookingsQuery = useQuery({
    queryKey: QK.assetRental.bookings({
      source: "asset-rental-detail",
      bookingId,
    }),
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail penyewaan");
      }
      return response.data;
    },
  });

  const booking = useMemo(
    () =>
      bookingsQuery.data?.find((item) => String(item.id) === bookingId) ?? null,
    [bookingsQuery.data, bookingId],
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

  const reservationDetailQuery = useQuery({
    enabled: Boolean(booking?.id),
    queryKey: QK.assetRental.reservation(`admin:${booking?.id ?? "unknown"}`),
    queryFn: async () => {
      const response = await getReservation(booking?.id ?? "");
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail reservasi");
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
        status === "REJECTED" ? "Ditolak oleh admin" : undefined,
      );
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui status booking");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "bookings"],
      });
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
      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "bookings"],
      });
    },
  });

  const paymentDecisionMutation = useMutation({
    mutationFn: async ({
      status,
      reason,
    }: {
      status: "succeeded" | "failed";
      reason?: string;
    }) => {
      const paymentID = booking?.latest_payment?.id?.trim();
      if (!paymentID) {
        throw new Error("Pembayaran belum tersedia");
      }
      const response = await finalizePayment(paymentID, status, reason);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memverifikasi pembayaran");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "bookings"],
      });
    },
  });

  const fixedAssetRegisterMutation = useMutation({
    mutationFn: async ({
      assetId,
      fixedAssetCategory,
      recognitionDate,
    }: {
      assetId: string | number;
      fixedAssetCategory: string;
      recognitionDate: string;
    }) => {
      const response = await registerAssetFixedAsset(assetId, {
        fixed_asset_category: fixedAssetCategory,
        recognition_date: recognitionDate,
      });
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Gagal memasukkan aset ke register fixed asset",
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QK.assetRental.detail(booking?.asset_id ?? "unknown"),
      });
    },
  });

  const fixedAssetProfileMutation = useMutation({
    mutationFn: async ({
      assetId,
      depreciationMethod,
      usefulLifeMonths,
      residualValue,
      maintenanceClassification,
      maintenanceNotes,
    }: {
      assetId: string | number;
      depreciationMethod: string;
      usefulLifeMonths: number;
      residualValue?: number;
      maintenanceClassification: string;
      maintenanceNotes?: string;
    }) => {
      const response = await updateAssetFixedAssetProfile(assetId, {
        depreciation_method: depreciationMethod,
        useful_life_months: usefulLifeMonths,
        residual_value: residualValue,
        maintenance_classification: maintenanceClassification,
        maintenance_notes: maintenanceNotes,
      });
      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Gagal menyimpan profile depresiasi dan maintenance",
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QK.assetRental.detail(booking?.asset_id ?? "unknown"),
      });
    },
  });

  const resolvedBookingStatus = resolveAssetRentalBookingStatus(
    booking ?? undefined,
  );
  const statusMeta = toStatusMeta(resolvedBookingStatus);
  const paymentWorkspace = resolveRentalPaymentWorkspace(
    booking,
    reservationDetailQuery.data,
  );
  const accountingWorkspace = resolveRentalAccountingWorkspace(
    booking,
    reservationDetailQuery.data,
  );
  const paymentClassifications =
    reservationDetailQuery.data?.payment_classifications ??
    booking?.payment_classifications ??
    [];
  const financialResolutions =
    reservationDetailQuery.data?.financial_resolutions ??
    booking?.financial_resolutions ??
    [];
  const fixedAssetRegister = assetQuery.data?.fixed_asset_register;
  const fixedAssetCategoryValue =
    fixedAssetCategory.trim() ||
    fixedAssetRegister?.fixed_asset_category ||
    assetQuery.data?.category ||
    "";
  const fixedAssetRecognitionDateValue =
    fixedAssetRecognitionDate ||
    fixedAssetRegister?.recognition_date ||
    assetQuery.data?.purchase_date ||
    new Date().toISOString().slice(0, 10);
  const depreciationMethodValue =
    depreciationMethod || fixedAssetRegister?.depreciation_method || "";
  const usefulLifeMonthsValue =
    usefulLifeMonths ||
    String(fixedAssetRegister?.useful_life_months ?? "");
  const residualValueValue =
    residualValue ||
    String(fixedAssetRegister?.residual_value ?? "");
  const maintenanceClassificationValue =
    maintenanceClassification ||
    fixedAssetRegister?.maintenance_classification ||
    "";
  const maintenanceNotesValue =
    maintenanceNotes || fixedAssetRegister?.maintenance_notes || "";
  const isBusy =
    updateStatusMutation.isPending ||
    completeMutation.isPending ||
    paymentDecisionMutation.isPending ||
    fixedAssetRegisterMutation.isPending ||
    fixedAssetProfileMutation.isPending;

  const canApprove =
    (booking?.booking_state || booking?.status || "").toUpperCase() ===
    "PENDING_REVIEW";
  const canReject = ["PENDING_REVIEW", "BOOKED"].includes(
    (booking?.booking_state || booking?.status || "").toUpperCase(),
  );
  const canComplete = ["CONFIRMED_FULL"].includes(
    (booking?.booking_state || booking?.status || "").toUpperCase(),
  );
  const latestPayment = booking?.latest_payment;
  const latestPaymentStatus = (latestPayment?.status || "")
    .trim()
    .toLowerCase();
  const canConfirmPayment = latestPaymentStatus === "pending_verification";
  const rentalPaymentDecisionMeta = canConfirmPayment
    ? {
        title: "Menunggu Keputusan Admin",
        helper:
          "Bukti pembayaran sudah masuk. Keputusan pembayaran akan memperbarui domain payment terlebih dahulu sebelum lifecycle rental berlanjut.",
      }
    : {
        title: "Tidak Ada Keputusan Tertunda",
        helper:
          "Tidak ada bukti pembayaran yang sedang menunggu verifikasi pada transaksi ini.",
      };
  const rejectionReason = booking?.rejection_reason?.trim() || "-";
  const returnConditionLabel = toReturnConditionLabel(
    booking?.return_condition,
    booking?.booking_state || booking?.status,
  );
  const returnConditionNotes = booking?.return_condition_notes?.trim() || "-";
  const nextValidAction = canConfirmPayment
    ? {
        label: "Tinjau Pembayaran",
        helper:
          "Pembayaran sedang menunggu verifikasi admin sebelum status rental berubah.",
      }
    : resolvedBookingStatus === ASSET_RENTAL_BOOKING_STATUS.confirmedDP
      ? {
          label: "Pantau Menuju Hari Pakai",
          helper:
            "Pembayaran DP sudah diputuskan. Booking belum selesai dan harus dipantau sampai tahap operasional berikutnya.",
        }
      : resolvedBookingStatus === ASSET_RENTAL_BOOKING_STATUS.confirmedFull
        ? {
            label: "Tandai Selesai",
            helper:
              "Pembayaran sudah lengkap, tetapi penyewaan baru dianggap selesai setelah penutupan operasional dilakukan secara eksplisit.",
          }
        : canApprove
          ? {
              label: "Setujui Pengajuan",
              helper:
                "Booking masih menunggu keputusan admin sebelum masuk ke tahap pembayaran.",
            }
          : canComplete
            ? {
                label: "Tandai Selesai",
                helper:
                  "Penyewaan sudah siap ditutup setelah penggunaan dan pengembalian selesai.",
              }
            : canReject
              ? {
                  label: "Tolak Pengajuan",
                  helper:
                    "Pengajuan masih dapat ditolak dengan alasan yang sesuai.",
                }
              : {
                  label: "Tidak Ada Aksi Lanjutan",
                  helper:
                    "Booking sudah berada pada status terminal atau tidak memiliki tindakan operasional berikutnya.",
                };
  const timelineItems = useMemo(() => {
    if (reservationDetailQuery.data?.timeline?.length) {
      return reservationDetailQuery.data.timeline.map((item, index, arr) => ({
        id: `${item.event}-${item.at}-${index}`,
        title: humanizeRentalEvent(item.event || item.meta?.status),
        description:
          item.meta?.description ||
          (item.meta?.status
            ? `Status: ${humanizeRentalEvent(item.meta.status)}`
            : "Pembaruan status reservasi"),
        time: new Date(item.at).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        active: index === arr.length - 1,
      }));
    }

    const fallback = [];
    if (booking?.created_at || booking?.start_time) {
      fallback.push({
        id: "booking-created",
        title: "Pengajuan Reservasi Dibuat",
        description: `Status: ${statusMeta.label}`,
        time: formatDateTime(booking.created_at || booking.start_time),
        active: !booking?.completed_at,
      });
    }
    if (booking?.completed_at) {
      fallback.push({
        id: "booking-completed",
        title: "Penyewaan Selesai",
        description: "Booking ditandai selesai pada sistem operasional.",
        time: formatDateTime(booking.completed_at),
        active: true,
      });
    }
    return fallback;
  }, [booking, reservationDetailQuery.data, statusMeta.label]);

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync("AWAITING_DP");
      showToastSuccess(
        "Pengajuan disetujui",
        "Status booking berhasil diperbarui.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyetujui pengajuan";
      showToastError("Gagal menyetujui", message);
    }
  };

  const handleReject = async () => {
    try {
      await updateStatusMutation.mutateAsync("REJECTED");
      showToastSuccess(
        "Pengajuan ditolak",
        "Status booking berhasil diperbarui.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menolak pengajuan";
      showToastError("Gagal menolak", message);
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync();
      showToastSuccess(
        "Penyewaan diselesaikan",
        "Status booking telah ditandai selesai.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyelesaikan penyewaan";
      showToastError("Gagal menyelesaikan", message);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await paymentDecisionMutation.mutateAsync({
        status: "succeeded",
        reason: paymentDecisionNote.trim() || undefined,
      });
      setPaymentDecisionNote("");
      setPaymentDecisionError(null);
      showToastSuccess(
        "Pembayaran terkonfirmasi",
        "Status pembayaran diperbarui. Lanjutkan proses operasional rental secara eksplisit.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengonfirmasi pembayaran";
      showToastError("Gagal konfirmasi pembayaran", message);
    }
  };

  const handleRejectPayment = async () => {
    if (paymentDecisionNote.trim().length === 0) {
      setPaymentDecisionError(
        "Catatan keputusan wajib diisi saat pembayaran ditolak.",
      );
      return;
    }
    try {
      await paymentDecisionMutation.mutateAsync({
        status: "failed",
        reason: paymentDecisionNote.trim(),
      });
      setPaymentDecisionNote("");
      setPaymentDecisionError(null);
      showToastSuccess(
        "Pembayaran ditolak",
        "Penyewa dapat mengunggah ulang bukti pembayaran.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menolak pembayaran";
      showToastError("Gagal menolak pembayaran", message);
    }
  };

  const handleRegisterFixedAsset = async () => {
    if (!booking?.asset_id) {
      showToastError("Aset tidak ditemukan", "Detail aset rental belum siap.");
      return;
    }
    try {
      await fixedAssetRegisterMutation.mutateAsync({
        assetId: booking.asset_id,
        fixedAssetCategory: fixedAssetCategoryValue,
        recognitionDate: fixedAssetRecognitionDateValue,
      });
      showToastSuccess(
        "Aset tetap diperbarui",
        "Register fixed asset sekarang terhubung ke aset rental ini.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui register fixed asset";
      showToastError("Gagal register fixed asset", message);
    }
  };

  const handleSaveFixedAssetProfile = async () => {
    if (!booking?.asset_id) {
      showToastError("Aset tidak ditemukan", "Detail aset rental belum siap.");
      return;
    }
    try {
      await fixedAssetProfileMutation.mutateAsync({
        assetId: booking.asset_id,
        depreciationMethod: depreciationMethodValue,
        usefulLifeMonths: Number(usefulLifeMonthsValue),
        residualValue: residualValueValue ? Number(residualValueValue) : undefined,
        maintenanceClassification: maintenanceClassificationValue,
        maintenanceNotes: maintenanceNotesValue,
      });
      showToastSuccess(
        "Profile fixed asset diperbarui",
        "Dasar depresiasi dan klasifikasi maintenance tersimpan di audit trail.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan profile fixed asset";
      showToastError("Gagal simpan profile", message);
    }
  };

  const backPath = backPathBySection[section];

  return (
    <div
      className="mx-auto max-w-7xl space-y-6 text-foreground"
      data-testid="asset-rental-admin-detail-page-root"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Detail Penyewaan
            </h3>
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
              <Badge
                className={statusMeta.badgeClass}
                data-testid="asset-rental-admin-detail-status-badge"
              >
                {statusMeta.label}
              </Badge>
              <span className="text-xs text-slate-500">
                Booking ID: {booking.id}
              </span>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Workspace Transaksi Rental
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    Booking #{String(booking.id).padStart(5, "0")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Terakhir diperbarui{" "}
                    {formatDateTime(booking.updated_at || booking.created_at)}
                  </p>
                </div>
                <div className="rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">
                  Lifecycle Rental
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status Operasional
                  </p>
                  <Badge className={`mt-2 ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </Badge>
                  <p className="mt-3 text-sm text-slate-600">
                    Status operasional rental mengikuti lifecycle booking aset
                    secara internal.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status Pembayaran
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${paymentWorkspace.className}`}
                  >
                    {paymentWorkspace.label}
                  </span>
                  <p className="mt-3 text-sm text-slate-600">
                    {paymentWorkspace.helper}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status Accounting
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${accountingWorkspace.className}`}
                  >
                    {accountingWorkspace.label}
                  </span>
                  <p className="mt-3 text-sm text-slate-600">
                    {accountingWorkspace.helper}
                  </p>
                  {accountingWorkspace.reference ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Referensi Accounting:{" "}
                      <span className="font-medium text-slate-900">
                        {accountingWorkspace.reference}
                      </span>
                    </p>
                  ) : null}
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tindakan Berikutnya
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {nextValidAction.label}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {nextValidAction.helper}
                  </p>
                </div>
              </div>
              {paymentClassifications.length > 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Klasifikasi Pembayaran Finance
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      DP, deposit, dan revenue recognition ditampilkan terpisah
                      agar tidak mencampur uang jaminan dengan pendapatan jasa.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {paymentClassifications.map((item) => (
                      <div
                        key={`${item.classification_type}-${item.accounting_reference ?? item.amount}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {toSentenceCase(item.classification_type)}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">
                          {item.reason || "Belum ada alasan klasifikasi."}
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          <p>
                            Event:{" "}
                            <span className="font-medium text-slate-900">
                              {item.accounting_event_key || "-"}
                            </span>
                          </p>
                          <p>
                            Reference:{" "}
                            <span className="font-medium text-slate-900">
                              {item.accounting_reference ||
                                item.follow_up_reference ||
                                "-"}
                            </span>
                          </p>
                          <p>
                            Evidence:{" "}
                            <span className="font-medium text-slate-900">
                              {item.evidence_reference || "-"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {financialResolutions.length > 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resolution Finance Rental
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Damage charge, penalty, dan keputusan penggunaan/refund
                      deposit ditampilkan terpisah dari lifecycle operasional
                      pengembalian.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {financialResolutions.map((item) => (
                      <div
                        key={`${item.outcome_type}-${item.accounting_reference ?? item.amount}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {toSentenceCase(item.outcome_type)}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">
                          {item.reason || "Belum ada alasan resolution."}
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          <p>
                            Event:{" "}
                            <span className="font-medium text-slate-900">
                              {item.accounting_event_key || "-"}
                            </span>
                          </p>
                          <p>
                            Reference:{" "}
                            <span className="font-medium text-slate-900">
                              {item.accounting_reference ||
                                item.follow_up_reference ||
                                "-"}
                            </span>
                          </p>
                          <p>
                            Evidence:{" "}
                            <span className="font-medium text-slate-900">
                              {item.evidence_reference || "-"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Informasi Aset
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {booking.asset_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    AST-{String(booking.asset_id).padStart(3, "0")}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-indigo-600" />
                    <span>
                      {parseLocation(
                        assetQuery.data?.location,
                        assetQuery.data?.description,
                      )}
                    </span>
                  </div>
                  <p>
                    Tarif:{" "}
                    <span className="font-medium text-slate-900">
                      {formatCurrency(assetQuery.data?.rate_amount)}
                    </span>
                    <span className="text-slate-500">
                      /
                      {(assetQuery.data?.rate_type || "DAILY").toUpperCase() ===
                      "HOURLY"
                        ? "jam"
                        : "hari"}
                    </span>
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
                      <p className="font-medium text-slate-900">
                        {booking.renter_name || "-"}
                      </p>
                      <p>{booking.renter_contact || "Kontak belum diisi"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tujuan
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {booking.purpose || "-"}
                  </p>
                </div>
              </section>
            </div>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Register Aset Tetap
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Konteks fixed asset untuk aset rental yang memenuhi kriteria
                    pencatatan jangka panjang.
                  </p>
                </div>
                <Badge className="border border-slate-200 bg-slate-50 text-slate-700">
                  {fixedAssetRegister
                    ? toSentenceCase(fixedAssetRegister.status)
                    : "Operational Only"}
                </Badge>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="fixed-asset-category"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Kategori Fixed Asset
                      </label>
                      <Input
                        id="fixed-asset-category"
                        value={fixedAssetCategoryValue}
                        onChange={(event) =>
                          setFixedAssetCategory(event.target.value)
                        }
                        placeholder="Contoh: Bangunan Operasional"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="fixed-asset-recognition-date"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Tanggal Pengakuan
                      </label>
                      <Input
                        id="fixed-asset-recognition-date"
                        type="date"
                        value={fixedAssetRecognitionDateValue}
                        onChange={(event) =>
                          setFixedAssetRecognitionDate(event.target.value)
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Register ini tetap terhubung ke identitas aset rental dan
                    tidak mengubah lifecycle penyewaan.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={handleRegisterFixedAsset}
                    disabled={isBusy || !fixedAssetCategoryValue || !fixedAssetRecognitionDateValue}
                  >
                    {fixedAssetRegister
                      ? "Perbarui Register Aset Tetap"
                      : "Masukkan ke Register Aset Tetap"}
                  </Button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      Status Keterkaitan:{" "}
                      <span className="font-medium text-slate-900">
                        {toSentenceCase(
                          fixedAssetRegister?.rental_linkage_status ||
                            "linked_rental_asset",
                        )}
                      </span>
                    </p>
                    <p>
                      Referensi Fixed Asset:{" "}
                      <span className="font-medium text-slate-900">
                        {fixedAssetRegister?.fixed_asset_reference || "-"}
                      </span>
                    </p>
                    <p>
                      Referensi Aset Sumber:{" "}
                      <span className="font-medium text-slate-900">
                        {fixedAssetRegister?.source_asset_reference ||
                          `AST-${String(booking.asset_id).padStart(6, "0")}`}
                      </span>
                    </p>
                    <p>
                      Identitas Aset:{" "}
                      <span className="font-medium text-slate-900">
                        {assetQuery.data?.name || booking.asset_name}
                      </span>
                    </p>
                    <p>
                      Harga Perolehan:{" "}
                      <span className="font-medium text-slate-900">
                        {formatCurrency(assetQuery.data?.purchase_price)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="depreciation-method"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Metode Depresiasi
                      </label>
                      <Input
                        id="depreciation-method"
                        value={depreciationMethodValue}
                        onChange={(event) =>
                          setDepreciationMethod(event.target.value)
                        }
                        placeholder="STRAIGHT_LINE"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="useful-life-months"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Umur Manfaat (Bulan)
                      </label>
                      <Input
                        id="useful-life-months"
                        type="number"
                        min="1"
                        value={usefulLifeMonthsValue}
                        onChange={(event) =>
                          setUsefulLifeMonths(event.target.value)
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="residual-value"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Nilai Residu
                      </label>
                      <Input
                        id="residual-value"
                        type="number"
                        min="0"
                        value={residualValueValue}
                        onChange={(event) => setResidualValue(event.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="maintenance-classification"
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Klasifikasi Maintenance
                      </label>
                      <Input
                        id="maintenance-classification"
                        value={maintenanceClassificationValue}
                        onChange={(event) =>
                          setMaintenanceClassification(event.target.value)
                        }
                        placeholder="PREVENTIVE"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="maintenance-notes"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Catatan Maintenance
                    </label>
                    <Textarea
                      id="maintenance-notes"
                      value={maintenanceNotesValue}
                      onChange={(event) =>
                        setMaintenanceNotes(event.target.value)
                      }
                      placeholder="Contoh: inspeksi struktural per kuartal."
                      className="mt-2 min-h-[96px]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={handleSaveFixedAssetProfile}
                    disabled={
                      isBusy ||
                      !fixedAssetRegister ||
                      !depreciationMethodValue ||
                      !usefulLifeMonthsValue ||
                      !maintenanceClassificationValue
                    }
                  >
                    Simpan Profile Depresiasi & Maintenance
                  </Button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      Metode Depresiasi:{" "}
                      <span className="font-medium text-slate-900">
                        {toSentenceCase(
                          fixedAssetRegister?.depreciation_method || "-",
                        )}
                      </span>
                    </p>
                    <p>
                      Umur Manfaat:{" "}
                      <span className="font-medium text-slate-900">
                        {fixedAssetRegister?.useful_life_months
                          ? `${fixedAssetRegister.useful_life_months} bulan`
                          : "-"}
                      </span>
                    </p>
                    <p>
                      Nilai Residu:{" "}
                      <span className="font-medium text-slate-900">
                        {fixedAssetRegister?.residual_value !== undefined
                          ? formatCurrency(fixedAssetRegister.residual_value)
                          : "-"}
                      </span>
                    </p>
                    <p>
                      Maintenance:{" "}
                      <span className="font-medium text-slate-900">
                        {toSentenceCase(
                          fixedAssetRegister?.maintenance_classification || "-",
                        )}
                      </span>
                    </p>
                    <p>
                      Catatan:{" "}
                      <span className="font-medium text-slate-900">
                        {fixedAssetRegister?.maintenance_notes || "-"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Jadwal & Nilai Transaksi
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Mulai</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDateTime(booking.start_time)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Selesai</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDateTime(booking.end_time)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCurrency(booking.total_amount)}
                  </p>
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
                    data-testid="asset-rental-admin-detail-complete-return-button"
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
                        <img
                          src={latestPayment.proof_url}
                          alt={`Bukti pembayaran booking ${booking.id}`}
                          className="max-h-56 w-full rounded-md border border-slate-200 object-cover"
                        />
                      ) : null}
                      <Button
                        asChild
                        type="button"
                        variant="outline"
                        className="border-slate-300"
                      >
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
                    <p className="text-sm text-slate-500">
                      Belum ada bukti pembayaran diunggah.
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Detail Pembayaran Terakhir
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <p>
                      ID Pembayaran:{" "}
                      <span className="font-medium text-slate-900">
                        {latestPayment?.id || "-"}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-slate-900">
                        {toReadableLabel(latestPayment?.status)}
                      </span>
                    </p>
                    <p>
                      Tipe:{" "}
                      <span className="font-medium text-slate-900">
                        {toReadableLabel(latestPayment?.type)}
                      </span>
                    </p>
                    <p>
                      Metode:{" "}
                      <span className="font-medium text-slate-900">
                        {toReadableLabel(latestPayment?.method)}
                      </span>
                    </p>
                    <p>
                      Nominal:{" "}
                      <span className="font-medium text-slate-900">
                        {latestPayment
                          ? formatCurrency(latestPayment.amount)
                          : "-"}
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
                  <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Keputusan Pembayaran
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {rentalPaymentDecisionMeta.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {rentalPaymentDecisionMeta.helper}
                    </p>
                  </div>
                  {canConfirmPayment ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Catatan Keputusan
                        </p>
                          <Textarea
                            className="mt-2 min-h-[96px] border-slate-200 bg-white"
                            placeholder="Tambahkan catatan keputusan untuk kebutuhan audit dan tindak lanjut internal..."
                            value={paymentDecisionNote}
                            data-testid="asset-rental-admin-detail-payment-decision-note-textarea"
                            aria-invalid={Boolean(paymentDecisionError)}
                          onChange={(event) => {
                            setPaymentDecisionNote(event.target.value);
                            if (paymentDecisionError) {
                              setPaymentDecisionError(null);
                            }
                          }}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Catatan wajib saat pembayaran ditolak, dan disarankan
                          saat pembayaran dikonfirmasi.
                        </p>
                        {paymentDecisionError ? (
                          <p className="mt-2 text-xs text-red-600">
                            {paymentDecisionError}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={handleConfirmPayment}
                          disabled={isBusy}
                          data-testid="asset-rental-admin-detail-verify-payment-button"
                        >
                          Konfirmasi Pembayaran
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={handleRejectPayment}
                          disabled={isBusy}
                          data-testid="asset-rental-admin-detail-reject-payment-button"
                        >
                          Tolak Pembayaran
                        </Button>
                      </div>
                    </div>
                  ) : null}
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
                  <p className="mt-2 text-sm text-slate-700">
                    {rejectionReason}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kondisi Pengembalian
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {returnConditionLabel}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Catatan: {returnConditionNotes}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Detail Audit
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    <p>
                      Dibuat:{" "}
                      {formatDateTime(booking.created_at || booking.start_time)}
                    </p>
                    <p>
                      Diperbarui:{" "}
                      {formatDateTime(
                        booking.updated_at || booking.completed_at,
                      )}
                    </p>
                    <p>Selesai: {formatDateTime(booking.completed_at)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Riwayat Status Internal
              </p>
              <div className="mt-4 space-y-4">
                {reservationDetailQuery.isLoading ? (
                  <p className="text-sm text-slate-500">
                    Memuat riwayat status...
                  </p>
                ) : timelineItems.length > 0 ? (
                  timelineItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.description}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">{item.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Belum ada riwayat status untuk transaksi rental ini.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarClock className="h-4 w-4 text-indigo-600" />
                <span>
                  Penyewa: {booking.renter_name || "-"} • Kontak:{" "}
                  {booking.renter_contact || "-"} • Email:{" "}
                  {booking.renter_email || "-"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
                <span>
                  Status saat ini: {statusMeta.label} • Pembayaran:{" "}
                  {toReadableLabel(latestPayment?.status)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>
                  Catatan bukti pembayaran:{" "}
                  {latestPayment?.proof_note?.trim() || "-"}
                </span>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </div>
  );
}
