/** @format */
"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "./components/reservation-footer";
import { useMemo, useState, useEffect } from "react";
import type { AssetFilterQuery } from "@/types/api/asset";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAssetList } from "./hooks";
import { STITCH_GUEST_CATEGORIES } from "./guest/data/stitch-dummy";
import { AssetCatalogFeature } from "./guest/components/asset-catalog/AssetCatalogFeature";
import type { GuestAssetCardItem } from "./guest/types";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const PAGE_SIZE = 9;
const DEFAULT_SORT = "newest" as const;

export function AssetReservationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialCursor = searchParams.get("cursor") ?? undefined;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState<AssetFilterQuery>({
    sort: DEFAULT_SORT,
    category: initialCategory || undefined,
    search: initialSearch || undefined,
  });
  const [pageCursor, setPageCursor] = useState<string | number | undefined>(
    initialCursor,
  );

  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const cursor = searchParams.get("cursor") ?? undefined;

    setSearchTerm(search);
    setFilters({
      sort: DEFAULT_SORT,
      category: category || undefined,
      search: search || undefined,
    });
    setPageCursor(cursor || undefined);
  }, [searchParams]);

  const updateParams = (updates: {
    search?: string;
    category?: string;
    cursor?: string | number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value?: string | number) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
        return;
      }
      params.set(key, String(value));
    };

    setOrDelete("search", updates.search);
    setOrDelete("category", updates.category);
    setOrDelete("cursor", updates.cursor);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleSearchSubmit = () => {
    const nextSearch = searchTerm.trim();
    setFilters((prev) => ({
      ...prev,
      search: nextSearch || undefined,
    }));
    setPageCursor(undefined);
    updateParams({ search: nextSearch || undefined, cursor: undefined });
  };

  const handleCategoryChange = (value?: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
    }));
    setPageCursor(undefined);
    updateParams({ category: value, cursor: undefined });
  };

  // const handleResetFilters = () => {
  //   setSearchTerm("");
  //   setFilters({ sort: DEFAULT_SORT });
  //   setPageCursor(undefined);
  //   updateParams({
  //     search: undefined,
  //     category: undefined,
  //     cursor: undefined,
  //   });
  // };

  const appliedFilters = useMemo(() => filters, [filters]);
  const assetList = useAssetList({
    ...appliedFilters,
    cursor: pageCursor,
    limit: PAGE_SIZE,
  });

  const items: GuestAssetCardItem[] = useMemo(() => {
    const assets = assetList.data?.items ?? [];
    return assets.map((asset, idx) => {
      const rateType = (asset.rate_type || "").toUpperCase();
      const unitLabel = rateType === "HOURLY" ? "/jam" : "/hari";
      const amount = Number(asset.rate_amount ?? 0);
      const priceLabel =
        amount > 0 ? `Rp ${amount.toLocaleString("id-ID")}` : "Rp 0";
      const availability = (asset.availability_status || "").toLowerCase();
      const statusTone =
        (asset.status || "").toUpperCase() === "ARCHIVED"
          ? "maintenance"
          : availability.includes("tersedia")
            ? "available"
            : availability.includes("maint")
              ? "maintenance"
              : "busy";
      const statusLabel =
        asset.availability_status?.trim() ||
        (statusTone === "available"
          ? "Tersedia"
          : statusTone === "maintenance"
            ? "Maintenance"
            : "Tidak tersedia");
      return {
        id: asset.id,
        category: asset.category?.trim() || "Aset Desa",
        statusLabel,
        statusTone,
        title: asset.name,
        description: asset.description?.trim() || "Deskripsi belum tersedia.",
        priceLabel,
        unitLabel,
        imageUrl:
          asset.photo_url?.trim() ||
          "https://images.unsplash.com/photo-1559054663-e9b7f7a2b5b0?auto=format&fit=crop&w=1200&q=60",
        featured: idx === 1,
      };
    });
  }, [assetList.data?.items]);

  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  useEffect(() => {
    if (selectedAssetId !== null) return;
    if (items.length > 0) setSelectedAssetId(items[0].id);
  }, [items, selectedAssetId]);

  return (
    <div className={plusJakarta.className}>
      <div className="asset-rental-guest bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <AssetCatalogFeature
            badgeLabel="Layanan Desa"
            title="Katalog Aset Desa"
            description="Eksplorasi aset desa yang tersedia untuk menunjang aktivitas pertanian, acara komunitas, hingga transportasi darurat Anda."
            statusHref="/penyewaan-aset/status"
            searchValue={searchTerm}
            onSearchValueChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            categories={STITCH_GUEST_CATEGORIES}
            selectedCategoryKey={appliedFilters.category || "all"}
            onCategoryChange={(key) => {
              if (key === "all") {
                handleCategoryChange(undefined);
                return;
              }
              handleCategoryChange(key);
            }}
            assets={items}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            pagination={assetList.data?.pagination}
            cursor={
              typeof pageCursor === "number"
                ? pageCursor
                : Number(pageCursor ?? 0)
            }
            onCursorChange={(cursor) => {
              setPageCursor(cursor);
              updateParams({ cursor });
            }}
          />
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
