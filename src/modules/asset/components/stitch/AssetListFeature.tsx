/** @format */

"use client";

import Link from "next/link";
import { Search, Funnel, Plus, EllipsisVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QK } from "@/hooks/queries/queryKeys";
import { cn } from "@/lib/utils";
import { getAssets } from "@/services/api/assets";

import type { AssetListItem } from "../../types/stitch";
import { mapApiAssetToListItem } from "../../utils/stitch-contract-mappers";
import { toFormOptionGroups, useAssetMasterData } from "../../hooks/use-asset-master-data";
import { AssetRentalFeatureDemoShell } from "./AssetRentalFeatureDemoShell";

const statusClassMap: Record<AssetListItem["status"], string> = {
  Tersedia:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  Dipinjam:
    "border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  Maintenance:
    "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  Arsip:
    "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

export function AssetListFeature() {
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<string>("Semua");
  const [showQuickFilters, setShowQuickFilters] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const masterDataQuery = useAssetMasterData();
  const formOptions = toFormOptionGroups(masterDataQuery.data);

  const quickFilters = useMemo(() => {
    const statusOptions = formOptions.statuses.filter(Boolean);
    return Array.from(new Set(["Semua", ...statusOptions, "Arsip"]));
  }, [formOptions.statuses]);

  useEffect(() => {
    if (!quickFilters.includes(quickFilter)) {
      setQuickFilter("Semua");
    }
  }, [quickFilters, quickFilter]);

  const assetsQuery = useQuery({
    queryKey: QK.assetRental.list({ source: "asset-management" }),
    queryFn: async () => {
      const response = await getAssets({ limit: 200, sort: "newest" });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat daftar aset");
      }
      return response.data.map(mapApiAssetToListItem);
    },
  });

  const sourceItems: AssetListItem[] = useMemo(
    () => assetsQuery.data ?? [],
    [assetsQuery.data]
  );

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return sourceItems.filter((item) => {
      const matchesFilter =
        quickFilter === "Semua" ? true : item.status === quickFilter;
      const matchesSearch =
        searchValue.length === 0
          ? true
          : [item.name, item.assetTag, item.location, item.category]
              .join(" ")
              .toLowerCase()
              .includes(searchValue);
      return matchesFilter && matchesSearch;
    });
  }, [sourceItems, quickFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <AssetRentalFeatureDemoShell
      title="Daftar Aset"
      description="Kelola data aset utama tanpa elemen layout tambahan."
      activeItem="Daftar Aset"
      actions={
        <Button asChild className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
          <Link href="/bumdes/asset/manajemen/tambah">
            <Plus className="h-4 w-4" />
            <span>Tambah Aset</span>
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama aset, kode..."
              className="h-10 border-slate-200 bg-white pl-9"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2 border-slate-200 sm:w-auto"
            onClick={() => setShowQuickFilters((value) => !value)}
          >
            <Funnel className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {showQuickFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-medium text-slate-500">Filter Cepat:</span>
            {quickFilters.map((filterItem) => (
              <button
                key={filterItem}
                type="button"
                onClick={() => {
                  setQuickFilter(filterItem);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filterItem === quickFilter
                    ? "border-indigo-200 bg-indigo-100 text-indigo-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {filterItem}
              </button>
            ))}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <TableShell className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableCell as="th" scope="col" className="w-12 px-4">
                  No
                </TableCell>
                <TableCell as="th" scope="col" className="px-4">
                  Nama Aset
                </TableCell>
                <TableCell as="th" scope="col" className="px-4">
                  Kategori
                </TableCell>
                <TableCell as="th" scope="col" className="px-4">
                  Status
                </TableCell>
                <TableCell as="th" scope="col" className="px-4">
                  Lokasi
                </TableCell>
                <TableCell as="th" scope="col" className="px-4 text-right">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {assetsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Memuat data aset...
                  </TableCell>
                </TableRow>
              ) : null}
              {assetsQuery.isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-8 text-center text-red-600">
                    Gagal memuat data aset.{" "}
                    <button
                      type="button"
                      className="font-medium underline"
                      onClick={() => assetsQuery.refetch()}
                    >
                      Coba lagi
                    </button>
                  </TableCell>
                </TableRow>
              ) : null}
              {!assetsQuery.isLoading && !assetsQuery.isError && pagedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data aset.
                  </TableCell>
                </TableRow>
              ) : null}
              {!assetsQuery.isLoading && !assetsQuery.isError
                ? pagedItems.map((item, index) => (
                <TableRow key={item.id} className="bg-white">
                  <TableCell className="px-4 text-sm text-slate-500">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="space-y-1">
                      <Link
                        href={`/bumdes/asset/manajemen/${encodeURIComponent(item.id)}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-500">{item.assetTag}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 text-sm text-slate-600">{item.category}</TableCell>
                  <TableCell className="px-4">
                    <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs", statusClassMap[item.status])}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 text-sm text-slate-600">{item.location}</TableCell>
                  <TableCell className="px-4 text-right">
                    <Button asChild variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600">
                      <Link href={`/bumdes/asset/manajemen/edit?assetId=${encodeURIComponent(item.id)}`}>
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Aksi</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
                  ))
                : null}
            </tbody>
          </TableShell>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Menampilkan <span className="font-medium text-slate-900">{pagedItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredItems.length)}</span> dari{" "}
            <span className="font-medium text-slate-900">{filteredItems.length}</span> data
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 border-slate-200 px-3 text-slate-600"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 border-slate-200 px-3 text-slate-700"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AssetRentalFeatureDemoShell>
  );
}
