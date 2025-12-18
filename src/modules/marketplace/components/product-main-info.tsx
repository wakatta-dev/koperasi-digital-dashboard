/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_DETAIL } from "../constants";

export function ProductMainInfo() {
  const [quantity, setQuantity] = useState(1);

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => prev + 1);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 flex-grow">
      <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-[#4338ca] dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-md">
            {PRODUCT_DETAIL.categoryTag}
          </span>
          <span className="flex items-center text-yellow-500 text-sm font-medium gap-1">
            <span className="material-icons-outlined text-base fill-current">star</span>
            {PRODUCT_DETAIL.rating.value} ({PRODUCT_DETAIL.rating.total} Ulasan)
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
          {PRODUCT_DETAIL.title}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img alt="Seller" className="h-full w-full object-cover" src={PRODUCT_DETAIL.seller.avatar} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{PRODUCT_DETAIL.seller.name}</p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
              <span className="material-icons-outlined text-sm">location_on</span>
              {PRODUCT_DETAIL.seller.location}
            </div>
          </div>
          <Button
            variant="outline"
            className="ml-auto text-[#4338ca] border-[#4338ca] px-3 py-1 rounded-full hover:bg-[#4338ca]/5 transition h-auto"
          >
            Kunjungi Toko
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <span className="text-3xl font-bold text-[#4338ca]">{PRODUCT_DETAIL.price}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
            {PRODUCT_DETAIL.originalPrice}
          </span>
          <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded ml-2">
            {PRODUCT_DETAIL.discountNote}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{PRODUCT_DETAIL.shortDescription}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {PRODUCT_DETAIL.variantLabel}
            </label>
            <Select defaultValue="whole-bean">
              <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:ring-[#4338ca]/40 focus-visible:border-[#4338ca] text-sm h-11">
                <SelectValue placeholder="Pilih varian" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                <SelectItem value="whole-bean">Biji Utuh (Whole Bean)</SelectItem>
                <SelectItem value="cold-brew">Giling Kasar (Cold Brew)</SelectItem>
                <SelectItem value="v60">Giling Medium (V60)</SelectItem>
                <SelectItem value="espresso">Giling Halus (Espresso/Tubruk)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jumlah</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit overflow-hidden">
              <button
                type="button"
                onClick={decrease}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600"
              >
                <span className="material-icons-outlined text-sm">remove</span>
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-none focus:ring-0 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
              <button
                type="button"
                onClick={increase}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600"
              >
                <span className="material-icons-outlined text-sm">add</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{PRODUCT_DETAIL.stock}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1 bg-[#4338ca] hover:bg-[#3730a3] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 h-auto">
            <span className="material-icons-outlined text-xl">shopping_bag</span>
            Beli Sekarang
          </Button>
          <Button
            variant="outline"
            className="flex-1 border border-[#4338ca] text-[#4338ca] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 h-auto"
          >
            <span className="material-icons-outlined text-xl">add_shopping_cart</span>
            + Keranjang
          </Button>
          <Button
            variant="outline"
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-500 hover:text-red-500 h-auto"
            title="Tambah ke Wishlist"
          >
            <span className="material-icons-outlined text-xl">favorite</span>
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-start gap-3 mt-6">
          <span className="material-icons-outlined text-gray-500">local_shipping</span>
          <div className="text-sm">
            <p className="font-bold text-gray-900 dark:text-white">Pengiriman dari Desa Sukamaju</p>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Estimasi tiba 2 - 4 hari ke alamat tujuan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
