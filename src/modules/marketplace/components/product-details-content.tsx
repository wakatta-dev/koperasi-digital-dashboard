/** @format */

import { MarketplaceProductDetail } from "../constants";

export function ProductDetailsContent({
  product,
}: {
  product: MarketplaceProductDetail;
}) {
  const hasDescription = product.longDescription.length > 0;
  const hasFeatures = product.features.length > 0;
  const hasReviews = product.reviews.length > 0;
  if (!hasDescription && !hasFeatures && !hasReviews) return null;

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="border-b border-border">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <a
            className="border-indigo-500 text-indigo-600 dark:text-indigo-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            href="#"
          >
            Deskripsi Produk
          </a>
          <a
            className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            href="#"
          >
            Spesifikasi
          </a>
          <a
            className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            href="#"
          >
            Ulasan ({product.rating.total})
          </a>
        </nav>
      </div>

      {(hasDescription || hasFeatures) && (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm leading-7">
            {product.longDescription.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
            {hasFeatures ? (
              <>
                <h4 className="text-foreground font-bold text-base mb-2">
                  Keunggulan Produk:
                </h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}

      {hasReviews ? (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-foreground">
              Ulasan Pembeli
            </h3>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div
                key={review.name + index}
                className="border-b border-border pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${review.colorClass}`}
                    >
                      {review.initials}
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      {review.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.timeAgo}
                  </span>
                </div>
                <div className="flex text-yellow-400 text-xs mb-2">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={`material-icons-outlined text-sm ${
                        starIndex < review.rating
                          ? "fill-current"
                          : "text-muted-foreground"
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">
            Tulis Ulasan
          </button>
        </div>
      ) : null}
    </div>
  );
}
