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
  const hasImage = Boolean(image);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm transition-shadow hover:shadow-md",
        "gap-0"
      )}
    >
      <div className="relative h-48 overflow-hidden">
        {hasImage ? (
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            Tidak ada foto
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-background"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-base font-medium leading-snug text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-primary">
          {price}
          <span className="text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
