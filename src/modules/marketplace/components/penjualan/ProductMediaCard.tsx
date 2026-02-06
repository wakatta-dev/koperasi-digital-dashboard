/** @format */

"use client";

import { useState } from "react";
import { Expand, Laptop } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type ProductMediaCardProps = Readonly<{
  name: string;
  images: string[];
}>;

export function ProductMediaCard({ name, images }: ProductMediaCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const activeImage = images[activeIndex];

  return (
    <div className="surface-table p-6">
      <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 relative group">
        {activeImage ? (
          <img src={activeImage} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Laptop className="h-16 w-16 text-gray-400" />
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            className="p-2 bg-white/90 rounded-full shadow-sm text-gray-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
            type="button"
            onClick={() => {
              if (activeImage) setPreviewOpen(true);
            }}
            disabled={!activeImage}
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.length > 0 ? (
          images.slice(0, 4).map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={
                index === activeIndex
                  ? "aspect-square rounded-md bg-gray-100 dark:bg-gray-800 border-2 border-indigo-600 cursor-pointer flex items-center justify-center p-2"
                  : "aspect-square rounded-md bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer flex items-center justify-center p-2"
              }
            >
              <img src={src} alt={name} className="h-full w-full object-cover rounded" />
            </button>
          ))
        ) : (
          [0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={
                idx === 0
                  ? "aspect-square rounded-md bg-gray-100 dark:bg-gray-800 border-2 border-indigo-600 cursor-pointer flex items-center justify-center p-2"
                  : "aspect-square rounded-md bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer flex items-center justify-center p-2"
              }
            >
              {idx === 3 ? (
                <span className="text-xs text-gray-500 font-medium">+2</span>
              ) : (
                <Laptop className="h-5 w-5 text-gray-400" />
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">Pratinjau {name}</DialogTitle>
          {activeImage ? (
            <img src={activeImage} alt={name} className="w-full h-auto" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
