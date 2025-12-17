/** @format */

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
import { Edit3, X } from "lucide-react";
import type { InventoryItem } from "../types";

type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditModalProps = ModalBaseProps & {
  product: InventoryItem;
};

export function EditProductModal({
  open,
  onOpenChange,
  product,
}: EditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-[#111827] dark:text-white">
                  Foto Produk
                </label>
                <div className="group relative mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors hover:border-[#4f46e5] dark:border-gray-600">
                  <div className="w-full space-y-1 text-center">
                    <div className="relative mb-3 h-48 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Edit3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
                      <p className="font-medium text-[#4f46e5] dark:text-indigo-400">
                        Klik untuk ubah
                      </p>
                      <p className="mt-1 text-xs">PNG, JPG, GIF sampai 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:col-span-2 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-product-name"
                  >
                    Nama Produk
                  </label>
                  <Input
                    id="edit-product-name"
                    type="text"
                    defaultValue={product.name}
                    className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-sku"
                  >
                    SKU (Stock Keeping Unit)
                  </label>
                  <Input
                    id="edit-sku"
                    type="text"
                    defaultValue={product.sku}
                    className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-category"
                  >
                    Kategori
                  </label>
                  <Select defaultValue={product.category}>
                    <SelectTrigger className="mt-1 h-auto w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-full border-gray-300 bg-white text-[#111827] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                      <SelectItem value="Elektronik">Elektronik</SelectItem>
                      <SelectItem value="Makanan & minuman">
                        Makanan &amp; Minuman
                      </SelectItem>
                      <SelectItem value="Kesehatan & Kecantikan">
                        Kesehatan &amp; Kecantikan
                      </SelectItem>
                      <SelectItem value="Office & Stationary">
                        Office &amp; Stationary
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-unit"
                  >
                    Satuan
                  </label>
                  <Select defaultValue="Pcs">
                    <SelectTrigger className="mt-1 h-auto w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:border-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-full border-gray-300 bg-white text-[#111827] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white">
                      <SelectItem value="Pcs">Pcs</SelectItem>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Unit">Unit</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-6">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-description"
                  >
                    Deskripsi
                  </label>
                  <Textarea
                    id="edit-description"
                    rows={3}
                    defaultValue="Power bank dengan kapasitas real 20.000mAh, support fast charging PD 3.0 dan QC 3.0. Garansi resmi 1 tahun."
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-purchase-price"
                  >
                    Harga Beli
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <Input
                      id="edit-purchase-price"
                      type="text"
                      defaultValue="25.000"
                      className="h-auto rounded-md border-gray-300 pl-10 text-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-selling-price"
                  >
                    Harga Jual
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <Input
                      id="edit-selling-price"
                      type="text"
                      defaultValue="35.000"
                      className="h-auto rounded-md border-gray-300 pl-10 text-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6 border-t border-[#e5e7eb] pt-4 dark:border-[#334155]">
                  <div className="flex items-start">
                    <Checkbox
                      id="edit-track-stock"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5]"
                    />
                    <div className="ml-3 text-sm">
                      <label
                        className="font-medium text-[#111827] dark:text-white"
                        htmlFor="edit-track-stock"
                      >
                        Lacak Stok
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Aktifkan untuk melacak jumlah persediaan produk ini.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-initial-stock"
                  >
                    Stok Saat Ini
                  </label>
                  <Input
                    id="edit-initial-stock"
                    type="number"
                    defaultValue={product.stock}
                    className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    className="block text-sm font-medium text-[#111827] dark:text-white"
                    htmlFor="edit-min-stock"
                  >
                    Batas Minimum Stok
                  </label>
                  <Input
                    id="edit-min-stock"
                    type="number"
                    defaultValue={10}
                    className="mt-1 block h-auto w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-gray-600 dark:bg-[#1e293b] dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] bg-gray-50 px-4 py-3 dark:border-[#334155] dark:bg-[#1e293b] sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Simpan Perubahan
            </Button>
            <Button
              type="button"
              variant="outline"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#334155] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
