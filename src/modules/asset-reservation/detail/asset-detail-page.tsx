/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useMemo, useState } from "react";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { useAssetAvailability, useAssetDetail } from "../hooks";
import type { AssetStatus } from "../types";

import { DetailBreadcrumb } from "./components/detail-breadcrumb";
import { DetailGallery } from "./components/detail-gallery";
import { DetailInfo } from "./components/detail-info";
import { DetailDescription } from "./components/detail-description";
import { DetailAvailability } from "./components/detail-availability";
import { DetailFacilities, type FacilityItem } from "./components/detail-facilities";
import { DetailRentalForm } from "./components/detail-rental-form";
import { DetailRecommendations } from "./components/detail-recommendations";
import { RentRequestModal } from "./components/rent-request-modal";

type AssetDetailPageProps = {
  assetId?: string;
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function formatCurrency(amount?: number) {
  const safeAmount = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return `Rp${safeAmount.toLocaleString("id-ID")}`;
}

function resolveUnit(rateType?: string) {
  return (rateType || "").toUpperCase() === "HOURLY" ? "/jam" : "/hari";
}

function resolveStatus(asset?: { status?: string; availability_status?: string } | null): AssetStatus {
  if (!asset) return "available";
  const rawStatus = (asset.status || "").toUpperCase();
  if (rawStatus === "ARCHIVED") return "maintenance";
  const availability = (asset.availability_status || "").toLowerCase();
  if (availability.includes("rent")) return "rented";
  if (availability.includes("maint")) return "maintenance";
  return "available";
}

function splitParagraphs(text?: string) {
  const value = (text ?? "").trim();
  if (!value) return [];
  return value.split("\n").map((p) => p.trim()).filter(Boolean);
}

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const hasAssetId = Boolean(assetId && String(assetId).trim());
  const { data: asset, isLoading, error } = useAssetDetail(assetId);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const [range, setRange] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return { start: tomorrow, end: tomorrow };
  });

  const availabilityQuery = useAssetAvailability(assetId);
  const availabilityError =
    availabilityQuery.error instanceof Error
      ? availabilityQuery.error.message
      : availabilityQuery.error
        ? String(availabilityQuery.error)
        : null;

  const [requestOpen, setRequestOpen] = useState(false);
  const [statusHref, setStatusHref] = useState<string | undefined>(undefined);

  const title = asset?.name ?? "Detail Aset";
  const unit = resolveUnit(asset?.rate_type);
  const price = formatCurrency(asset?.rate_amount);
  const priceValue = Number(asset?.rate_amount ?? 0);
  const location = asset?.location?.trim() ? asset.location.trim() : "-";
  const status = resolveStatus(asset ?? null);
  const heroImage = asset?.photo_url ?? "";
  const thumbnails: string[] = [];
  const paragraphs = splitParagraphs(asset?.description);
  const facilities: FacilityItem[] = useMemo(() => {
    const rawFacilities = (asset as any)?.facilities;
    if (!Array.isArray(rawFacilities)) return [];
    return rawFacilities
      .map((item) => {
        if (typeof item === "string" && item.trim()) {
          return { icon: "check", label: item.trim() };
        }
        if (item && typeof item === "object" && "label" in item) {
          const label = String((item as any).label || "").trim();
          if (!label) return null;
          const icon = typeof (item as any).icon === "string" ? (item as any).icon : "check";
          return { icon, label };
        }
        return null;
      })
      .filter(Boolean) as FacilityItem[];
  }, [asset]);

  return (
    <div className={plusJakarta.className}>
      <div className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <DetailBreadcrumb currentLabel={title} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!hasAssetId ? (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-6 py-5 text-sm text-amber-700 dark:text-amber-200">
                ID aset tidak ditemukan.
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-5 text-sm text-red-700 dark:text-red-200">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-card-dark px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                Memuat detail aset...
              </div>
            ) : null}

            {!isLoading && asset && hasAssetId ? (
              <>
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="space-y-8 lg:col-span-2">
                    <DetailGallery
                      heroImage={heroImage}
                      thumbnails={thumbnails}
                      status={status}
                      title={title}
                    />
                    <DetailInfo
                      title={title}
                      price={price}
                      unit={unit}
                      location={location}
                    />

                    <DetailDescription
                      paragraphs={
                        paragraphs.length > 0 ? paragraphs : ["Deskripsi belum tersedia."]
                      }
                    />

                    <DetailAvailability
                      blocked={availabilityQuery.data?.blocked}
                      suggestion={availabilityQuery.data?.suggestion}
                      isLoading={availabilityQuery.isLoading}
                      error={availabilityError}
                      selectedRange={range}
                      onRangeChange={setRange}
                    />

                    <DetailFacilities facilities={facilities} />
                    <DetailRecommendations currentId={String(assetId)} />
                  </div>

                  <div className="lg:col-span-1">
                    <DetailRentalForm
                      assetId={String(assetId)}
                      price={price}
                      priceValue={priceValue}
                      unit={unit}
                      startDate={range.start}
                      endDate={range.end}
                      onRangeChange={setRange}
                      onSubmit={(reservation) => {
                        if (reservation.statusHref) setStatusHref(reservation.statusHref);
                        setRequestOpen(true);
                      }}
                    />
                  </div>
                </div>

                <RentRequestModal
                  open={requestOpen}
                  onOpenChange={setRequestOpen}
                  statusHref={statusHref}
                />
              </>
            ) : null}
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
