/** @format */

"use client";

import { Button } from "@/components/ui/button";
import type { GuestAssetCategoryChip } from "../../types";

type AssetCategoryChipsProps = Readonly<{
  items: ReadonlyArray<GuestAssetCategoryChip>;
  selectedKey: string;
  onSelect: (key: string) => void;
}>;

function toneClasses(tone: GuestAssetCategoryChip["tone"]) {
  switch (tone) {
    case "orange":
      return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white";
    case "blue":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white";
    case "emerald":
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white";
    case "purple":
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white";
    default:
      return "bg-white/20 text-white";
  }
}

export function AssetCategoryChips({
  items,
  selectedKey,
  onSelect,
}: AssetCategoryChipsProps) {
  return (
    <div className="mb-10 overflow-x-auto p-4 no-scrollbar">
      <div className="flex gap-4 min-w-max">
        {items.map((chip) => {
          const active = chip.key === selectedKey;
          return (
            <Button
              key={chip.key}
              type="button"
              variant="ghost"
              onClick={() => onSelect(chip.key)}
              className={
                active
                  ? "flex h-auto min-h-24 flex-col items-center gap-3 p-4 w-32 rounded-2xl bg-brand-primary text-white shadow-lg shadow-indigo-600/30 transform scale-105 transition-transform"
                  : "flex h-auto min-h-24 flex-col items-center gap-3 p-4 w-32 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 group transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm"
              }
            >
              <div
                className={
                  active
                    ? "w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                    : `w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${toneClasses(
                        chip.tone,
                      )}`
                }
              >
                <span className="material-icons-outlined">{chip.icon}</span>
              </div>
              <span
                className={
                  active
                    ? "text-sm font-bold text-center leading-tight"
                    : "text-sm font-semibold text-center leading-tight text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                }
              >
                {chip.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
