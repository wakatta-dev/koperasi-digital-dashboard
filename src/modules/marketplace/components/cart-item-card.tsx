/** @format */

import { CART_ITEMS } from "../constants";

export function CartItemCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Daftar Produk</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">2 Item Terpilih</span>
        </div>

        {CART_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 mb-8 last:mb-0`}
          >
            <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative group">
              <img
                alt={item.title}
                src={item.image}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <a className="font-bold text-lg text-gray-900 dark:text-white hover:text-[#4338ca] transition line-clamp-2" href="#">
                    {item.title}
                  </a>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-icons-outlined text-sm text-gray-400">storefront</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.store}</span>
                  </div>
                  {item.variant ? (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-fit">
                      Varian: {item.variant}
                    </div>
                  ) : null}
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="block font-bold text-lg text-gray-900 dark:text-white">{item.price}</span>
                  {item.originalPrice ? (
                    <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden h-9">
                    <button className="px-3 h-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 transition">
                      <span className="material-icons-outlined text-sm">remove</span>
                    </button>
                    <input
                      className="w-10 h-full text-center border-none focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-sm p-0"
                      type="text"
                      value={item.quantity}
                      readOnly
                    />
                    <button className="px-3 h-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 transition">
                      <span className="material-icons-outlined text-sm">add</span>
                    </button>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500 transition flex items-center gap-1 text-sm font-medium"
                    title="Hapus item"
                  >
                    <span className="material-icons-outlined text-lg">delete</span>
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Subtotal</span>
                  <span className="font-bold text-[#4338ca] dark:text-indigo-400 text-lg">{item.subtotal}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
