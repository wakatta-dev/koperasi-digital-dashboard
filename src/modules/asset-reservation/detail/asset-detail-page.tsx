/** @format */

"use client";

import { useState } from "react";
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
import { getAssetById } from "@/services/api/assets";
import { useEffect } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetDetailPageProps = {
  assetId?: string;
};

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asset, setAsset] = useState(
    ASSET_ITEMS.find((item) => item.id === assetId) ?? ASSET_ITEMS[0]
  );

  useEffect(() => {
    let ignore = false;
    async function fetchAsset() {
      if (!assetId) return;
      try {
        const res = await getAssetById(assetId);
        if (ignore) return;
        if (res.success && res.data) {
          setAsset(mapAsset(res.data));
        }
      } catch {
        // ignore and keep fallback data
      }
    }
    fetchAsset();
    return () => {
      ignore = true;
    };
  }, [assetId]);

  const detail = {
    ...DETAIL_ASSET,
    id: asset.id,
    title: asset.title,
    category: asset.category,
    price: asset.price,
    unit: asset.unit,
    status: asset.status,
    heroImage: asset.imageUrl,
    thumbnails: [asset.imageUrl, ...DETAIL_ASSET.thumbnails.slice(1)],
  };

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <DetailBreadcrumb currentLabel="Detail Aset" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              <div className="lg:col-span-2 space-y-8">
                <DetailGallery
                  heroImage={detail.heroImage}
                  thumbnails={detail.thumbnails}
                  status={detail.status}
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
                  <DetailAvailability />
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
          statusHref={`/penyewaan-aset/status/${asset.id}?status=pending`}
        />
      </div>
    </div>
  );
}

function mapAsset(asset: any) {
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
