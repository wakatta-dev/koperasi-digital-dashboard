/** @format */

import { PRODUCT_DETAIL } from "../constants";

export function CartRecommendations() {
  const recommendations = PRODUCT_DETAIL.related;

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mungkin Anda Suka</h2>
        <a className="text-[#4338ca] font-medium hover:underline text-sm flex items-center gap-1" href="#">
          Lihat Semua <span className="material-icons-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                alt={product.title}
                src={product.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {product.badge ? (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-[#4338ca] shadow-sm">
                  {product.badge.label}
                </div>
              ) : null}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{product.category}</div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-[#4338ca] transition">
                {product.title}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[#4338ca] font-bold text-lg">{product.price}</span>
                <span className="text-xs text-gray-400">/ {product.unit}</span>
              </div>
              <button className="w-full mt-3 bg-white border border-[#4338ca] text-[#4338ca] hover:bg-[#4338ca] hover:text-white text-sm font-medium py-2 rounded-lg transition flex items-center justify-center gap-1">
                <span className="material-icons-outlined text-base">add_shopping_cart</span> Tambah
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
