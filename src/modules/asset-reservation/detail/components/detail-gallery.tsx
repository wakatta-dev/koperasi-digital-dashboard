/** @format */

import type { AssetStatus } from "../../types";

const STATUS_STYLES: Record<AssetStatus, { label: string; className: string }> = {
  available: { label: "Tersedia", className: "bg-green-500" },
  rented: { label: "Disewa", className: "bg-red-500" },
  maintenance: { label: "Perawatan", className: "bg-yellow-500" },
};

type DetailGalleryProps = {
  heroImage: string;
  thumbnails: string[];
  status: AssetStatus;
  title: string;
};

export function DetailGallery({ heroImage, thumbnails, status, title }: DetailGalleryProps) {
  const badgeStyle = STATUS_STYLES[status];

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        <div
          className={`${badgeStyle.className} absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}
        >
          {badgeStyle.label}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {thumbnails.map((thumb, index) => {
          if (thumb === "placeholder") {
            return (
              <button
                key={`thumb-placeholder-${index}`}
                className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#4338ca] dark:hover:border-[#4338ca] transition opacity-70 hover:opacity-100"
              >
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <span className="material-icons-outlined">image</span>
                </div>
              </button>
            );
          }

          if (thumb === "more") {
            return (
              <button
                key="thumb-more"
                className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#4338ca] dark:hover:border-[#4338ca] transition opacity-70 hover:opacity-100 relative"
              >
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <span className="material-icons-outlined">image</span>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                  +3 Foto
                </div>
              </button>
            );
          }

          return (
            <button
              key={thumb}
              className="aspect-video rounded-xl overflow-hidden border-2 border-[#4338ca] ring-2 ring-[#4338ca]/20"
            >
              <img src={thumb} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
