/** @format */

import type { AssetRentalAsset } from "@/types/api/asset-rental";

export type PublicAssetStatusTone = "available" | "maintenance" | "busy";

export type PublicAssetStatusPresentation = {
  label: string;
  tone: PublicAssetStatusTone;
};

export function resolvePublicAssetStatusPresentation(
  asset?: Pick<AssetRentalAsset, "availability_status" | "status"> | null,
): PublicAssetStatusPresentation {
  const lifecycle = (asset?.status || "").trim().toUpperCase();
  const availability = (asset?.availability_status || "").trim().toLowerCase();

  if (availability.includes("tersedia") || availability.includes("available")) {
    return { label: "Tersedia", tone: "available" };
  }
  if (availability.includes("maint")) {
    return { label: "Maintenance", tone: "maintenance" };
  }
  if (
    lifecycle === "ARCHIVED" ||
    availability.includes("draft") ||
    availability.includes("arsip") ||
    availability.includes("rent") ||
    availability.includes("book") ||
    availability.includes("sibuk") ||
    availability.includes("tidak")
  ) {
    return { label: "Tidak tersedia", tone: "busy" };
  }
  return { label: "Tersedia", tone: "available" };
}

export function resolvePublicAssetErrorMessage(errorMessage?: string | null) {
  const message = (errorMessage || "").trim();
  if (!message) {
    return "Gagal memuat detail aset.";
  }

  const normalized = message.toLowerCase();
  if (
    normalized.includes("not found") ||
    normalized.includes("forbidden") ||
    normalized.includes("ownership") ||
    normalized.includes("unavailable") ||
    normalized.includes("asset not found")
  ) {
    return "Aset tidak tersedia untuk katalog publik.";
  }

  return message;
}
