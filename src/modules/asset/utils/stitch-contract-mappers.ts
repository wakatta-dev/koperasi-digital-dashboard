/** @format */

import type {
  AssetRentalAsset,
  AssetRentalBooking,
  AssetSpecification,
} from "@/types/api/asset-rental";
import {
  ASSET_RENTAL_BOOKING_STATUS,
  resolveAssetRentalBookingStatus,
} from "@/lib/asset-rental-booking-status";

import type { AssetDetailModel, AssetFormModel, AssetListItem } from "../types/stitch";

type ContractAsset = {
  id?: string | number;
  asset_tag?: string;
  name?: string;
  photo_url?: string;
  category?: string;
  availability_status?: string;
  rate_type?: string;
  rate_amount?: number;
  serial_number?: string;
  status?: string;
  location?: string;
  assigned_to?: string;
  purchase_date?: string;
  vendor?: string;
  purchase_price?: number;
  warranty_end_date?: string;
  specifications?: AssetSpecification[];
  description?: string;
};

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const categoryByRateType: Record<string, string> = {
  DAILY: "Aset Harian",
  HOURLY: "Aset Per Jam",
};

function toAssetTag(id?: string | number, fallback?: string) {
  if (fallback?.trim()) return fallback.trim();
  if (id === undefined || id === null) return "AST-000";
  const numericId = Number(id);
  if (!Number.isNaN(numericId)) {
    return `AST-${String(Math.max(0, numericId)).padStart(3, "0")}`;
  }
  return `AST-${String(id)}`;
}

function toListStatus(status?: string): AssetListItem["status"] {
  const key = (status || "").trim().toUpperCase();
  if (key === "TERSEDIA" || key === "AVAILABLE") return "Tersedia";
  if (key === "DIPINJAM" || key === "RENTED" || key === "BOOKED") return "Dipinjam";
  if (key === "MAINTENANCE") return "Maintenance";
  if (key === "ARCHIVED") return "Arsip";
  return "Tersedia";
}

function toCategory(rateType?: string, fallback?: string) {
  if (fallback?.trim()) return fallback.trim();
  const key = (rateType || "").toUpperCase();
  return categoryByRateType[key] ?? "Aset Harian";
}

function toPriceDisplay(rateAmount?: number) {
  if (!rateAmount || rateAmount <= 0) return "";
  return String(rateAmount);
}

function toPurchasePriceDisplay(input: ContractAsset) {
  if (input.purchase_price && input.purchase_price > 0) {
    return String(input.purchase_price);
  }
  return toPriceDisplay(input.rate_amount);
}

function toPhotoURL(photoURL?: string) {
  const value = (photoURL ?? "").trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (!API_BASE_URL) return value;

  if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
  return `${API_BASE_URL}/${value}`;
}

function pickLocation(input: ContractAsset) {
  if (input.location?.trim()) return input.location.trim();
  const description = input.description ?? "";
  const match = description.match(/Lokasi:\s*([^\n;]+)/i);
  return match?.[1]?.trim();
}

function toDescriptionAttribute(description?: string) {
  const text = (description ?? "").trim();
  if (!text) return "";
  return text.replace(/^Lokasi:\s*[^\n;]+;?\s*/i, "").trim();
}

function toReadableDate(unixSeconds?: number) {
  if (!unixSeconds) return "-";
  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDurationLabel(startUnix?: number, endUnix?: number) {
  if (!startUnix || !endUnix) return "-";
  const durationMs = Math.max(0, endUnix * 1000 - startUnix * 1000);
  const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  if (days <= 1) return "1 Hari";
  return `${days} Hari`;
}

function toBookingBadgeStatus(booking: AssetRentalBooking) {
  const key = resolveAssetRentalBookingStatus(booking);
  if (key === ASSET_RENTAL_BOOKING_STATUS.completed || key === ASSET_RENTAL_BOOKING_STATUS.confirmedFull) {
    return "Selesai";
  }
  if (key === ASSET_RENTAL_BOOKING_STATUS.rejected || key === ASSET_RENTAL_BOOKING_STATUS.cancelled) {
    return "Ditolak";
  }
  if (key === ASSET_RENTAL_BOOKING_STATUS.pendingReview) return "Menunggu";
  if (key === ASSET_RENTAL_BOOKING_STATUS.awaitingPaymentVerification) {
    return "Menunggu Verifikasi Pembayaran";
  }
  if (
    key === ASSET_RENTAL_BOOKING_STATUS.booked ||
    key === ASSET_RENTAL_BOOKING_STATUS.awaitingSettlement ||
    key === ASSET_RENTAL_BOOKING_STATUS.awaitingDP
  ) {
    return "Berjalan";
  }
  return "Berjalan";
}

function parseDescriptionSpecs(description?: string) {
  const descriptionText = (description ?? "").trim();
  if (!descriptionText) return [];

  const specsMatch = descriptionText.match(/Spesifikasi:\s*([^\n]+)/i);
  const rawSpecs = specsMatch?.[1]?.trim() ?? "";
  if (!rawSpecs) {
    return [
      {
        key: "Deskripsi",
        value: descriptionText,
      },
    ];
  }

  const parsed = rawSpecs
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split(":");
      const value = rest.join(":").trim();
      return {
        key: (label ?? "").trim() || "Spesifikasi",
        value: value || item,
      };
    });

  return parsed.length > 0
    ? parsed
    : [
        {
          key: "Deskripsi",
          value: descriptionText,
        },
      ];
}

function parseStructuredSpecs(specifications?: AssetSpecification[]) {
  if (!Array.isArray(specifications) || specifications.length === 0) {
    return [];
  }
  return specifications
    .map((item) => ({
      key: item.label?.trim() || "Spesifikasi",
      value: item.value?.trim() || "-",
    }))
    .filter((item) => item.key || item.value);
}

function toSummaryCards(asset: ContractAsset, bookings: AssetRentalBooking[]) {
  const activeCount = bookings.filter((booking) => {
    const key = (booking.status || "").toUpperCase();
    return key !== "COMPLETED" && key !== "CONFIRMED_FULL" && key !== "REJECTED" && key !== "CANCELLED";
  }).length;
  const completedCount = bookings.filter((booking) => {
    const key = (booking.status || "").toUpperCase();
    return key === "COMPLETED" || key === "CONFIRMED_FULL";
  }).length;

  return [
    {
      id: "total-booking",
      label: "Total Penyewaan",
      value: String(bookings.length),
      trendLabel: null,
      trendType: "neutral" as const,
    },
    {
      id: "active-booking",
      label: "Penyewaan Aktif",
      value: String(activeCount),
      trendLabel: null,
      trendType: "positive" as const,
    },
    {
      id: "completed-booking",
      label: "Selesai",
      value: String(completedCount),
      trendLabel: null,
      trendType: "neutral" as const,
    },
    {
      id: "rate-amount",
      label: "Tarif Dasar",
      value: String(asset.rate_amount ?? 0),
      trendLabel: asset.rate_type?.toUpperCase() === "HOURLY" ? "/jam" : "/hari",
      trendType: "neutral" as const,
    },
  ];
}

export function mapContractAssetToListItem(input: ContractAsset): AssetListItem {
  return {
    id: String(input.id ?? ""),
    assetTag: toAssetTag(input.id, input.asset_tag),
    name: input.name ?? "",
    category: toCategory(input.rate_type, input.category),
    status: toListStatus(input.availability_status ?? input.status),
    location: pickLocation(input) || "Lokasi belum diatur",
    thumbnailIcon: null,
    quickFlags: [],
  };
}

export function mapContractAssetToDetail(input: ContractAsset): AssetDetailModel {
  return mapContractAssetToDetailWithBookings(input, []);
}

export function mapContractAssetToDetailWithBookings(
  input: ContractAsset,
  bookings: AssetRentalBooking[]
): AssetDetailModel {
  const listItem = mapContractAssetToListItem(input);

  return {
    assetId: listItem.id,
    name: listItem.name,
    photoUrl: toPhotoURL(input.photo_url),
    assetTag: listItem.assetTag,
    status: listItem.status,
    category: listItem.category,
    location: listItem.location,
    summaryCards: toSummaryCards(input, bookings),
    specifications:
      parseStructuredSpecs(input.specifications).length > 0
        ? parseStructuredSpecs(input.specifications)
        : parseDescriptionSpecs(input.description),
    activityRows: bookings
      .slice()
      .sort((a, b) => b.start_time - a.start_time)
      .map((booking) => ({
        id: String(booking.id),
        renterName: booking.renter_name || "-",
        renterContact: booking.renter_contact || booking.purpose || "-",
        startDate: toReadableDate(booking.start_time),
        endDate: toReadableDate(booking.end_time),
        duration: toDurationLabel(booking.start_time, booking.end_time),
        status: toBookingBadgeStatus(booking),
      })),
  };
}

export function mapContractAssetToFormModel(
  input: ContractAsset,
  mode: "create" | "edit" = "edit"
): AssetFormModel {
  const listItem = mapContractAssetToListItem(input);

  return {
    mode,
    name: input.name ?? "",
    photoUrl: toPhotoURL(input.photo_url),
    imageFile: null,
    assetTag: listItem.assetTag,
    serialNumber: input.serial_number ?? "",
    category: listItem.category,
    status: input.availability_status?.trim() || listItem.status,
    location: listItem.location,
    assignedTo: input.assigned_to ?? "",
    purchaseDate: input.purchase_date ?? "",
    vendor: input.vendor ?? "",
    priceDisplay: toPurchasePriceDisplay(input),
    warrantyEndDate: input.warranty_end_date ?? "",
    attributes:
      parseStructuredSpecs(input.specifications).length > 0
        ? parseStructuredSpecs(input.specifications).map((item, index) => ({
            id: `attr-${index + 1}`,
            label: item.key,
            value: item.value,
          }))
        : [
            {
              id: "attr-1",
              label: "Deskripsi",
              value: toDescriptionAttribute(input.description),
            },
          ],
  };
}

export function mapApiAssetToListItem(asset: AssetRentalAsset): AssetListItem {
  return mapContractAssetToListItem(asset);
}
