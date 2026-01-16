/** @format */

"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
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
  const hasVariants = product?.product?.has_variants ?? false;
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
      track_stock: values.track_stock,
      min_stock: values.min_stock,
      show_in_marketplace: values.show_in_marketplace,
    };
    if (!hasVariants) {
      payload.price_sell = values.price_sell;
    }

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
          showCloseButton={false}
          className="pointer-events-auto w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-xl p-0 sm:max-w-2xl"
        >
          <div className="border-b border-border bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium leading-6 text-foreground">
                Edit Produk
              </DialogTitle>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
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
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Foto Produk
                  </label>
                  <div className="group relative mt-1 flex flex-col gap-3 rounded-md border-2 border-dashed border-border px-6 py-4">
                    <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={product?.name || "Produk"}
                          fill
                          sizes="(min-width: 768px) 20rem, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
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
                            className="mt-1 block h-auto w-full rounded-md py-2.5 sm:text-sm"
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
                            className="mt-1 block h-auto w-full rounded-md py-2.5 sm:text-sm"
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
                            <SelectTrigger className="mt-1 h-auto w-full rounded-md px-3 py-2 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="min-w-full border-border bg-popover text-foreground">
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
                            className="mt-1 block w-full rounded-md sm:text-sm"
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
                            className="h-auto rounded-md py-2.5 text-sm"
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
                            disabled={hasVariants}
                            className="h-auto rounded-md py-2.5 text-sm"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        {hasVariants ? (
                          <p className="text-xs text-amber-600">
                            Pricing dikelola per varian.
                          </p>
                        ) : null}
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
                            className="h-auto rounded-md py-2.5 text-sm"
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
                      <FormLabel className="block text-sm font-medium text-foreground">
                        Lacak Stok
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(Boolean(val))}
                          className="h-4 w-4 rounded"
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
                            className="mt-1 block h-auto w-full rounded-md py-2.5 sm:text-sm"
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
                          className="h-4 w-4 rounded"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="mb-0 text-sm font-medium text-foreground">
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

                <div className="md:col-span-3 border-t border-border bg-muted/40 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Simpan Perubahan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
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
