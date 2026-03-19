/** @format */

"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventoryActions, useInventoryCategories } from "@/hooks/queries/inventory";
import { selectableInventoryCategoryNames } from "./inventoryCategoryOptions";

export function ProductCreatePage() {
  const router = useRouter();
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { create, update, addImage, initialStock } = useInventoryActions();
  const { data: categoriesData } = useInventoryCategories();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [priceSell, setPriceSell] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [trackStock, setTrackStock] = useState(true);
  const [initialStockQty, setInitialStockQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [showInMarketplace, setShowInMarketplace] = useState(false);
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const activeCategoryNames = useMemo(
    () => selectableInventoryCategoryNames(categoriesData),
    [categoriesData]
  );

  const submitting = create.isPending || addImage.isPending || initialStock.isPending;

  const resetForm = () => {
    setName("");
    setSku("");
    setBrand("");
    setCategory("");
    setPriceSell("");
    setHasVariants(false);
    setTrackStock(true);
    setInitialStockQty("");
    setMinStock("");
    setShowInMarketplace(false);
    setWeight("");
    setDescription("");
    setFiles([]);
  };

  const handleCancel = () => {
    resetForm();
    router.push("/bumdes/marketplace/inventory");
  };

  const handleSubmit = async () => {
    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      description: description.trim(),
    };

    if (!payload.name) {
      toast.error("Nama produk wajib diisi.");
      return;
    }
    const weightValue = weight.trim() ? Number(weight) : undefined;
    const parsedWeight = Number.isFinite(weightValue as number) ? weightValue : undefined;
    const parsedPriceSell = Number(priceSell);
    if (hasVariants) {
      if (!Number.isFinite(parsedPriceSell) || parsedPriceSell < 0) {
        toast.error("Harga dasar produk dengan varian tidak boleh negatif.");
        return;
      }
    } else if (!Number.isFinite(parsedPriceSell) || parsedPriceSell <= 0) {
      toast.error("Harga default produk tanpa varian wajib diisi dan harus lebih dari 0.");
      return;
    }
    const parsedMinStock = minStock.trim() ? Number(minStock) : 0;
    if (!Number.isFinite(parsedMinStock) || parsedMinStock < 0) {
      toast.error("Minimum stok harus bernilai 0 atau lebih.");
      return;
    }
    const parsedInitialStock = initialStockQty.trim() ? Number(initialStockQty) : 0;
    if (!Number.isFinite(parsedInitialStock) || parsedInitialStock < 0) {
      toast.error("Stok awal harus bernilai 0 atau lebih.");
      return;
    }
    if (showInMarketplace && trackStock && parsedInitialStock <= 0) {
      toast.error("Isi stok awal lebih dari 0 jika produk langsung ditampilkan di marketplace.");
      return;
    }

    const publicationRequested = showInMarketplace;
    try {
      const product = await create.mutateAsync({
        name: payload.name,
        sku: payload.sku || undefined,
        category: payload.category || undefined,
        brand: brand.trim() || undefined,
        weight_kg: parsedWeight,
        description: payload.description || undefined,
        price_sell: Math.round(parsedPriceSell),
        track_stock: trackStock,
        min_stock: Math.round(parsedMinStock),
        show_in_marketplace: false,
      });
      if (trackStock && parsedInitialStock > 0) {
        await initialStock.mutateAsync({
          id: product.id,
          payload: { quantity: Math.round(parsedInitialStock), note: "Initial stock" },
        });
      }
      if (files.length > 0) {
        await addImage.mutateAsync({
          id: product.id,
          file: files[0],
          primary: true,
        });
        if (files.length > 1) {
          await Promise.all(
            files.slice(1).map((fileItem) =>
              addImage.mutateAsync({ id: product.id, file: fileItem })
            )
          );
        }
      }
      if (publicationRequested) {
        if (hasVariants) {
          toast.info(
            "Produk varian disimpan sebagai draft internal. Lengkapi varian lalu publikasikan dari detail produk.",
          );
        } else {
          try {
            await update.mutateAsync({
              id: product.id,
              payload: { show_in_marketplace: true },
            });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Lengkapi data publikasi produk.";
            toast.error(`Produk tersimpan sebagai draft internal. ${message}`);
            resetForm();
            router.push(`/bumdes/marketplace/inventory/${product.id}/edit`);
            return;
          }
        }
      }
      resetForm();
      if (hasVariants) {
        router.push(`/bumdes/marketplace/inventory/${product.id}/variants`);
      } else {
        router.push(`/bumdes/marketplace/inventory?created=${product.id}`);
      }
    } catch {
      // handled in mutation hooks
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-8 space-y-8"
      data-testid="marketplace-admin-product-create-page-root"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tambah Produk Baru
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambahkan informasi lengkap untuk produk baru Anda.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          data-testid="marketplace-admin-product-create-cancel-button"
          className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Batal
        </Button>
      </div>

      <div className="space-y-6 pb-12">
        <section className="surface-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informasi Dasar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="product-create-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Produk
              </label>
              <Input
                id="product-create-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                data-testid="marketplace-admin-product-create-name-input"
                placeholder="Masukkan nama produk"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="product-create-sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SKU
              </label>
              <Input
                id="product-create-sku"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                data-testid="marketplace-admin-product-create-sku-input"
                placeholder="Contoh: PROD-001"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="product-create-brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Merek
              </label>
              <Input
                id="product-create-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Masukkan merek produk"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="product-create-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="product-create-category"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-indigo-600 focus:border-indigo-600"
                  data-testid="marketplace-admin-product-create-category-trigger"
                >
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategoryNames.length > 0 ? (
                    activeCategoryNames.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__empty" disabled>
                      Tidak ada kategori
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="product-create-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {hasVariants ? "Harga Dasar Produk (Opsional)" : "Harga Default Produk"}
              </label>
              <Input
                id="product-create-price"
                type="number"
                min={hasVariants ? 0 : 1}
                value={priceSell}
                onChange={(event) => setPriceSell(event.target.value)}
                data-testid="marketplace-admin-product-create-price-input"
                placeholder={hasVariants ? "Contoh: 0 atau 15000" : "Contoh: 15000"}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {hasVariants
                  ? "Harga jual final ditentukan pada setiap varian."
                  : "Wajib diisi jika produk tidak memiliki varian."}
              </p>
            </div>
            <div>
              <label htmlFor="product-create-weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Berat (kg)
              </label>
              <Input
                id="product-create-weight"
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="0.0"
                step="0.1"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="product-create-initial-stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stok Awal
              </label>
              <Input
                id="product-create-initial-stock"
                type="number"
                min={0}
                value={initialStockQty}
                onChange={(event) => setInitialStockQty(event.target.value)}
                data-testid="marketplace-admin-product-create-initial-stock-input"
                placeholder={trackStock ? "Contoh: 10" : "Tidak dilacak"}
                disabled={!trackStock}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600 disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="product-create-min-stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Stok
              </label>
              <Input
                id="product-create-min-stock"
                type="number"
                min={0}
                value={minStock}
                onChange={(event) => setMinStock(event.target.value)}
                placeholder={trackStock ? "Contoh: 3" : "Tidak dilacak"}
                disabled={!trackStock}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600 disabled:opacity-60"
              />
            </div>
            <div className="md:col-span-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Produk Memiliki Varian
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Jika aktif, setelah simpan Anda akan diarahkan ke halaman pengaturan varian.
                  </p>
                </div>
                <Switch
                  checked={hasVariants}
                  onCheckedChange={setHasVariants}
                  data-testid="marketplace-admin-product-create-has-variants-switch"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Lacak Stok Produk
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Matikan jika produk tidak memiliki batas stok.
                  </p>
                </div>
                <Switch
                  checked={trackStock}
                  onCheckedChange={setTrackStock}
                  data-testid="marketplace-admin-product-create-track-stock-switch"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Tampilkan di Marketplace
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Produk baru akan disimpan sebagai draft internal. Sistem hanya mempublikasikan jika data produk sudah lengkap.
                  </p>
                </div>
                <Switch
                  checked={showInMarketplace}
                  onCheckedChange={setShowInMarketplace}
                  data-testid="marketplace-admin-product-create-show-marketplace-switch"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="product-create-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi
              </label>
              <Textarea
                id="product-create-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                data-testid="marketplace-admin-product-create-description-textarea"
                placeholder="Tuliskan deskripsi lengkap produk..."
                rows={4}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
          </div>
        </section>

        <section className="surface-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Media
          </h3>
          <div
            className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
            data-testid="marketplace-admin-product-create-media-dropzone"
            onClick={() => fileRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              const dropped = Array.from(event.dataTransfer.files ?? []);
              if (dropped.length > 0) {
                setFiles((prev) => [...prev, ...dropped]);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                fileRef.current?.click();
              }
            }}
          >
            <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tarik dan lepas gambar di sini
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Atau klik untuk memilih file dari komputer Anda (Maks. 5MB per file)
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm"
              onClick={() => fileRef.current?.click()}
            >
              Pilih File
            </Button>
            <input
              id={uploadId}
              ref={fileRef}
              type="file"
              data-testid="marketplace-admin-product-create-file-input"
              className="hidden"
              multiple
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                if (selected.length > 0) {
                  setFiles((prev) => [...prev, ...selected]);
                }
                event.currentTarget.value = "";
              }}
              accept="image/*"
            />
            {files.length > 0 ? (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {files.length} gambar dipilih
              </p>
            ) : null}
            {showInMarketplace ? (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-300">
                Publikasi akan dicek ulang setelah produk, stok awal, dan gambar selesai disimpan.
              </p>
            ) : null}
          </div>
        </section>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            data-testid="marketplace-admin-product-create-cancel-button-footer"
            className="px-8 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            data-testid="marketplace-admin-product-create-submit-button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            Simpan Produk
          </Button>
        </div>
      </div>
    </div>
  );
}
