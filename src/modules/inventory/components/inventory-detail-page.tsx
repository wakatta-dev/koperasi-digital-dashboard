/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { useInventoryActions, useInventoryProduct } from "@/hooks/queries/inventory";
import { formatCurrency } from "@/lib/format";
import { EditProductModal } from "./edit-product-modal";
import type { InventoryItem } from "../types";
import { computeEligibility, mapInventoryProduct } from "../utils";

type Props = {
  id: string;
};

export function InventoryDetailPage({ id }: Props) {
  const { data, isLoading, isError, error } = useInventoryProduct(id);
  const actions = useInventoryActions();
  const [editOpen, setEditOpen] = useState(false);
  const [stockInput, setStockInput] = useState<string>("");

  const item: InventoryItem | null = useMemo(
    () => (data ? mapInventoryProduct(data) : null),
    [data]
  );
  const eligibility = useMemo(
    () => (data ? computeEligibility(data) : { eligible: false, reasons: [] }),
    [data]
  );
  const isArchived = item?.status === "ARCHIVED";

  useEffect(() => {
    if (item) {
      setStockInput(String(item.stock));
    }
  }, [item]);

  const handleStockSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item || !item.trackStock) return;
    const desired = Number(stockInput);
    if (Number.isNaN(desired) || desired < 0) return;
    try {
      await actions.adjustStock.mutateAsync({
        id: item.id,
        payload: { physical_count: desired, note: "Manual adjustment" },
      });
    } catch {
      // handled by mutation toast
    }
  };

  const handleVisibility = (next: boolean) => {
    if (!item) return;
    actions.update.mutate({ id: item.id, payload: { show_in_marketplace: next } });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat produk: {(error as Error)?.message || "Terjadi kesalahan"}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 text-[#111827] dark:text-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#6b7280] dark:text-[#94a3b8]">
          <Link
            className="font-medium text-[#6b7280] transition-colors hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-[#a5b4fc]"
            href="/bumdes/inventory"
          >
            Inventaris
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" strokeWidth={2} />
          <span className="font-medium text-[#4f46e5] dark:text-[#a5b4fc]">
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          {isArchived ? (
            <Button
              variant="default"
              disabled={actions.unarchive.isPending}
              onClick={() => actions.unarchive.mutate(item.id)}
            >
              Aktifkan kembali
            </Button>
          ) : (
            <Button
              variant="destructive"
              disabled={actions.archive.isPending}
              onClick={() => actions.archive.mutate(item.id)}
            >
              Arsipkan
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
          Detail Produk
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
        <div className="p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <label className="mb-2 block text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">
                Foto Produk
              </label>
              <div className="mt-1">
                <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] dark:border-[#334155] dark:bg-[#1f2937]">
                  <img
                    src={item.image || "https://via.placeholder.com/200?text=Produk"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={item.status === "ACTIVE" ? "default" : "outline"}>
                  {item.status}
                </Badge>
                <Badge variant={item.marketplaceEligible ? "default" : "secondary"}>
                  {item.marketplaceEligible ? "Marketplace eligible" : "Belum eligible"}
                </Badge>
                {!item.trackStock ? <Badge variant="secondary">Stok tidak dilacak</Badge> : null}
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Produk</p>
                  <p className="text-lg font-medium text-foreground">{item.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="text-lg font-medium text-foreground">{item.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-lg font-medium text-foreground">
                    {item.category || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Harga Jual</p>
                  <p className="text-lg font-medium text-foreground">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="text-base text-foreground">{item.description || "-"}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Stok</p>
                  <p className="text-lg font-semibold text-foreground">
                    {item.trackStock ? item.stock : "Tidak dilacak"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stok</p>
                  <p className="text-lg font-semibold text-foreground">
                    {item.minStock ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Harga Beli</p>
                  <p className="text-lg font-semibold text-foreground">
                    {item.costPrice ? formatCurrency(item.costPrice) : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Marketplace</p>
                  <p className="text-base font-semibold text-foreground">
                    {item.showInMarketplace ? "Tampil" : "Disembunyikan"}
                  </p>
                  {!eligibility.eligible ? (
                    <p className="text-xs text-amber-600">
                      Tidak memenuhi: {eligibility.reasons.join(", ")}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600">Eligible</p>
                  )}
                </div>
                <Switch
                  checked={item.showInMarketplace}
                  onCheckedChange={handleVisibility}
                  disabled={item.status !== "ACTIVE" || actions.update.isPending}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stok</p>
                  <p className="text-base font-semibold text-foreground">
                    {item.trackStock ? item.stock : "Tidak dilacak"}
                  </p>
                </div>
                <Badge variant="secondary">{item.trackStock ? "Dilacak" : "Tidak dilacak"}</Badge>
              </div>
              {item.trackStock ? (
                <form className="space-y-2" onSubmit={handleStockSubmit}>
                  <label className="text-sm font-medium text-foreground">Perbarui stok</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      className="w-32"
                    />
                    <Button type="submit" disabled={actions.adjustStock.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Stok tidak dilacak. Aktifkan pelacakan untuk mengatur stok.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProductModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={item}
      />
    </div>
  );
}
