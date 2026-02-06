/** @format */

"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
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
import { useInventoryActions, useInventoryCategories } from "@/hooks/queries/inventory";

export function ProductCreatePage() {
  const router = useRouter();
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { create, addImage } = useInventoryActions();
  const { data: categoriesData } = useInventoryCategories();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const submitting = create.isPending || addImage.isPending;

  const resetForm = () => {
    setName("");
    setSku("");
    setBrand("");
    setCategory("");
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

    if (!payload.name) return;
    const weightValue = weight.trim() ? Number(weight) : undefined;
    const parsedWeight = Number.isFinite(weightValue as number) ? weightValue : undefined;

    try {
      const product = await create.mutateAsync({
        name: payload.name,
        sku: payload.sku || undefined,
        category: payload.category || undefined,
        brand: brand.trim() || undefined,
        weight_kg: parsedWeight,
        description: payload.description || undefined,
        price_sell: 0,
        track_stock: true,
        show_in_marketplace: false,
      });
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
      resetForm();
      router.push("/bumdes/marketplace/inventory");
    } catch {
      // handled in mutation hooks
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tambah Produk Baru
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambahkan informasi lengkap untuk produk baru Anda.
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
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            Simpan Produk
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <section className="surface-card p-6">
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
                placeholder="Masukkan nama produk"
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
                placeholder="Contoh: PROD-001"
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
                placeholder="Masukkan merek produk"
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
              {categoriesData && categoriesData.length > 0 ? (
                categoriesData.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
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
                placeholder="0.0"
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
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            Simpan Produk
          </Button>
        </div>
      </div>
    </div>
  );
}
