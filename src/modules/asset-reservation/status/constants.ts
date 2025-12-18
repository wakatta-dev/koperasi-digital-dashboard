/** @format */

import type { AssetItem } from "../types";
import { DETAIL_ASSET, type FacilityItem } from "../detail/constants";
import { ASSET_ITEMS } from "../constants";

export type ReservationStatus = "pending" | "confirmed";

export const REQUEST_INFO = {
  id: "#REQ-ASSET-20231024-001",
  submittedAt: "Diajukan pada 24 Okt 2024",
  renterName: "Budi Santoso",
  renterContact: "0812-3456-7890",
  dateRange: {
    start: "28 Okt 2024",
    end: "30 Okt 2024",
    duration: "2 Hari",
  },
  purpose: "Resepsi Pernikahan anak pertama dengan estimasi tamu 300 orang.",
  costs: {
    rentalLabel: "Sewa 2 Hari",
    rentalTotal: "Rp700.000",
    cleaning: "Rp50.000",
    total: "Rp750.000",
  },
};

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
    secondaryVariant?: "danger";
  }
> = {
  pending: {
    badgeBg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800/50",
    icon: "hourglass_top",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Menunggu Konfirmasi",
    text: "Permintaan Anda telah kami terima dan sedang ditinjau oleh tim manajemen kami. Kami akan menghubungi Anda segera setelah ketersediaan dikonfirmasi.",
    summaryLabel: "Total Estimasi",
    secondaryVariant: "danger",
  },
  confirmed: {
    badgeBg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-800/50",
    icon: "check_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Dikonfirmasi",
    text: "Permintaan sewa Anda telah dikonfirmasi! Silakan lanjutkan ke pembayaran untuk mengamankan reservasi Anda.",
    summaryLabel: "Total Tagihan",
    primaryCta: "Lanjutkan Pembayaran",
    secondaryVariant: "danger",
  },
};

export const STATUS_ASSET = {
  ...DETAIL_ASSET,
};

export const STATUS_RECOMMENDATIONS: AssetItem[] = ASSET_ITEMS.slice(1, 4);

export const STATUS_FACILITIES: FacilityItem[] = DETAIL_ASSET.facilities;
