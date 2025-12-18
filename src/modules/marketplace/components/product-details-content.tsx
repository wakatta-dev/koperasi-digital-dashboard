/** @format */

import { PRODUCT_DETAIL } from "../constants";

export function ProductDetailsContent() {
  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <a className="border-[#4338ca] text-[#4338ca] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">
            Deskripsi Produk
          </a>
          <a
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            href="#"
          >
            Spesifikasi
          </a>
          <a
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            href="#"
          >
            Ulasan ({PRODUCT_DETAIL.rating.total})
          </a>
        </nav>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-7">
          {PRODUCT_DETAIL.longDescription.map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
          <h4 className="text-gray-900 dark:text-white font-bold text-base mb-2">Keunggulan Produk:</h4>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            {PRODUCT_DETAIL.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ulasan Pembeli</h3>
          <button className="text-[#4338ca] text-sm font-medium hover:underline">Lihat Semua</button>
        </div>

        <div className="space-y-6">
          {PRODUCT_DETAIL.reviews.map((review, index) => (
            <div
              key={review.name + index}
              className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${review.colorClass}`}
                  >
                    {review.initials}
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{review.name}</span>
                </div>
                <span className="text-xs text-gray-500">{review.timeAgo}</span>
              </div>
              <div className="flex text-yellow-400 text-xs mb-2">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span
                    key={starIndex}
                    className={`material-icons-outlined text-sm ${
                      starIndex < review.rating ? "fill-current" : "text-gray-300"
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          Tulis Ulasan
        </button>
      </div>
    </div>
  );
}
