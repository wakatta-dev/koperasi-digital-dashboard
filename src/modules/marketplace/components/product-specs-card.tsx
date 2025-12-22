/** @format */

import type { MarketplaceProductDetail } from "../types";

export function ProductSpecsCard({ product }: { product: MarketplaceProductDetail }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Spesifikasi Produk</h3>
      <div className="space-y-4 text-sm">
        {product.specs.map((spec, index) => (
          <div
            key={spec.label}
            className={`flex justify-between ${index !== product.specs.length - 1 ? "border-b border-gray-100 dark:border-gray-700 pb-2" : "pb-2"}`}
          >
            <span className="text-gray-500">{spec.label}</span>
            <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
