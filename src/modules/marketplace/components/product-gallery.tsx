/** @format */

import { PRODUCT_DETAIL } from "../constants";

const PLACEHOLDER_ICONS = ["image", "image", "videocam"];

export function ProductGallery() {
  const mainImage = PRODUCT_DETAIL.gallery.main;
  const thumbnails = PRODUCT_DETAIL.gallery.thumbnails;

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative group">
        <img
          alt={PRODUCT_DETAIL.title}
          src={mainImage}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        {PRODUCT_DETAIL.badge ? (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#4338ca] shadow-sm border border-gray-100 dark:border-gray-700">
            {PRODUCT_DETAIL.badge.label}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {thumbnails.map((thumb, index) => {
          const isFirst = index === 0;

          if (thumb) {
            return (
              <button
                key={thumb + index}
                className={`aspect-square rounded-xl overflow-hidden ${
                  isFirst
                    ? "border-2 border-[#4338ca] ring-2 ring-[#4338ca]/20"
                    : "border border-gray-200 dark:border-gray-700 hover:border-[#4338ca] transition opacity-70 hover:opacity-100"
                }`}
              >
                <img alt={`Thumbnail ${index + 1}`} src={thumb} className="w-full h-full object-cover" />
              </button>
            );
          }

          const icon = PLACEHOLDER_ICONS[index - 1] ?? "image";
          return (
            <button
              key={`placeholder-${index}`}
              className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#4338ca] transition opacity-70 hover:opacity-100"
            >
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                <span className="material-icons-outlined text-sm">{icon}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
