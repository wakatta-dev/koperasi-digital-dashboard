/** @format */

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HERO_CONTENT } from "../constants";

type AssetHeroSectionProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
};

export function AssetHeroSection({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}: AssetHeroSectionProps) {
  return (
    <div className="relative bg-white dark:bg-surface-card-dark border-b border-gray-200 dark:border-gray-800">
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
        <Image
          src={HERO_CONTENT.backgroundPattern}
          alt="Background pattern"
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-brand-primary font-semibold text-xs uppercase tracking-wide mb-4">
            {HERO_CONTENT.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {HERO_CONTENT.description}
          </p>

          <div className="bg-white dark:bg-surface-card-dark p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-icons-outlined">search</span>
              </span>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearchSubmit();
                  }
                }}
                placeholder={HERO_CONTENT.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus-visible:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-[48px]"
              />
            </div>
            <div className="sm:border-l border-gray-200 dark:border-gray-700 sm:pl-2">
              <Button
                onClick={onSearchSubmit}
                className="w-full sm:w-auto bg-brand-primary hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/30 h-[48px] flex items-center justify-center gap-2"
              >
                Cari Aset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
