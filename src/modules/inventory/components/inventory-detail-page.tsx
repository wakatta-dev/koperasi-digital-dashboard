/** @format */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import {
  useInventoryActions,
  useInventoryProduct,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import { formatCurrency } from "@/lib/format";
import { EditProductModal } from "./edit-product-modal";
import { VariantManagement } from "./variant-management";
import type { InventoryItem } from "../types";
import { computeEligibility, mapInventoryProduct } from "../utils";

type Props = {
  id: string;
};

export function InventoryDetailPage({ id }: Props) {
  const { data, isLoading, isError, error } = useInventoryProduct(id);
  const { data: variantsData } = useInventoryVariants(id);
  const actions = useInventoryActions();
  const [editOpen, setEditOpen] = useState(false);
  const [stockInput, setStockInput] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const item: InventoryItem | null = useMemo(
    () => (data ? mapInventoryProduct(data) : null),
    [data]
  );
  const eligibility = useMemo(
    () => (data ? computeEligibility(data) : { eligible: false, reasons: [] }),
    [data]
  );
  const activeVariantGroups = useMemo(
    () =>
      (variantsData?.variant_groups ?? []).filter(
        (group) => group.status === "ACTIVE"
      ),
    [variantsData?.variant_groups]
  );
  const isArchived = item?.status === "ARCHIVED";

  useEffect(() => {
    if (item) {
      setStockInput(String(item.stock));
    }
  }, [item]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleImageUpload = async () => {
    if (!item || !selectedFile) return;
    setUploadError(null);
    try {
      await actions.uploadImage.mutateAsync({
        id: item.id,
        file: selectedFile,
      });
      setSelectedFile(null);
    } catch (err) {
      setUploadError((err as Error)?.message || "Gagal mengunggah foto produk.");
    }
  };

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

  const handleFeaturedGroupChange = (value: string) => {
    if (!item) return;
    const next = value ? Number(value) : null;
    actions.update.mutate({
      id: item.id,
      payload: { featured_variant_group_id: next },
    });
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
    <div className="w-full space-y-6 md:space-y-8 text-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            className="font-medium text-muted-foreground transition-colors hover:text-indigo-500"
            href="/bumdes/marketplace/inventory"
          >
            Inventaris
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
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
        <h1 className="text-2xl font-bold text-foreground">Detail Produk</h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Foto Produk
              </label>
              <div className="mt-1">
                <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-xs font-medium text-muted-foreground">
                      Belum ada foto
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={actions.uploadImage.isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageUpload}
                    disabled={!selectedFile || actions.uploadImage.isPending}
                  >
                    {actions.uploadImage.isPending
                      ? "Mengunggah..."
                      : item.image
                        ? "Ganti Foto"
                        : "Unggah Foto"}
                  </Button>
                  {selectedFile && !actions.uploadImage.isPending ? (
                    <p className="text-xs text-muted-foreground">
                      Siap diunggah: {selectedFile.name}
                    </p>
                  ) : null}
                  {uploadError ? (
                    <p className="text-xs text-destructive">{uploadError}</p>
                  ) : null}
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
                  {item.product?.has_variants ? (
                    <p className="text-xs text-amber-600">
                      Harga dikelola per varian.
                    </p>
                  ) : null}
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
                  {activeVariantGroups.length > 0 ? (
                    <div className="mt-3 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Varian unggulan di listing
                      </label>
                      <Select
                        value={
                          data?.featured_variant_group_id
                            ? `${data.featured_variant_group_id}`
                            : "cover"
                        }
                        onValueChange={(value) =>
                          handleFeaturedGroupChange(
                            value === "cover" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground h-auto">
                          <SelectValue placeholder="Gunakan cover produk" />
                        </SelectTrigger>
                        <SelectContent className="border border-border bg-popover text-foreground">
                          <SelectItem value="cover">Gunakan cover produk</SelectItem>
                          {activeVariantGroups.map((group) => (
                            <SelectItem key={group.id} value={`${group.id}`}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Mengatur foto & harga yang tampil di listing marketplace.
                      </p>
                    </div>
                  ) : null}
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

      <VariantManagement productId={item.id} />

      <EditProductModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={item}
      />
    </div>
  );
}
