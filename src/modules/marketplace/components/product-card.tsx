/** @format */

import { Button } from "@/components/ui/button";
import { MarketplaceProduct } from "../constants";

export function ProductCard({ product }: { product: MarketplaceProduct }) {
  const ctaLabel = product.ctaLabel ?? "Beli Sekarang";

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col group">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          alt={product.title}
          src={product.image}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        {product.badge ? (
          <div
            className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded shadow-sm ${
              product.badge.variant === "danger"
                ? "bg-red-500 text-white"
                : "bg-white/90 backdrop-blur text-[#4338ca]"
            }`}
          >
            {product.badge.label}
          </div>
        ) : null}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
          {product.category}
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-[#4338ca] transition">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[#4338ca] font-bold text-lg">{product.price}</span>
          <span className="text-xs text-gray-400">/ {product.unit}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <Button className="flex-1 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium py-2 rounded-lg transition h-auto">
            {ctaLabel}
          </Button>
          <Button
            variant="outline"
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition h-auto"
            title="Lihat Detail"
          >
            <span className="material-icons-outlined text-sm">visibility</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
