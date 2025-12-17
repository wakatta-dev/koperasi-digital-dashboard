/** @format */

"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProductModal } from "./add-product-modal";
import { EditProductModal } from "./edit-product-modal";
import type { InventoryItem } from "../types";

const inventoryItems: InventoryItem[] = [
  {
    name: "Power Bank 20.000mAh AirTech",
    sku: "VD876543",
    category: "Elektronik",
    categoryClassName:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    stock: 113,
    price: "Rp35.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtENrWj9ToTvhJOo5s7u4H3UT0Q_BTLTdiZM2eI0jAkCzOTQWShrtqQM9hMG1r-kVECZwzUv7UCd9wVUupsmK_Rqng6Osy7XQrJNGBJLb9mqMdBW97xnZRO1ltRkdPOrZC2Vf9TUK9FTEUGS5Hpxz-I98NuAV-TpXjeDxP2Nix0C8bDYdP15WzXCuBmCsilZL0HZqTdqW7jSwsw8ZSo5SaWYC4cWXF0zhYnReO8dH18-z-ov33rig5Ozf-tkzPpnWPByJzt7Su3kA",
  },
  {
    name: "Keripik Pisang",
    sku: "BD345678",
    category: "Makanan & minuman",
    categoryClassName:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    stock: 231,
    price: "Rp150.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdLquF-7gZvHn7zOM5J_2C3xdmDWgScuEjJfEa3zSm5NpCBnfTjUKJuDXfWoQc_4mjLi2Qf0rZYSELm1GBz1oxva_1HVy4VDLlhmKD3R43RAV0FfPYHpbXcHzB3Yv_f2manq686gep79quH4xhIfNSKH8dhpinOdSBzesVBMSY6qb2Bgo_8_rw9gNgM_z4X8OytQ2I3Mi_wQdByvVC9BM1MP3vo-ZECUap2gC0oRgGLkZSLDxu4uB_g-KbEHFEOX2eISqtgdTI8u8",
  },
  {
    name: "Lipbalm",
    sku: "ELX562314",
    category: "Kesehatan & Kecantikan",
    categoryClassName:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    stock: 193,
    price: "Rp60.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJZ2AwzgCA8rORWp8CHSQWwRtbaCRHlUse67dCPL_IyNsDkzZmwNQxQux60tbdldVpxRtezTmtxFYaA3EuVftxbmeoda8mQPpnMHTwgGkZ3CupzeyNBdwgVO5IWKnCGpZdln76aA9K6jCBZe-dyVuUlVnmkNo7PBNGB0JVXXnt-lqrXuZRNslu99jKd5ZJtnOsD_orlXJLxVXmRA4G7UekCssvEUKSYdNV63TRNtBuvaNUewSv_s86XyZ-yzlk4Yf1M41I_oAf4ro",
  },
  {
    name: "Notebook A4",
    sku: "EON876543",
    category: "Office & Stationary",
    categoryClassName:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    stock: 183,
    price: "Rp50.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBZxsi6_8uaEDZoVq5rUcITCrNC14SkzoTj_prWH92wpU8HBpyQWtJMkaMTz_ExXQY-Q_S1jdyYzudav-uO5cLaxKqaepOf-8L3pH6y5efwcs6VkEmK6MQ6mIS7K7IhjfhyuqdEEvyF9Y6kVaRTvP4mfT33ay5cImgIQYYbfgoHbMNBltxaHBbTNgvh0tE_nUMWsI1YeenP7uFLZ6XHdUKwgVLf0M_n76gRhix2qvIYTJnNOmjKgMgudWa7txmxbdj0eq3eCJvJWU",
  },
  {
    name: "Sunscreen",
    sku: "MP345678",
    category: "Kesehatan & Kecantikan",
    categoryClassName:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    stock: 872,
    price: "Rp40.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMuSW9ktbMwrQQaeclaxwTVLixGd-z-T3Ij1XxVz1jHUDEXlv-k-oUVBwGlgmGLN0XNR00GcwSTjAX92iV_OD24naSDB8tasRE4DTmv4pBWpnIeROZT_cxlylH8KDA8z10ot7ND6Crb_JAxmOAAAosQug1qvs18ICFcbEi2kJ6hYp3ri9G93BGpwCbZxJ45L8tVDBRbZHezx8b57OrfAwJNV8F7gVc2k0h9OTfRJdGb8AJUuioBRzHyF2rteOTUzyrXgtSyMDcqs",
  },
  {
    name: "Velg Chrome",
    sku: "TW001245",
    category: "Otomotif",
    categoryClassName:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    stock: 2132,
    price: "Rp70.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZn-LwbtA9fJC_BYsv5eNrfzVSsEjTEtHguQwOfYYKj9sgXgtG24YwOeepkRc35WYPrHCLzkznQQ-p0rqYUG1C8wOHwmuP2YIkij5eIWaK0HYdqcyJW_XjrBx0LJZqC3AlCfRKjiudhRHlmC_R_EzSJdwMgD4t58NErNbSARl6kLCkOnP8FZ-toaokC8ciFgJYlBlo1qzl1WyVWypdc0P8FPoX0_-Z-s-gtFroA4NkZYsyCxb3lEGEP6fYg_EoySs8oOjcYn-oIZA",
  },
  {
    name: "TWS Airgone C12",
    sku: "XL567890",
    category: "Elektronik",
    categoryClassName:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    stock: 162,
    price: "Rp30.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtY2fqZweDh9-pLxgunrXJY3eBLF0BJHNpfus4TK01cukpTyuT3LewhCWYfBxeqXFqqphI8zWcFkwQL4LvF9UYPGsd3S_yM1UXTkh1NfLRFETD3WMWrrbv0679PqY9zXY4ZbGbXcqVU4jDtU06NBHDI7pvbtxQtAz0xqaT_zhTlJVXP7SVXsyuwVT_AqPpPRJtJrVDKF39l81YIZNMRLuT2XrN3T5HQFBLTH578Ghq8i6URrHEns21rGrHvVrBzdiXAWMjeuvnQWE",
  },
  {
    name: "Surveillance camera",
    sku: "LP987654",
    category: "Elektronik",
    categoryClassName:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    stock: 741,
    price: "Rp100.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb8lbMcOXcNQwhlkmuIfreTyY1yQlEZQPYcGrUwCakP3ehX2lsKwi88TLFx9Gi7-IimEN-bxfZDo7TeT4Qc-mNdWhML-SmK5cvXaFP1BbAnbEx2GZTbqu1ZqVybJpJmIr6AwqR1JLoz2tQ7Lp_U6MDrveIyvKZb6uV4qyO7yMOO0jUskXnv37IdzjGm33--1Szv0Uti3RoIyLS7FgcOuZBwXGrfolpQ_WZmTKD2cSPhFI09msCMqP9EdseOhjIC_30-6YYX4_1n5c",
  },
  {
    name: "Madu Murni",
    sku: "QT876543",
    category: "Kesehatan & Kecantikan",
    categoryClassName:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    stock: 421,
    price: "Rp30.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGEs7bS4wEehQ2sBCcC3r5EkjZTjD5pHvW3sXL6qMDe7r_-ZAf8xilt6zP4z7Olzo2VXPmBbZV64yVqVWj0a7cvOREKv-CSxQ_0ZG2vmnzqL3KCtN-05lxyZfUj7QZJK6ECmFet92II6E1gjjuym2cao0WWb1esxak8QfMx8j6e2h2IDfn8Xa8wjKOUpZof3m0-C5rbu4cuaW_TUbyHLoOHLkGYx5i69W8J2d0PitOmgLr06ybFn-b-m-W-xXn8o9AMfuWJxS2-U",
  },
];

export function InventoryPage() {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem>(
    inventoryItems[0]
  );

  return (
    <div className="w-full space-y-6 text-[#111827] dark:text-[#f8fafc] md:space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Inventaris</h1>
        <Button
          type="button"
          className="h-auto rounded-md border border-transparent bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nama produk atau SKU"
            className="rounded-md border-[#e5e7eb] bg-white pl-10 pr-3 text-sm leading-5 text-[#111827] placeholder-[#6b7280] transition-colors focus:border-[#4f46e5] focus:ring-[#4f46e5] dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#f8fafc] dark:placeholder-[#94a3b8]"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-auto rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-[#4f46e5] focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#334155]"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#334155]">
            <TableHeader className="bg-gray-50 dark:bg-slate-800/50">
              <TableRow className="border-0">
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Produk
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  SKU
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Kategori
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Stok
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                  Harga Jual
                </TableHead>
                <TableHead className="px-6 py-3" />
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
              {inventoryItems.map((item) => (
                <TableRow
                  key={`${item.sku}-${item.name}`}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded object-cover bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/bumdes/inventory/${item.sku}`}
                          className="text-sm font-medium text-[#111827] transition-colors hover:underline dark:text-white"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                    {item.sku}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.categoryClassName}`}
                    >
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                    {item.stock}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#111827] dark:text-white">
                    {item.price}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      className="text-[#6b7280] transition-colors hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white"
                      onClick={() => {
                        setEditingItem(item);
                        setEditOpen(true);
                      }}
                      aria-label="Edit produk"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end border-t border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              className="h-auto rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-sm font-medium text-[#4f46e5] dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#a5b4fc]"
            >
              1
            </Button>
            {[2, 3, 4, 5, 6].map((page) => (
              <Button
                key={page}
                type="button"
                variant="ghost"
                className="h-auto rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
              >
                {page}
              </Button>
            ))}
            <span className="px-2 text-[#6b7280] dark:text-[#94a3b8]">...</span>
            <Button
              type="button"
              variant="ghost"
              className="h-auto rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AddProductModal open={addOpen} onOpenChange={setAddOpen} />
      <EditProductModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={editingItem}
      />
    </div>
  );
}
