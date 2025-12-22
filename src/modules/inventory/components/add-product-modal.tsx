/** @format */

"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useInventoryActions } from "@/hooks/queries/inventory";
import type { CreateInventoryProductRequest } from "@/types/api/inventory";

type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  sku: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  cost_price: z.coerce
    .number()
    .min(0, "Harga beli tidak boleh negatif")
    .optional(),
  price_sell: z.coerce.number().positive("Harga jual harus lebih dari 0"),
  track_stock: z.boolean().default(true),
  initial_stock: z.coerce.number().min(0, "Stok awal minimal 0").default(0),
  min_stock: z.coerce.number().min(0, "Minimum stok minimal 0").default(0),
  show_in_marketplace: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function AddProductModal({ open, onOpenChange }: ModalBaseProps) {
  const { create, initialStock } = useInventoryActions();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      description: "",
      cost_price: 0,
      price_sell: 0,
      track_stock: true,
      initial_stock: 0,
      min_stock: 0,
      show_in_marketplace: false,
    },
  });

  const submitting = create.isPending || initialStock.isPending;
  const trackStock = form.watch("track_stock");

  const handleClose = (next: boolean) => {
    if (!next) {
      form.reset();
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: FormValues) => {
    const payload: CreateInventoryProductRequest = {
      name: values.name,
      price_sell: values.price_sell,
      track_stock: values.track_stock,
      category: values.category || undefined,
      cost_price: values.cost_price,
      sku: values.sku || undefined,
      description: values.description || undefined,
      min_stock: values.min_stock,
      show_in_marketplace: values.show_in_marketplace,
    };

    try {
      const product = await create.mutateAsync(payload);
      if (values.track_stock && values.initial_stock > 0) {
        await initialStock.mutateAsync({
          id: product.id,
          payload: { quantity: values.initial_stock, note: "Initial stock" },
        });
      }
      form.reset();
      onOpenChange(false);
    } catch {
      // handled in mutations
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogContent
          overlayClassName="bg-gray-900/50 backdrop-blur-sm"
          showCloseButton={false}
          className="pointer-events-auto w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-xl border border-[#e5e7eb] bg-white p-0 shadow-2xl sm:max-w-2xl dark:border-[#334155] dark:bg-[#1e293b]"
        >
          <div className="p-6 sm:p-6">
            <DialogTitle className="mb-6 text-left text-xl font-bold text-[#111827] dark:text-white">
              Tambahkan Produk
            </DialogTitle>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-2">
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                    Foto Produk
                  </label>
                  <div className="group mt-1 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 pt-5 pb-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="space-y-1 text-center text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-[#4f46e5] dark:text-indigo-400">
                        Unggah foto produk (opsional)
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        PNG atau JPG, maksimal 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama produk"
                          className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
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
                    <FormItem>
                      <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan SKU (opsional)"
                          className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-auto w-full rounded-md border-[#e5e7eb] bg-white py-2.5 text-sm text-gray-500 shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white">
                              <SelectValue placeholder="Pilih kategori produk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="min-w-full border-[#e5e7eb] bg-white text-[#111827] dark:border-[#334155] dark:bg-[#1e293b] dark:text-white">
                            <SelectItem value="elektronik">
                              Elektronik
                            </SelectItem>
                            <SelectItem value="makanan">
                              Makanan &amp; Minuman
                            </SelectItem>
                            <SelectItem value="kesehatan">
                              Kesehatan &amp; Kecantikan
                            </SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Beli</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                            {...field}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price_sell"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Jual</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="Masukkan harga jual"
                            className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                      <FormItem>
                        <FormLabel>Batas Minimum Stok</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Masukkan deskripsi produk"
                          className="rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                          {...field}
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
                    <FormItem className="flex items-center justify-between rounded-md border border-border px-3 py-3">
                      <FormLabel className="mb-0 text-sm font-medium text-[#111827] dark:text-white">
                        Lacak Stok
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(val) =>
                            field.onChange(Boolean(val))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initial_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok Awal</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Masukkan jumlah stok awal"
                          disabled={!trackStock}
                          className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                    <FormItem className="flex items-start gap-3 rounded-md border border-border px-3 py-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(val) =>
                            field.onChange(Boolean(val))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="mb-0 text-sm font-medium text-[#111827] dark:text-white">
                          Tampilkan di marketplace
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Hanya produk dengan harga & stok valid yang akan
                          muncul.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 rounded-b-xl border-t border-[#e5e7eb] bg-gray-50 px-6 py-4 dark:border-[#334155] dark:bg-[#1f2937]">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-[#374151] dark:text-gray-200 dark:hover:bg-[#475569]"
                    onClick={() => handleClose(false)}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Simpan Produk
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
