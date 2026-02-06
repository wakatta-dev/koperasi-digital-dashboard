/** @format */

import Image from "next/image";
import { DEFAULT_LANDING_CONTENT } from "../constants";
import type { AdvantagesSection as AdvantagesSectionType } from "@/types/landing-page";

type AdvantagesProps = {
  advantages?: AdvantagesSectionType;
};

export function AdvantagesSection({ advantages }: AdvantagesProps) {
  const fallback = DEFAULT_LANDING_CONTENT.advantages;
  const data = {
    ...fallback,
    ...advantages,
    items:
      advantages?.items && advantages.items.length > 0 ? advantages.items : fallback.items,
  };
  const leftItems = data.items.filter((_, idx) => idx % 2 === 0);
  const rightItems = data.items.filter((_, idx) => idx % 2 === 1);
  return (
    <section className="py-24 bg-white dark:bg-surface-card-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block">
            Keunggulan
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {data.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-16">
            {leftItems.map((item) => (
              <div
                key={item.title}
                className="text-center lg:text-right flex flex-col items-center lg:items-end"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-900 dark:text-white">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative order-first lg:order-none mb-10 lg:mb-0">
            <Image
              src={data.image_url || fallback.image_url}
              alt="Jalan desa yang asri"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="space-y-16">
            {rightItems.map((item) => (
              <div
                key={item.title}
                className="text-center lg:text-left flex flex-col items-center lg:items-start"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-900 dark:text-white">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-16">
          <button className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Pelajari
          </button>
          <button className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white hover:text-brand-primary transition">
            Detail <span className="material-icons-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
