/** @format */

import React from "react";
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

type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddProductModal({ open, onOpenChange }: ModalBaseProps) {
  const [category, setCategory] = React.useState<string>();
  const [unit, setUnit] = React.useState<string>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                  Foto Produk
                </label>
                <div className="group mt-1 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 pt-5 pb-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <div className="space-y-1 text-center">
                    <div className="flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-[#4f46e5] dark:text-indigo-400">
                        Unggah Foto Produk (0/5)
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG atau JPEG
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        (Ukuran maksimal 2mb)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="add-product-name"
                >
                  Nama Produk
                </label>
                <Input
                  id="add-product-name"
                  placeholder="Masukkan nama produk"
                  className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="add-sku"
                >
                  SKU (Stock Keeping Unit)
                </label>
                <Input
                  id="add-sku"
                  placeholder="Masukkan SKU"
                  className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                    Kategori
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-auto w-full rounded-md border-[#e5e7eb] bg-white py-2.5 text-sm text-gray-500 shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white">
                      <SelectValue placeholder="Pilih kategori produk" />
                    </SelectTrigger>
                    <SelectContent className="min-w-full border-[#e5e7eb] bg-white text-[#111827] dark:border-[#334155] dark:bg-[#1e293b] dark:text-white">
                      <SelectItem value="elektronik">Elektronik</SelectItem>
                      <SelectItem value="makanan">Makanan &amp; Minuman</SelectItem>
                      <SelectItem value="kesehatan">
                        Kesehatan &amp; Kecantikan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                    Satuan
                  </label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="h-auto w-full rounded-md border-[#e5e7eb] bg-white py-2.5 text-sm text-gray-500 shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white">
                      <SelectValue placeholder="Pilih satuan" />
                    </SelectTrigger>
                    <SelectContent className="min-w-full border-[#e5e7eb] bg-white text-[#111827] dark:border-[#334155] dark:bg-[#1e293b] dark:text-white">
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="add-description"
                >
                  Deskripsi
                </label>
                <Textarea
                  id="add-description"
                  rows={3}
                  placeholder="Masukkan deskripsi terkait produk"
                  className="rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="add-buy-price"
                  >
                    Harga Beli
                  </label>
                  <Input
                    id="add-buy-price"
                    placeholder="Masukkan harga beli"
                    className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="add-sell-price"
                  >
                    Harga Jual
                  </label>
                  <Input
                    id="add-sell-price"
                    placeholder="Masukkan harga jual"
                    className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label
                  className="text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="add-track-stock"
                >
                  Lacak Stok
                </label>
                <Checkbox
                  id="add-track-stock"
                  className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="add-initial-stock"
                  >
                    Stok Awal
                  </label>
                  <Input
                    id="add-initial-stock"
                    type="number"
                    placeholder="Masukkan jumlah stok awal"
                    className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="add-min-stock"
                  >
                    Batas Minimum Stok
                  </label>
                  <Input
                    id="add-min-stock"
                    type="number"
                    placeholder="Masukkan batas minimum stok"
                    className="h-auto rounded-md border-[#e5e7eb] py-2.5 text-sm shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-end gap-3 rounded-b-xl border-t border-[#e5e7eb] bg-gray-50 px-6 py-4 dark:border-[#334155] dark:bg-[#1f2937]">
            <Button
              type="button"
              variant="outline"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-[#374151] dark:text-gray-200 dark:hover:bg-[#475569]"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Simpan Produk
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
