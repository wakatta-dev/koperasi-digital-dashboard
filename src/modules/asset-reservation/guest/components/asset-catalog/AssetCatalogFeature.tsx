/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Pagination } from "@/types/api/common";
import type { GuestAssetCardItem, GuestAssetCategoryChip } from "../../types";
import { AssetCategoryChips } from "./AssetCategoryChips";
import { AssetCard } from "./AssetCard";
import { AssetPagination } from "./AssetPagination";
import { AssetQuickDetailPanel } from "./AssetQuickDetailPanel";

type AssetCatalogFeatureProps = Readonly<{
  badgeLabel: string;
  title: string;
  description: string;
  statusHref: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  categories: ReadonlyArray<GuestAssetCategoryChip>;
  selectedCategoryKey: string;
  onCategoryChange: (key: string) => void;
  assets: ReadonlyArray<GuestAssetCardItem>;
  selectedAssetId?: number | null;
  onSelectAsset: (id: number | null) => void;
  pagination?: Pagination;
  cursor?: number;
  onCursorChange: (cursor: number) => void;
}>;

export function AssetCatalogFeature({
  badgeLabel,
  title,
  description,
  statusHref,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  categories,
  selectedCategoryKey,
  onCategoryChange,
  assets,
  selectedAssetId,
  onSelectAsset,
  pagination,
  cursor,
  onCursorChange,
}: AssetCatalogFeatureProps) {
  const selected =
    (selectedAssetId ? assets.find((a) => a.id === selectedAssetId) : null) ??
    assets[0] ??
    null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3">
            {badgeLabel}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            asChild
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
          >
            <a href={statusHref}>
              <span className="material-icons-outlined">
                assignment_turned_in
              </span>
              Cek Status Pengajuan
            </a>
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="material-icons-outlined text-gray-400">
                  search
                </span>
              </span>
              <Input
                value={searchValue}
                onChange={(e) => onSearchValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearchSubmit();
                  }
                }}
                className="w-full bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-transparent block pl-10 p-3.5 shadow-sm transition-shadow"
                placeholder="Cari nama aset..."
              />
            </div>
            <Button
              type="button"
              onClick={onSearchSubmit}
              className="p-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span className="material-icons-outlined">tune</span>
            </Button>
          </div>
        </div>
      </div>

      <AssetCategoryChips
        items={categories}
        selectedKey={selectedCategoryKey}
        onSelect={onCategoryChange}
      />

      <div className="flex flex-col lg:flex-row gap-8 relative items-start">
        <div className="w-full lg:w-2/3 xl:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {assets.length === 0 ? (
            <div className="md:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-card-dark px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
              Tidak ada aset yang cocok dengan filter Anda.
            </div>
          ) : null}

          {assets.map((item) => (
            <AssetCard
              key={item.id}
              item={item}
              onSelect={onSelectAsset}
              selected={selected?.id === item.id}
            />
          ))}

          <AssetPagination
            pagination={pagination}
            cursor={cursor}
            onCursorChange={onCursorChange}
          />
        </div>

        {selected ? (
          <AssetQuickDetailPanel
            item={selected}
            onClose={() => onSelectAsset(null)}
            applyHref={`/penyewaan-aset/${encodeURIComponent(String(selected.id))}`}
          />
        ) : null}
      </div>
    </section>
  );
}
