/** @format */

import Image from "next/image";
import { MarketplaceProductDetail } from "../constants";

const PLACEHOLDER_ICONS = ["image", "image", "videocam"];

export function ProductGallery({
  product,
}: {
  product: MarketplaceProductDetail;
}) {
  const mainImage = product.gallery.main;
  const thumbnails = product.gallery.thumbnails;

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-card rounded-2xl overflow-hidden border border-border shadow-sm relative group">
        {mainImage ? (
          <Image
            alt={product.title}
            src={mainImage}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
            Tidak ada foto
          </div>
        )}
        {product.badge ? (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-border">
            {product.badge.label}
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
                    ? "border-2 border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border border-border hover:border-indigo-500 transition opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    alt={`Thumbnail ${index + 1}`}
                    src={thumb}
                    fill
                    sizes="(min-width: 1024px) 10vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </button>
            );
          }

          const icon = PLACEHOLDER_ICONS[index - 1] ?? "image";
          return (
            <button
              key={`placeholder-${index}`}
              className="aspect-square rounded-xl overflow-hidden border border-border hover:border-indigo-500 transition opacity-70 hover:opacity-100"
            >
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                <span className="material-icons-outlined text-sm">{icon}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
