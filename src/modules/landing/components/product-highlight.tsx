/** @format */

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_CONTENT, PRODUCT_HIGHLIGHT } from "../constants";
import type { FeaturedProductSection } from "@/types/landing-page";

type ProductHighlightProps = {
  featuredProduct?: FeaturedProductSection;
};

export function ProductHighlight({ featuredProduct }: ProductHighlightProps) {
  const fallback = DEFAULT_LANDING_CONTENT.featured_product;
  const data = { ...fallback, ...featuredProduct };
  return (
    <section className="py-20 bg-[#f8fafc] dark:bg-[#0f172a]" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {data.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {data.description}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[400px] lg:h-auto relative">
              <Image
                src={data.image_url || PRODUCT_HIGHLIGHT.image}
                alt="Kopi Premium Biji"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-10 lg:p-20 flex flex-col justify-center">
              <span className="text-[#4338ca] font-bold tracking-wider uppercase mb-4 text-sm">
                {PRODUCT_HIGHLIGHT.category}
              </span>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {data.display_title || data.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                {data.display_description || PRODUCT_HIGHLIGHT.description}
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="px-8 py-3 bg-white border border-gray-300 dark:bg-transparent dark:border-gray-500 text-gray-900 dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                >
                  {data.cta_label || "Beli sekarang"}
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-900 dark:text-white font-medium px-4 py-3 hover:text-[#4338ca] transition"
                >
                  Detail <span className="material-icons-outlined">arrow_forward</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
