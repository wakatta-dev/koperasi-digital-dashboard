/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { DetailBreadcrumb } from "./components/detail-breadcrumb";
import { DetailGallery } from "./components/detail-gallery";
import { DetailInfo } from "./components/detail-info";
import { DetailDescription } from "./components/detail-description";
import { DetailFacilities } from "./components/detail-facilities";
import { DetailAvailability } from "./components/detail-availability";
import { DetailRentalForm } from "./components/detail-rental-form";
import { DetailRecommendations } from "./components/detail-recommendations";
import { RentRequestModal } from "./components/rent-request-modal";
import { useAssetAvailability, useAssetDetail } from "../hooks";
import type { AssetAvailabilityRange } from "@/types/api/asset";
import { useState, useEffect, useMemo } from "react";
import { AssetStatus } from "../types";
import type { ReservationSummary } from "../types";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetDetailPageProps = {
  assetId?: string;
};

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastReservation, setLastReservation] = useState<ReservationSummary | null>(null);
  const { data: assetData, isLoading, error } = useAssetDetail(assetId);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [availabilityRange, setAvailabilityRange] = useState(() => {
    const today = new Date();
    const end = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      start: formatDate(today),
      end: formatDate(end),
    };
  });

  const {
    data: availability,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
  } = useAssetAvailability(
    assetId,
    useMemo(() => {
      const base = availabilityRange.start
        ? new Date(`${availabilityRange.start}T00:00:00`)
        : new Date();
      const windowStart = new Date(base.getFullYear(), base.getMonth(), 1);
      const windowEnd = new Date(base.getFullYear(), base.getMonth() + 2, 0); // end of next month
      return {
        start_date: formatDate(windowStart),
        end_date: formatDate(windowEnd),
      };
    }, [availabilityRange.start])
  );

  useEffect(() => {
    if (
      !availabilityRange.end ||
      availabilityRange.end < availabilityRange.start
    ) {
      setAvailabilityRange((prev) => ({ ...prev, end: prev.start }));
    }
  }, [availabilityRange.end, availabilityRange.start]);

  const mappedAsset = useMemo(() => mapAsset(assetData), [assetData]);

  const detail = useMemo(() => {
    if (!mappedAsset) return null;
    return {
      id: mappedAsset.id,
      title: mappedAsset.title,
      category: mappedAsset.category,
      price: mappedAsset.price,
      rawPrice: mappedAsset.rawPrice,
      unit: mappedAsset.unit,
      status: mappedAsset.status,
      heroImage: mappedAsset.imageUrl,
      thumbnails: [mappedAsset.imageUrl],
      descriptions: assetData?.description?.trim()
        ? assetData.description.split("\n").filter(Boolean)
        : [],
      facilities: [],
      location: mappedAsset.location,
    };
  }, [mappedAsset, assetData?.description]);

  const blockedRanges: AssetAvailabilityRange[] = availability?.blocked ?? [];
  const availabilityErrorMessage =
    availabilityError instanceof Error ? availabilityError.message : null;

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <DetailBreadcrumb currentLabel="Detail Aset" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {isLoading ? (
              <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                </div>
                <div className="lg:col-span-1 space-y-3">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
              </div>
            ) : null}
            {error ? (
              <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {error instanceof Error
                  ? error.message
                  : "Gagal memuat detail aset"}
            </div>
            ) : null}
            {!isLoading && !detail ? (
              <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                Data aset tidak tersedia.
              </div>
            ) : null}
            {detail ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <DetailGallery
                    heroImage={detail.heroImage}
                    thumbnails={detail.thumbnails}
                    status={detail.status as AssetStatus}
                    title={detail.title}
                  />
                  <div className="space-y-6">
                    <DetailInfo
                      title={detail.title}
                      price={detail.price}
                      unit={detail.unit}
                      location={detail.location}
                    />
                    <DetailDescription paragraphs={detail.descriptions} />
                    <DetailFacilities facilities={detail.facilities} />
                    <DetailAvailability
                      blocked={blockedRanges}
                      isLoading={isAvailabilityLoading}
                      error={availabilityErrorMessage}
                      suggestion={availability?.suggestion}
                      selectedRange={{
                        start: availabilityRange.start,
                        end: availabilityRange.end,
                      }}
                      onRangeChange={setAvailabilityRange}
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <DetailRentalForm
                    assetId={detail.id}
                    price={detail.price}
                    priceValue={detail.rawPrice ?? 0}
                    unit={detail.unit}
                    startDate={availabilityRange.start}
                    endDate={availabilityRange.end}
                    onRangeChange={setAvailabilityRange}
                    onSubmit={(info) => {
                      setLastReservation(info);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              </div>
            ) : null}

            {detail ? <DetailRecommendations currentId={detail.id} /> : null}
          </div>
        </main>
        <AssetReservationFooter />
        <RentRequestModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          requestId={lastReservation?.reservationId}
          statusHref={`/penyewaan-aset/status/${lastReservation?.reservationId ?? mappedAsset?.id ?? ""}?status=pending`}
        />
      </div>
    </div>
  );
}

function mapAsset(asset: any) {
  if (!asset) return undefined;
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const priceValue = Number(asset.rate_amount ?? 0);
  return {
    id: String(asset.id),
    category: rateType === "hourly" ? "Per Jam" : "Per Hari",
    title: asset.name || "",
    description: asset.description || "",
    price: priceValue > 0 ? `Rp${priceValue.toLocaleString("id-ID")}` : "",
    rawPrice: priceValue,
    unit,
    status:
      (asset.status || "").toLowerCase() === "archived"
        ? "maintenance"
        : "available",
    imageUrl: asset.photo_url || "",
    location: asset.location || "",
  };
}
