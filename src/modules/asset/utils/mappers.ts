/** @format */

import type { AssetRentalAsset, AssetRentalBooking } from "@/types/api/asset-rental";
import type { AssetItem, AssetSchedule } from "../types";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const placeholderImage =
  "https://images.unsplash.com/photo-1560525823-5dff3307e257?auto=format&fit=crop&w=600&q=80";

export function mapAssetToItem(asset: AssetRentalAsset): AssetItem {
  const rateType = (asset.rate_type || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const price = currencyFormatter.format(asset.rate_amount ?? 0);
  return {
    id: String(asset.id),
    title: asset.name,
    price,
    unit,
    image: asset.photo_url || placeholderImage,
    alt: asset.name || "Aset sewa",
    status: asset.status,
    rateType: asset.rate_type,
    rateAmount: asset.rate_amount,
    description: asset.description,
  };
}

export function mapBookingToSchedule(booking: AssetRentalBooking): AssetSchedule {
  const startDate = new Date(booking.start_time * 1000);
  const endDate = new Date(booking.end_time * 1000);
  const durationLabel = formatDuration(startDate, endDate, booking.status);
  const normalized = (booking.status || "").toUpperCase();
  const statusMap: Record<string, AssetSchedule["status"]> = {
    PENDING_REVIEW: "Pending",
    AWAITING_DP: "Menunggu Pembayaran",
    CONFIRMED_DP: "Dipesan",
    AWAITING_SETTLEMENT: "Berlangsung",
    CONFIRMED_FULL: "Confirmed",
    BOOKED: "Dipesan",
    COMPLETED: "Selesai",
    CANCELLED: "Cancelled",
    REJECTED: "Cancelled",
  };
  const status = statusMap[normalized] || ("Dipesan" as const);
  const faded = normalized === "COMPLETED" || normalized === "CONFIRMED_FULL";

  return {
    id: String(booking.id),
    assetName: booking.asset_name,
    assetId: String(booking.asset_id),
    renterCompany: booking.purpose || booking.renter_contact || "-",
    renterName: booking.renter_name,
    start: dateFormatter.format(startDate),
    end: dateFormatter.format(endDate),
    duration: durationLabel,
    backendStatus: booking.status,
    status,
    price: currencyFormatter.format(booking.total_amount ?? 0),
    thumbnail: placeholderImage,
    faded,
  };
}

function formatDuration(start: Date, end: Date, status?: string): string {
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "-";
  }
  if (status?.toUpperCase() === "COMPLETED") {
    return "Selesai";
  }
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) {
    return "1 Hari";
  }
  return `${diffDays} Hari`;
}
