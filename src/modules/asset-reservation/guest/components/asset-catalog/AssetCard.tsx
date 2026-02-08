/** @format */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GuestAssetCardItem } from "../../types";

type AssetCardProps = Readonly<{
  item: GuestAssetCardItem;
  onSelect?: (id: number | null) => void;
  selected?: boolean;
}>;

function statusClasses(tone: GuestAssetCardItem["statusTone"]) {
  switch (tone) {
    case "available":
      return "bg-emerald-500 text-white";
    case "maintenance":
      return "bg-amber-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function categoryChipClasses(category: string) {
  const key = category.toLowerCase();
  if (key.includes("tani"))
    return "text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50";
  if (key.includes("prop"))
    return "text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
  if (key.includes("trans"))
    return "text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
  if (key.includes("perleng"))
    return "text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50";
  return "text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700";
}

export function AssetCard({ item, onSelect, selected }: AssetCardProps) {
  return (
    <Card
      className={
        selected
          ? "bg-white dark:bg-surface-card-dark rounded-3xl overflow-hidden border-2 border-brand-primary ring-4 ring-brand-primary/5 shadow-2xl relative group"
          : "bg-white dark:bg-surface-card-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
      }
    >
      {selected ? (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      ) : null}
      <div className="relative h-64 overflow-hidden">
        <img
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          src={item.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border flex items-center gap-1 ${categoryChipClasses(
              item.category,
            )}`}
          >
            <span className="material-icons-outlined text-sm">category</span>{" "}
            {item.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 ${statusClasses(
              item.statusTone,
            )}`}
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />{" "}
            {item.statusLabel}
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div>
            <span className="block text-xs text-gray-400 mb-0.5">
              Mulai dari
            </span>
            <span className="text-lg font-bold text-brand-primary">
              {item.priceLabel}
              <span className="text-xs font-medium text-gray-400">
                {item.unitLabel}
              </span>
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSelect?.(item.id)}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-brand-primary hover:text-white flex items-center justify-center transition-colors text-gray-400 dark:text-gray-500"
          >
            <span className="material-icons-outlined">arrow_forward</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
