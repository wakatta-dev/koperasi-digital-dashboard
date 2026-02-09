/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
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
    <div className="w-full space-y-6 text-foreground md:space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Inventaris</h1>
        <Button
          type="button"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <InputField
            ariaLabel="Cari nama produk atau SKU"
            startIcon={<Search className="h-4 w-4" />}
            type="text"
            placeholder="Cari nama produk atau SKU"
            value={search}
            onValueChange={setSearch}
          />
        </div>
        <Button
          type="button"
          variant="outline"
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
        onRowClick={(item) =>
          router.push(`/bumdes/marketplace/inventory/${item.id}`)
        }
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
