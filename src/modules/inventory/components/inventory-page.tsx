/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddProductModal } from "./add-product-modal";
import { EditProductModal } from "./edit-product-modal";
import { InventoryTable } from "./InventoryTable";
import type { InventoryItem } from "../types";
import { useInventoryActions, useInventoryProducts } from "@/hooks/queries/inventory";
import { useRouter } from "next/navigation";
import { mapInventoryProduct } from "../utils";

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const router = useRouter();
  const { data, isLoading, isError } = useInventoryProducts({
    q: search || undefined,
    limit: 20,
  });
  const actions = useInventoryActions();

  const items: InventoryItem[] = useMemo(() => {
    if (!data || data?.items?.length === 0) return [];

    return data.items.map((p) => mapInventoryProduct(p));
  }, [data]);

  return (
    <div className="w-full space-y-6 text-[#111827] dark:text-[#f8fafc] md:space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Inventaris</h1>
        <Button
          type="button"
          className="h-auto rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nama produk atau SKU"
            className="rounded-md border-[#e5e7eb] bg-white pl-10 pr-3 text-sm leading-5 text-[#111827] placeholder-[#6b7280] transition-colors focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:placeholder-[#94a3b8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-auto rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#334155]"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <InventoryTable
        items={items}
        loading={isLoading}
        onEdit={(item) => {
          setEditingItem(item);
          setEditOpen(true);
        }}
        onToggleMarketplace={(item, next) =>
          actions.update.mutate({
            id: item.id,
            payload: { show_in_marketplace: next },
          })
        }
        onArchive={(item) => actions.archive.mutate(item.id)}
        onUnarchive={(item) => actions.unarchive.mutate(item.id)}
        onRowClick={(item) => router.push(`/bumdes/inventory/${item.id}`)}
        footer={
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Menampilkan {items.length} produk
              {data?.total ? ` dari ${data.total}` : ""}
            </span>
            <span>Gunakan pencarian untuk memfilter produk</span>
          </div>
        }
      />

      <AddProductModal open={addOpen} onOpenChange={setAddOpen} />
      <EditProductModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={editingItem}
      />
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Memuat data inventaris...
        </div>
      ) : null}
      {isError ? (
        <div className="text-sm text-red-500">
          Gagal memuat data inventaris.
        </div>
      ) : null}
    </div>
  );
}
