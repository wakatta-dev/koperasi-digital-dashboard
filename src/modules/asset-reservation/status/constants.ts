/** @format */

import type { ReservationStatus as ReservationStatusType } from "../types";

export type ReservationStatus = ReservationStatusType;

export const STATUS_CONTENT: Record<
  ReservationStatus,
  {
    badgeBg: string;
    border: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    text: string;
    summaryLabel: string;
    primaryCta?: string;
    primaryHref?: string;
    secondaryVariant?: "danger";
  }
> = {
  pending_review: {
    badgeBg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800/50",
    icon: "hourglass_top",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Menunggu Konfirmasi",
    text: "Permintaan Anda telah kami terima dan sedang ditinjau. Kami akan menghubungi Anda setelah disetujui atau jika perlu penyesuaian jadwal.",
    summaryLabel: "Total Estimasi",
    secondaryVariant: "danger",
  },
  awaiting_dp: {
    badgeBg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800/50",
    icon: "payments",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Menunggu Pembayaran DP",
    text: "Permintaan disetujui. Segera lunasi DP untuk mengamankan jadwal sewa Anda.",
    summaryLabel: "Total Tagihan",
    primaryCta: "Bayar DP Sekarang",
    primaryHref: "/penyewaan-aset/payment?type=dp",
    secondaryVariant: "danger",
  },
  awaiting_payment_verification: {
    badgeBg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-200 dark:border-orange-800/50",
    icon: "verified",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "Menunggu Verifikasi Pembayaran",
    text: "Bukti pembayaran Anda sudah diterima dan sedang diverifikasi admin BUMDes.",
    summaryLabel: "Status Pembayaran",
  },
  confirmed_dp: {
    badgeBg: "bg-indigo-50 dark:bg-indigo-900/10",
    border: "border-indigo-200 dark:border-indigo-800/50",
    icon: "receipt",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    title: "DP Terkonfirmasi",
    text: "DP sudah diterima. Silakan lunasi sisa tagihan selambatnya H-3 sebelum penggunaan.",
    summaryLabel: "Sisa Tagihan",
    primaryCta: "Lanjutkan Pelunasan",
    primaryHref: "/penyewaan-aset/payment?type=settlement",
  },
  awaiting_settlement: {
    badgeBg: "bg-indigo-50 dark:bg-indigo-900/10",
    border: "border-indigo-200 dark:border-indigo-800/50",
    icon: "receipt_long",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    title: "Menunggu Pelunasan",
    text: "DP sudah diterima. Pelunasan wajib dilakukan H-3 sebelum penggunaan fasilitas.",
    summaryLabel: "Sisa Tagihan",
    primaryCta: "Lunasi Sekarang",
    primaryHref: "/penyewaan-aset/payment?type=settlement",
    secondaryVariant: "danger",
  },
  confirmed_full: {
    badgeBg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-800/50",
    icon: "check_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Dikonfirmasi",
    text: "Pembayaran selesai. Reservasi Anda telah dikonfirmasi penuh.",
    summaryLabel: "Total Tagihan",
    secondaryVariant: "danger",
  },
  cancelled: {
    badgeBg: "bg-gray-50 dark:bg-gray-900/20",
    border: "border-gray-200 dark:border-gray-700",
    icon: "do_not_disturb_on",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-300",
    title: "Reservasi Dibatalkan",
    text: "Reservasi telah dibatalkan. Hubungi admin jika ingin mengajukan jadwal baru.",
    summaryLabel: "Status",
  },
  expired: {
    badgeBg: "bg-gray-50 dark:bg-gray-900/20",
    border: "border-gray-200 dark:border-gray-700",
    icon: "schedule",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-300",
    title: "Reservasi Kedaluwarsa",
    text: "Batas waktu pembayaran telah lewat. Ajukan kembali jika masih memerlukan jadwal ini.",
    summaryLabel: "Status",
  },
  rejected: {
    badgeBg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "block",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Permintaan Ditolak",
    text: "Permintaan sewa tidak dapat diproses. Anda bisa mengajukan kembali dengan jadwal atau aset berbeda.",
    summaryLabel: "Status",
  },
};
