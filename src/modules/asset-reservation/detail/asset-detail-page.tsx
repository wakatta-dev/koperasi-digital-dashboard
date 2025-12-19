/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { ASSET_ITEMS } from "../constants";
import { DETAIL_ASSET } from "./constants";
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetDetailPageProps = {
  assetId?: string;
};

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: assetData, isLoading, error } = useAssetDetail(assetId);

  const [availabilityRange, setAvailabilityRange] = useState(() => {
    const today = new Date();
    const end = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      start: today.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  });

  const {
    data: availability,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
  } = useAssetAvailability(assetId, {
    start_date: availabilityRange.start,
    end_date: availabilityRange.end,
  });

  useEffect(() => {
    if (
      !availabilityRange.end ||
      availabilityRange.end < availabilityRange.start
    ) {
      setAvailabilityRange((prev) => ({ ...prev, end: prev.start }));
    }
  }, [availabilityRange.end, availabilityRange.start]);

  const mappedAsset = useMemo(
    () =>
      mapAsset(assetData) ??
      ASSET_ITEMS.find((item) => item.id === assetId) ??
      ASSET_ITEMS[0],
    [assetData, assetId]
  );

  const detail = useMemo(
    () => ({
      ...DETAIL_ASSET,
      id: mappedAsset.id,
      title: mappedAsset.title,
      category: mappedAsset.category,
      price: mappedAsset.price,
      unit: mappedAsset.unit,
      status: mappedAsset.status,
      heroImage: mappedAsset.imageUrl,
      thumbnails: [mappedAsset.imageUrl, ...DETAIL_ASSET.thumbnails.slice(1)],
      descriptions: assetData?.description?.trim()
        ? assetData.description.split("\n").filter(Boolean)
        : DETAIL_ASSET.descriptions,
    }),
    [mappedAsset, assetData?.description]
  );

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
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Memuat detail aset...
              </div>
            ) : null}
            {error ? (
              <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {error instanceof Error
                  ? error.message
                  : "Gagal memuat detail aset"}
              </div>
            ) : null}
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
                  unit={detail.unit}
                  onSubmit={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            <DetailRecommendations currentId={detail.id} />
          </div>
        </main>
        <AssetReservationFooter />
        <RentRequestModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          statusHref={`/penyewaan-aset/status/${mappedAsset.id}?status=pending`}
        />
      </div>
    </div>
  );
}

function mapAsset(asset: any) {
  if (!asset) return undefined;
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  return {
    id: String(asset.id),
    category: rateType === "hourly" ? "Per Jam" : "Per Hari",
    title: asset.name || "Aset",
    description: asset.description || "",
    price: `Rp${(asset.rate_amount ?? 0).toLocaleString("id-ID")}`,
    unit,
    status:
      (asset.status || "").toLowerCase() === "archived"
        ? "maintenance"
        : "available",
    imageUrl:
      asset.photo_url ||
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60",
  };
}
