/** @format */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import { SORT_OPTIONS } from "../constants";
import { AssetCard } from "./asset-card";
import { useMemo } from "react";
import type { AssetFilterQuery } from "@/types/api/asset";
import type { AssetItem } from "../types";
import { useAssetList } from "../hooks";
import type { AssetListResult } from "../hooks/use-asset-list";
import React from "react";

type AssetGridProps = {
  filters: AssetFilterQuery;
  onSortChange: (value: AssetFilterQuery["sort"]) => void;
  pageCursor?: string | number;
  pageSize?: number;
  onPageChange?: (cursor?: string | number) => void;
};

export function AssetGrid({
  filters,
  onSortChange,
  pageCursor,
  pageSize = 9,
  onPageChange,
}: AssetGridProps) {
  const listParams = useMemo(
    () => ({ ...filters, cursor: pageCursor, limit: pageSize }),
    [filters, pageCursor, pageSize]
  );
  const assetListQuery = useAssetList(listParams) as UseQueryResult<AssetListResult>;
  const { data, isLoading, error, isFetching } = assetListQuery;
  const assets: AssetItem[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(mapAsset);
  }, [data]);

  const countText = useMemo(() => {
    if (isLoading) return "Memuat aset...";
    const currentCursor = Number(pageCursor ?? 0);
    const safeCursor = Number.isFinite(currentCursor) ? currentCursor : 0;
    const limit = data?.pagination?.limit ?? pageSize;
    const currentPage = limit > 0 ? Math.floor(safeCursor / limit) + 1 : 1;
    return `${assets.length} aset · Halaman ${currentPage}`;
  }, [isLoading, assets.length, pageCursor, data?.pagination?.limit, pageSize]);

  const pagination = data?.pagination;
  const canPrev = !!pagination?.has_prev && !!onPageChange;
  const canNext = !!pagination?.has_next && !!onPageChange;

  return (
    <div className="flex-grow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {countText}
          </span>{" "}
          tersedia
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Urutkan:
          </span>
          <Select
            value={filters.sort ?? SORT_OPTIONS[0].value}
            onValueChange={(val) => onSortChange(val as AssetFilterQuery["sort"])}
          >
            <SelectTrigger className="text-sm border-none bg-transparent font-semibold text-gray-900 dark:text-white focus:ring-0 focus-visible:ring-0 focus-visible:border-none px-0 h-10">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          {error instanceof Error ? error.message : "Gagal memuat aset"}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark p-4 animate-pulse space-y-3"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && assets.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tidak ada aset yang sesuai dengan filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
      {pagination ? (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="text-center sm:text-left">
            Halaman{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {(() => {
                const start = Number(pageCursor ?? 0);
                const safeStart = Number.isFinite(start) ? start : 0;
                const limit = pagination.limit || pageSize;
                return limit > 0 ? Math.floor(safeStart / limit) + 1 : 1;
              })()}
            </span>{" "}
            {pagination.has_next ? "· Masih ada aset lain" : "· Akhir daftar"}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() => {
                if (!onPageChange) return;
                const prev = pagination.prev_cursor ?? 0;
                onPageChange(prev);
              }}
              disabled={!canPrev || isLoading || isFetching}
            >
              Sebelumnya
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() => {
                if (!onPageChange) return;
                onPageChange(pagination.next_cursor ?? pagination.limit);
              }}
              disabled={!canNext || isLoading || isFetching}
            >
              Berikutnya
            </Button>
            {isFetching ? (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                Memuat halaman...
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapAsset(asset: any): AssetItem {
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const status: AssetItem["status"] =
    (asset.status || "").toLowerCase() === "archived" ? "maintenance" : "available";
  return {
    id: String(asset.id),
    category: rateType === "hourly" ? "Per Jam" : "Per Hari",
    title: asset.name,
    description: asset.description || "",
    price: `Rp${(asset.rate_amount ?? 0).toLocaleString("id-ID")}`,
    unit,
    status,
    imageUrl: asset.photo_url || "",
  };
}
