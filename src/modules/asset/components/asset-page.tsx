/** @format */

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QK } from "@/hooks/queries/queryKeys";
import { getAssets } from "@/services/api/assets";
import type { AssetItem } from "../types";
import { mapAssetToItem } from "../utils/mappers";
import { AssetCard } from "./asset-card";
import { AddAssetDialog, EditAssetDialog } from "./asset-modals";

const tabs: Array<{ key: "manajemen" | "jadwal"; label: string }> = [
  { key: "manajemen", label: "Manajemen Aset" },
  { key: "jadwal", label: "Jadwal Aset Sewa" },
];

type AssetManagementPageProps = {
  activeTab?: "manajemen" | "jadwal";
};

export function AssetManagementPage({
  activeTab = "manajemen",
}: AssetManagementPageProps) {
  const router = useRouter();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<AssetItem | undefined>();
  const { data, isLoading, error } = useQuery({
    queryKey: QK.assetRental.list(),
    queryFn: async (): Promise<AssetItem[]> => {
      const res = await getAssets();
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat aset");
      }
      return res.data.map(mapAssetToItem);
    },
  });
  const assetItems = React.useMemo(() => data ?? [], [data]);

  React.useEffect(() => {
    if (!selectedAsset && assetItems.length > 0) {
      setSelectedAsset(assetItems[0]);
    }
  }, [assetItems, selectedAsset]);

  const handleOpenEdit = (asset: AssetItem) => {
    setSelectedAsset(asset);
    setEditOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 text-slate-900 dark:text-slate-100">
      <div className="space-y-6">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              type="button"
              variant={tab.key === activeTab ? "secondary" : "ghost"}
              className={cn(
                "h-auto rounded-md px-4 py-1.5 text-sm font-medium shadow-none",
                tab.key === activeTab
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
              onClick={() => {
                if (tab.key === "manajemen") {
                  router.push("/bumdes/asset/manajemen");
                } else if (tab.key === "jadwal") {
                  router.push("/bumdes/asset/jadwal");
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold">Manajemen Aset</h2>
          <Button
            type="button"
            className="h-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Tambah Aset
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
          {error instanceof Error ? error.message : "Gagal memuat aset"}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && assetItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Belum ada aset terdaftar. Tambahkan aset untuk mulai menerima reservasi.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assetItems.map((asset) => (
            <AssetCard
              key={asset.id}
              {...asset}
              onClick={() => {
                setSelectedAsset(asset);
                router.push(`/bumdes/asset/manajemen/${asset.id}`);
              }}
              onEdit={() => handleOpenEdit(asset)}
            />
          ))}
        </div>
      )}

      <AddAssetDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditAssetDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        asset={selectedAsset}
      />
    </div>
  );
}
