/** @format */

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type ReviewItem = {
  id: string;
  name: string;
};

type ReviewOverlayDialogProps = {
  open: boolean;
  items: ReviewItem[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { ratings: Record<string, number>; comment: string }) => void;
};

function RatingStars({
  itemId,
  value,
  onChange,
}: {
  itemId: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="space-y-2" aria-labelledby={`rating-label-${itemId}`}>
      <legend id={`rating-label-${itemId}`} className="sr-only">
        Beri rating produk
      </legend>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Bintang ${star}`}
            aria-pressed={value >= star}
            onClick={() => onChange(star)}
            className={`h-9 w-9 text-2xl transition ${
              value >= star ? "text-yellow-500" : "text-muted-foreground"
            }`}
          >
            star
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

export function ReviewOverlayDialog({
  open,
  items,
  onOpenChange,
  onSubmit,
}: ReviewOverlayDialogProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(
    () => items.every((item) => (ratings[item.id] ?? 0) > 0),
    [items, ratings],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/55 backdrop-blur-sm"
        className="max-w-2xl rounded-2xl border border-border bg-card p-0"
      >
        <DialogHeader className="border-b border-border px-6 py-4 text-left">
          <DialogTitle>Konfirmasi Pesanan Diterima</DialogTitle>
          <DialogDescription>
            Apakah Anda sudah menerima pesanan ini dengan baik? Konfirmasi ini
            akan menyelesaikan status pesanan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-muted/30 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-foreground">{item.name}</p>
              <RatingStars
                itemId={item.id}
                value={ratings[item.id] ?? 0}
                onChange={(value) =>
                  setRatings((prev) => ({
                    ...prev,
                    [item.id]: value,
                  }))
                }
              />
            </div>
          ))}

          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
              Tulis Ulasan Anda
            </label>
            <Textarea
              id="review-comment"
              rows={3}
              placeholder="Bagaimana kualitas produk yang Anda terima?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Nanti Saja
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ ratings, comment })}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Konfirmasi & Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
