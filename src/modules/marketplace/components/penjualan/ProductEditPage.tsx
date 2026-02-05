/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInventoryActions,
  useInventoryCategories,
  useInventoryProduct,
  useInventoryVariantActions,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import { mapInventoryProduct } from "@/modules/inventory/utils";
import { ConfirmActionDialog } from "@/modules/marketplace/components/shared/ConfirmActionDialog";

export type ProductEditPageProps = Readonly<{
  id: string;
}>;

type EditableVariantRow = {
  optionId: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  trackStock: boolean;
  attributes: Record<string, string>;
};

export function ProductEditPage({ id }: ProductEditPageProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { update, addImage, deleteImage, setPrimaryImage } = useInventoryActions();
  const variantActions = useInventoryVariantActions();
  const { data, isLoading, isError } = useInventoryProduct(id);
  const { data: variantsData } = useInventoryVariants(id);
  const { data: categoriesData } = useInventoryCategories();

  const product = useMemo(() => (data ? mapInventoryProduct(data) : null), [data]);
  const variantRows = useMemo<EditableVariantRow[]>(() => {
    if (!variantsData) return [];
    const groups = new Map(
      (variantsData.variant_groups ?? []).map((group) => [group.id, group.name])
    );
    return (variantsData.options ?? []).map((option) => {
      const groupName = groups.get(option.variant_group_id) ?? "Varian";
      const attributes = option.attributes ?? {};
      const attributeLabel = Object.values(attributes).join(" / ");
      return {
        optionId: option.id,
        name: attributeLabel ? `${groupName} / ${attributeLabel}` : groupName,
        sku: option.sku,
        stock: option.stock,
        price: option.price_override ?? product?.price ?? 0,
        trackStock: option.track_stock,
        attributes,
      };
    });
  }, [variantsData, product?.price]);

  const categoryOptions = useMemo(() => {
    const labels = new Set<string>();
    (categoriesData ?? []).forEach((item) => {
      if (item.name) labels.add(item.name);
    });
    if (category) labels.add(category);
    return Array.from(labels);
  }, [categoriesData, category]);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [editableVariants, setEditableVariants] = useState<EditableVariantRow[]>([]);
  const [pendingDeleteVariant, setPendingDeleteVariant] =
    useState<EditableVariantRow | null>(null);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setSku(product.sku);
    setBrand(product.brand ?? "");
    setCategory(product.category ?? "");
    setWeight(
      typeof product.weightKg === "number" && !Number.isNaN(product.weightKg)
        ? String(product.weightKg)
        : ""
    );
    setDescription(product.description ?? "");
    setPendingFiles([]);
  }, [product]);

  useEffect(() => {
    setEditableVariants(variantRows);
  }, [variantRows]);

  const submitting =
    update.isPending ||
    addImage.isPending ||
    deleteImage.isPending ||
    setPrimaryImage.isPending;
  const images = useMemo(() => {
    if (!product?.images || product.images.length === 0) return [];
    return [...product.images].sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.sort_order - b.sort_order
    );
  }, [product?.images]);

  const updateVariantRow = (
    optionId: number,
    updates: Partial<EditableVariantRow>
  ) => {
    setEditableVariants((prev) =>
      prev.map((row) => (row.optionId === optionId ? { ...row, ...updates } : row))
    );
  };

  const handleCancel = () => {
    router.push(`/bumdes/marketplace/inventory/${id}`);
  };

  const handleSave = async () => {
    if (!product) return;
    const weightValue = weight.trim() ? Number(weight) : undefined;
    const parsedWeight = Number.isFinite(weightValue as number) ? weightValue : undefined;
    try {
      await update.mutateAsync({
        id: product.id,
        payload: {
          name: name.trim(),
          sku: sku.trim(),
          category: category || undefined,
          brand: brand.trim() || undefined,
          weight_kg: parsedWeight,
          description: description.trim(),
        },
      });
      if (editableVariants.length > 0) {
        await Promise.all(
          editableVariants.map((variant) => {
            const payload = {
              sku: variant.sku,
              stock: variant.stock,
              track_stock: variant.trackStock,
              ...(variant.price > 0
                ? { price_override: variant.price }
                : { clear_price_override: true }),
            };
            return variantActions.updateOption.mutateAsync({
              productId: id,
              optionId: variant.optionId,
              payload,
            });
          })
        );
      }
      if (pendingFiles.length > 0) {
        const hasPrimary = images.some(
          (image) => image.is_primary && image.id !== 0
        );
        await addImage.mutateAsync({
          id: product.id,
          file: pendingFiles[0],
          primary: !hasPrimary,
        });
        if (pendingFiles.length > 1) {
          await Promise.all(
            pendingFiles.slice(1).map((fileItem) =>
              addImage.mutateAsync({ id: product.id, file: fileItem })
            )
          );
        }
        setPendingFiles([]);
      }
      router.push(`/bumdes/marketplace/inventory/${id}`);
    } catch {
      // handled in mutation hooks
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Memuat produk...</p>;
  }

  if (isError || !product) {
    return <p className="text-sm text-red-500">Gagal memuat produk.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Produk</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Perbarui detail informasi produk {product.name}.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informasi Dasar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Produk
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SKU
              </label>
              <Input
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Merek
              </label>
              <Input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-indigo-600 focus:border-indigo-600">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.length > 0 ? (
              categoryOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Berat (kg)
              </label>
              <Input
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                step="0.1"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi
              </label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Media
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
            {images.length > 0 ? (
              images.map((image) => {
                const isPrimary = image.is_primary;
                const isLegacy = image.id === 0;
                return (
                  <div
                    key={`${image.id}-${image.url}`}
                    className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gray-400 h-10 w-10" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white rounded-full text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if (!product) return;
                          if (isLegacy) {
                            update.mutate({
                              id: product.id,
                              payload: { photo_url: "" },
                            });
                            return;
                          }
                          deleteImage.mutate({
                            id: product.id,
                            imageId: image.id,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!isPrimary && !isLegacy ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white rounded-full text-indigo-600 hover:bg-indigo-50"
                          onClick={() => {
                            if (!product) return;
                            setPrimaryImage.mutate({
                              id: product.id,
                              imageId: image.id,
                            });
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                    {isPrimary ? (
                      <div className="absolute bottom-1 left-1 bg-indigo-600 text-[10px] text-white px-1.5 py-0.5 rounded font-medium">
                        Utama
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="text-gray-400 h-10 w-10" />
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-600 transition-colors group"
            >
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 mb-1" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-indigo-600">
                Tambah
              </span>
            </Button>
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                if (selected.length > 0) {
                  setPendingFiles((prev) => [...prev, ...selected]);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>
          {pendingFiles.length > 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {pendingFiles.length} gambar baru siap diunggah saat menyimpan.
            </p>
          ) : null}
          <div
            className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              const dropped = Array.from(event.dataTransfer.files ?? []);
              if (dropped.length > 0) {
                setPendingFiles((prev) => [...prev, ...dropped]);
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
            <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tarik dan lepas gambar di sini
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Atau klik untuk memilih file dari komputer Anda (Maks. 5MB per file)
            </p>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Varian & Harga
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/bumdes/marketplace/inventory/${id}/variants`)}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Varian
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full text-left">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Varian
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    SKU Varian
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">
                    Stok
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Harga
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {editableVariants.map((variant) => (
                  <TableRow key={variant.optionId}>
                    <TableCell className="px-6 py-4">
                      <Input
                        value={variant.name}
                        readOnly
                        className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        value={variant.sku}
                        onChange={(event) =>
                          updateVariantRow(variant.optionId, {
                            sku: event.target.value,
                          })
                        }
                        className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariantRow(variant.optionId, {
                            stock: Number(event.target.value || 0),
                          })
                        }
                        className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          Rp
                        </span>
                        <Input
                          value={variant.price}
                          onChange={(event) =>
                            updateVariantRow(variant.optionId, {
                              price: Number(event.target.value || 0),
                            })
                          }
                          className="w-full pl-9 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => setPendingDeleteVariant(variant)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-8 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            Simpan Perubahan
          </Button>
        </div>

        <ConfirmActionDialog
          open={Boolean(pendingDeleteVariant)}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteVariant(null);
          }}
          title="Hapus Varian?"
          description="Varian yang dihapus tidak dapat dipulihkan."
          confirmLabel="Hapus Varian"
          onConfirm={async () => {
            if (!pendingDeleteVariant) return;
            await variantActions.archiveOption.mutateAsync({
              productId: id,
              optionId: pendingDeleteVariant.optionId,
            });
            setEditableVariants((prev) =>
              prev.filter((row) => row.optionId !== pendingDeleteVariant.optionId)
            );
            setPendingDeleteVariant(null);
          }}
          tone="destructive"
        />
      </div>
    </div>
  );
}
