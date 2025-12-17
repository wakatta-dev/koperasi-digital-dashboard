/** @format */

import React from "react";
import { Pencil } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AssetItem } from "../types";

type AssetCardProps = AssetItem & {
  onClick?: () => void;
  onEdit?: () => void;
};

export function AssetCard({
  title,
  price,
  unit,
  image,
  alt,
  onClick,
  onEdit,
}: AssetCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
        "gap-0"
      )}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-base font-medium leading-snug text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-3 text-indigo-600 dark:text-indigo-400">
          {price}
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
