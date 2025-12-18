/** @format */

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";

type ProductDetail = {
  name: string;
  sku: string;
  category: string;
  unit: string;
  description: string;
  purchasePrice: string;
  salePrice: string;
  trackStock: boolean;
  initialStock: number | string;
  minStock: number | string;
  image: string;
};

const product: ProductDetail = {
  name: "Smartwacth B80 AirGone",
  sku: "HT998765",
  category: "Elektronik",
  unit: "pcs",
  description: "Smartwacth B80 AirGone",
  purchasePrice: "Rp175.000",
  salePrice: "Rp350.000",
  trackStock: true,
  initialStock: 169,
  minStock: 20,
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDR2tyBNK8Uhn9FKFgYvi1ZYQgtnnPyFf6hgUkdwYMkG8gTq2Ke6eT8WsoBSXpQY81hIa-x3tphqCYEIImz5LoClrwVzHkoLuaTQ60iK3nImaZ_zviEm6aBaFpaFzeI2zIgU8O_Vg804tNFJn0zixEKuVkNfDI8K92IXBgoI-lAIwCR4RxXzX_fwCXaKN_7XpFkqvcy3tGcQYxbOhWnQy3_gPztTD7FLFjCjcQFtx1gKuEUau22TM36H2YsRcf71fDi1quuYo5N_zI",
};

export function InventoryDetailPage() {
  return (
    <div className="w-full space-y-6 md:space-y-8 text-[#111827] dark:text-[#f8fafc]">
      <div className="flex items-center gap-2 text-sm text-[#6b7280] dark:text-[#94a3b8]">
        <a
          className="font-medium text-[#6b7280] transition-colors hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-[#a5b4fc]"
          href="#"
        >
          Inventaris
        </a>
        <ChevronRight className="h-4 w-4 text-gray-400" strokeWidth={2} />
        <a
          className="font-medium text-[#4f46e5] underline-offset-2 hover:underline dark:text-[#a5b4fc]"
          href="#"
        >
          Detail Produk
        </a>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
          Detail Produk
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
        <div className="p-8">
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">
              Foto Produk
            </label>
            <div className="mt-1">
              <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] dark:border-[#334155] dark:bg-[#1f2937]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 border-t border-[#f3f4f6] pt-8 dark:border-[#1f2937] md:grid-cols-2">
            <div className="md:col-span-2">
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Nama Produk
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.name}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                SKU (Stock Keeping Unit)
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.sku}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Kategori
              </h3>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {product.category}
              </span>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Satuan
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.unit}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Deskripsi
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.description}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-[#f3f4f6] pt-8 dark:border-[#1f2937] md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Harga Beli
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.purchasePrice}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Harga Jual
              </h3>
              <p className="text-lg font-medium text-[#111827] dark:text-white">
                {product.salePrice}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#f3f4f6] pt-8 dark:border-[#1f2937]">
            <div className="mb-6 flex items-center">
              <h3 className="mr-24 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                Lacak Stok
              </h3>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="track-stock"
                    className="h-5 w-5 rounded border-gray-300 text-[#4f46e5] focus-visible:ring-[#4f46e5] dark:border-[#4b5563] dark:bg-[#374151]"
                    checked={product.trackStock}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                  Stok Awal
                </h3>
                <p className="text-lg font-medium text-[#111827] dark:text-white">
                  {product.initialStock}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-normal text-[#6b7280] dark:text-[#94a3b8]">
                  Batas Minimum Stok
                </h3>
                <p className="text-lg font-medium text-[#111827] dark:text-white">
                  {product.minStock}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
