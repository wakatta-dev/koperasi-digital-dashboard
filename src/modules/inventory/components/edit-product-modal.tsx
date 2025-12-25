/** @format */

"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useInventoryActions } from "@/hooks/queries/inventory";
import type { InventoryItem } from "../types";
import type { UpdateInventoryProductRequest } from "@/types/api/inventory";

type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditModalProps = ModalBaseProps & {
  product: InventoryItem | null;
};

const formSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  sku: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  cost_price: z.coerce.number().min(0, "Harga beli tidak boleh negatif").optional(),
  price_sell: z.coerce.number().positive("Harga jual harus lebih dari 0"),
  track_stock: z.boolean().default(true),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").default(0),
  min_stock: z.coerce.number().min(0, "Minimum stok minimal 0").default(0),
  show_in_marketplace: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function EditProductModal({
  open,
  onOpenChange,
  product,
}: EditModalProps) {
  const { update, adjustStock, uploadImage } = useInventoryActions();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      category: product?.category ?? "",
      description: product?.description ?? "",
      cost_price: product?.costPrice ?? 0,
      price_sell: product?.price ?? 0,
      track_stock: product?.trackStock ?? true,
      stock: product?.stock ?? 0,
      min_stock: product?.minStock ?? 0,
      show_in_marketplace: product?.showInMarketplace ?? false,
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        category: product.category ?? "",
        description: product.description ?? "",
        cost_price: product.costPrice ?? 0,
        price_sell: product.price,
        track_stock: product.trackStock,
        stock: product.stock,
        min_stock: product.minStock ?? 0,
        show_in_marketplace: product.showInMarketplace,
      });
      setPhotoUrl(product.image ?? "");
      setSelectedFile(null);
      setImageError(null);
    }
  }, [product, form]);

  const submitting =
    update.isPending || adjustStock.isPending || uploadImage.isPending;
  const trackStock = form.watch("track_stock");

  const handleClose = (next: boolean) => {
    if (!next) {
      form.reset();
      setSelectedFile(null);
      setPhotoUrl(product?.image ?? "");
      setImageError(null);
    }
    onOpenChange(next);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
    setImageError(null);
  };

  const handleImageUpload = async () => {
    if (!product || !selectedFile) return;
    setImageError(null);
    try {
      const updated = await uploadImage.mutateAsync({
        id: product.id,
        file: selectedFile,
      });
      setPhotoUrl(updated.photo_url ?? "");
      setSelectedFile(null);
    } catch (err) {
      setImageError((err as Error)?.message || "Gagal mengunggah foto produk.");
    }
  };

  const handleSaveImageUrl = async () => {
    if (!product) return;
    const trimmed = photoUrl.trim();
    if (!trimmed) {
      setImageError("URL foto wajib diisi.");
      return;
    }
    setImageError(null);
    try {
      const updated = await update.mutateAsync({
        id: product.id,
        payload: { photo_url: trimmed },
      });
      setPhotoUrl(updated.photo_url ?? trimmed);
    } catch (err) {
      setImageError((err as Error)?.message || "Gagal menyimpan URL foto.");
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!product) return;
    const payload: UpdateInventoryProductRequest = {
      name: values.name,
      sku: values.sku,
      category: values.category,
      description: values.description,
      cost_price: values.cost_price,
      price_sell: values.price_sell,
      track_stock: values.track_stock,
      min_stock: values.min_stock,
      show_in_marketplace: values.show_in_marketplace,
    };

    try {
      await update.mutateAsync({ id: product.id, payload });
      const desiredStock = Number(values.stock);
      if (values.track_stock && desiredStock !== product.stock) {
        await adjustStock.mutateAsync({
          id: product.id,
          payload: { physical_count: desiredStock, note: "Stock update" },
        });
      }
      onOpenChange(false);
    } catch {
      // handled in mutations
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogContent
          overlayClassName="bg-gray-500/75"
          showCloseButton={false}
          className="pointer-events-auto w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-xl border border-[#e5e7eb] bg-white p-0 shadow-2xl sm:max-w-2xl dark:border-[#334155] dark:bg-[#1e293b]"
        >
          <div className="border-b border-[#e5e7eb] bg-white px-4 pt-5 pb-4 dark:border-[#334155] dark:bg-[#1e293b] sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium leading-6 text-[#111827] dark:text-white">
                Edit Produk
              </DialogTitle>
              <button
                className="text-gray-400 transition-colors hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => onOpenChange(false)}
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 overflow-y-auto">
            <Form {...form}>
              <form className="grid grid-cols-1 gap-6 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="md:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                    Foto Produk
                  </label>
                  <div className="group relative mt-1 flex flex-col gap-3 rounded-md border-2 border-dashed border-gray-300 px-6 py-4 transition-colors hover:border-[#4f46e5] dark:border-gray-600">
                    <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={product?.name || "Produk"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                          Belum ada foto
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      disabled={submitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImageUpload}
                      disabled={!selectedFile || submitting}
                    >
                      Unggah Foto
                    </Button>
                    {selectedFile ? (
                      <p className="text-xs text-muted-foreground">
                        Siap diunggah: {selectedFile.name}
                      </p>
                    ) : null}
                    <Input
                      type="url"
                      placeholder="Tempel URL foto (opsional)"
                      value={photoUrl}
                      onChange={(event) => {
                        setPhotoUrl(event.target.value);
                        setImageError(null);
                      }}
                      disabled={submitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveImageUrl}
                      disabled={!photoUrl.trim() || submitting}
                    >
                      Simpan URL Foto
                    </Button>
                    {imageError ? (
                      <p className="text-xs text-destructive">{imageError}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:col-span-2 sm:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Nama Produk</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Kategori</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="mt-1 h-auto w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="min-w-full border-gray-300 bg-white text-[#111827] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                            <SelectItem value="elektronik">Elektronik</SelectItem>
                            <SelectItem value="makanan">Makanan &amp; Minuman</SelectItem>
                            <SelectItem value="kesehatan">Kesehatan &amp; Kecantikan</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Harga Beli</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="h-auto rounded-md border-gray-300 py-2.5 text-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_sell"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Harga Jual</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="h-auto rounded-md border-gray-300 py-2.5 text-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_stock"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Batas Minimum Stok</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="h-auto rounded-md border-gray-300 py-2.5 text-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="track_stock"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel className="block text-sm font-medium text-[#111827] dark:text-white">
                          Lacak Stok
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(val) => field.onChange(Boolean(val))}
                            className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Stok Saat Ini</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            disabled={!trackStock}
                            className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="show_in_marketplace"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6 flex items-start gap-3 rounded-md border border-border px-3 py-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(val) => field.onChange(Boolean(val))}
                            className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="mb-0 text-sm font-medium text-[#111827] dark:text-white">
                            Tampilkan di marketplace
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Produk harus aktif, stok tersedia, dan harga di atas 0.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-3 border-t border-[#e5e7eb] bg-gray-50 px-4 py-3 dark:border-[#334155] dark:bg-[#1e293b] sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Simpan Perubahan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#334155] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleClose(false)}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
