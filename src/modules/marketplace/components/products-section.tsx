/** @format */

import { DISPLAY_META, PRODUCTS, SORT_OPTIONS } from "../constants";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

export function ProductsSection() {
  return (
    <div className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {DISPLAY_META.start} - {DISPLAY_META.end}
          </span>{" "}
          dari {DISPLAY_META.total} produk
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Urutkan:</span>
          <select className="text-sm border-none bg-transparent font-medium text-gray-900 dark:text-white focus:ring-0 cursor-pointer">
            {SORT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}
