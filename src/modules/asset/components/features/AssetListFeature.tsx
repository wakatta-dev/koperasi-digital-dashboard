/** @format */

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, Funnel, Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { InputField } from "@/components/shared/inputs/input-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { deleteAsset, getAssets } from "@/services/api/assets";
import { AssetRentalFeatureShell } from "@/modules/asset/components/asset-rental/AssetRentalFeatureShell";

import type { AssetListItem } from "../../types/stitch";
import { mapApiAssetToListItem } from "../../utils/stitch-contract-mappers";
import {
  toFormOptionGroups,
  useAssetMasterData,
} from "../../hooks/use-asset-master-data";

const statusClassMap: Record<AssetListItem["status"], string> = {
  "Draft Internal":
    "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
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
  const confirm = useConfirm();
  const queryClient = useQueryClient();
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

  const archiveMutation = useMutation({
    mutationFn: async (assetId: number) => {
      const response = await deleteAsset(assetId);
      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus aset");
      }
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QK.assetRental.list({ source: "asset-management" }),
      });
    },
  });

  const sourceItems: AssetListItem[] = useMemo(
    () => assetsQuery.data ?? [],
    [assetsQuery.data],
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
    currentPage * pageSize,
  );

  const handleDeleteAsset = useCallback(async (item: AssetListItem) => {
    const assetId = Number.parseInt(item.id, 10);
    if (Number.isNaN(assetId)) {
      showToastError("Gagal menghapus aset", "ID aset tidak valid.");
      return;
    }

    const confirmed = await confirm({
      variant: "delete",
      title: "Hapus aset ini?",
      description: `Aset "${item.name}" akan diarsipkan dan tidak dapat dipakai untuk penyewaan baru.`,
      confirmText: "Hapus",
      cancelText: "Batal",
    });

    if (!confirmed) return;

    try {
      await archiveMutation.mutateAsync(assetId);
      showToastSuccess("Aset dihapus", "Aset berhasil diarsipkan.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus aset";
      showToastError("Gagal menghapus aset", message);
    }
  }, [archiveMutation, confirm]);

  const tablePagination =
    !assetsQuery.isLoading &&
    !assetsQuery.isError &&
    filteredItems.length > 0
      ? {
          page: currentPage,
          pageSize,
          totalItems: filteredItems.length,
          totalPages: pageCount,
        }
      : undefined;

  const columns = useMemo<ColumnDef<AssetListItem, unknown>[]>(
    () => [
      {
        id: "number",
        header: "No",
        meta: {
          width: 64,
          headerClassName: "px-4",
          cellClassName: "px-4 text-sm text-slate-500",
        },
        cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
      },
      {
        id: "name",
        header: "Nama Aset",
        meta: {
          headerClassName: "px-4",
          cellClassName: "px-4",
        },
        cell: ({ row }) => (
          <div className="space-y-1">
            <Link
              href={`/bumdes/asset/manajemen/${encodeURIComponent(row.original.id)}`}
              className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
            >
              {row.original.name}
            </Link>
            <div className="text-xs text-slate-500">{row.original.assetTag}</div>
            <div className="text-xs text-slate-500">
              Status internal: {row.original.internalLifecycle} ·{" "}
              {row.original.publicReady
                ? "Siap diaktifkan untuk publik"
                : "Belum siap publik"}
            </div>
          </div>
        ),
      },
      {
        id: "category",
        header: "Kategori",
        meta: {
          headerClassName: "px-4",
          cellClassName: "px-4 text-sm text-slate-600",
        },
        cell: ({ row }) => row.original.category,
      },
      {
        id: "status",
        header: "Status",
        meta: {
          headerClassName: "px-4",
          cellClassName: "px-4",
        },
        cell: ({ row }) => (
          <Badge
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs",
              statusClassMap[row.original.status],
            )}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "location",
        header: "Lokasi",
        meta: {
          headerClassName: "px-4",
          cellClassName: "px-4 text-sm text-slate-600",
        },
        cell: ({ row }) => row.original.location,
      },
      {
        id: "actions",
        header: "Aksi",
        meta: {
          align: "right",
          headerClassName: "px-4 text-right",
          cellClassName: "px-4 text-right",
        },
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-indigo-600"
              title="Edit aset"
            >
              <Link
                href={`/bumdes/asset/manajemen/edit?assetId=${encodeURIComponent(row.original.id)}`}
              >
                <SquarePen className="h-4 w-4" />
                <span className="sr-only">Edit aset</span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-red-600"
              title="Hapus aset"
              disabled={archiveMutation.isPending}
              onClick={() => void handleDeleteAsset(row.original)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Hapus aset</span>
            </Button>
          </div>
        ),
      },
    ],
    [archiveMutation.isPending, currentPage, handleDeleteAsset, pageSize],
  );

  return (
    <AssetRentalFeatureShell
      title="Daftar Aset"
      description="Kelola data aset utama tanpa elemen layout tambahan."
      actions={
        <Button
          asChild
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/bumdes/asset/manajemen/tambah">
            <Plus className="h-4 w-4" />
            <span>Tambah Aset</span>
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <InputField
              ariaLabel="Cari nama aset, kode"
              startIcon={<Search className="h-4 w-4" />}
              value={search}
              onValueChange={(next) => {
                setSearch(next);
                setPage(1);
              }}
              placeholder="Cari nama aset, kode..."
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
            <span className="mr-1 text-sm font-medium text-slate-500">
              Filter Cepat:
            </span>
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
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
              >
                {filterItem}
              </button>
            ))}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <TableShell
            className="space-y-0"
            containerClassName="w-full"
            columns={columns}
            data={pagedItems}
            getRowId={(row) => row.id}
            loading={assetsQuery.isLoading}
            loadingState="Memuat data aset..."
            emptyState={
              assetsQuery.isError ? (
                <>
                  Gagal memuat data aset.{" "}
                  <button
                    type="button"
                    className="font-medium underline"
                    onClick={() => assetsQuery.refetch()}
                  >
                    Coba lagi
                  </button>
                </>
              ) : (
                "Tidak ada data aset."
              )
            }
            surface="bare"
            headerClassName="bg-slate-50"
            headerRowClassName="hover:bg-slate-50"
            rowClassName="bg-white"
            pagination={tablePagination}
            paginationInfo={`Menampilkan ${pagedItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min((currentPage - 1) * pageSize + pagedItems.length, filteredItems.length)} dari ${filteredItems.length} data`}
            onPrevPage={
              tablePagination
                ? () => setPage((value) => Math.max(1, value - 1))
                : undefined
            }
            onNextPage={
              tablePagination
                ? () => setPage((value) => Math.min(pageCount, value + 1))
                : undefined
            }
            paginationClassName="rounded-none border-x-0 border-b-0 px-4 py-3"
            previousPageLabel="Previous"
            nextPageLabel="Next"
          />
        </div>
      </div>
    </AssetRentalFeatureShell>
  );
}
