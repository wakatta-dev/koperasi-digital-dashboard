/** @format */

"use client";

import React from "react";
import { Filter, PanelLeftOpen, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { assetItems } from "../data/assets";
import type { AssetItem } from "../types";
import { AssetCard } from "./asset-card";
import { AddAssetDialog, EditAssetDialog } from "./asset-modals";

const tabs = [
  { label: "Manajemen Aset", active: true },
  { label: "Jadwal Aset Sewa" },
];

export function AssetManagementPage() {
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
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:px-6">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <PanelLeftOpen className="h-5 w-5" />
          <span className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Manajemen Aset
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64 max-w-xs">
            <Input
              type="text"
              placeholder="Cari aset"
              className="h-10 w-full rounded-lg border border-slate-200 bg-transparent pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              type="button"
              variant={tab.active ? "secondary" : "ghost"}
              className={cn(
                "h-auto rounded-md px-4 py-1.5 text-sm font-medium shadow-none",
                tab.active
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
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
              router.push(`/bumdes/asset/${asset.id}`);
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
