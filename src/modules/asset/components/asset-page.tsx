/** @format */

"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { assetItems } from "../data/assets";
import type { AssetItem } from "../types";
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
  const [selectedAsset, setSelectedAsset] = React.useState<
    AssetItem | undefined
  >(assetItems[0]);

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assetItems.map((asset, index) => (
          <AssetCard
            key={`${asset.title}-${index}`}
            {...asset}
            onClick={() => {
              setSelectedAsset(asset);
              router.push(`/bumdes/asset/manajemen/${asset.id}`);
            }}
            onEdit={() => handleOpenEdit(asset)}
          />
        ))}
      </div>

      <AddAssetDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditAssetDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        asset={selectedAsset}
      />
    </div>
  );
}
