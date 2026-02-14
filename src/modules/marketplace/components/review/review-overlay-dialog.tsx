/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";

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
  orderItemId?: number;
};

type ReviewOverlayDialogProps = {
  open: boolean;
  items: ReviewItem[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    items: Array<{ order_item_id: number; rating: number; comment?: string }>;
    overallComment?: string;
    ratings: Record<string, number>;
  }) => void | Promise<void>;
  submitting?: boolean;
  submitError?: string;
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
  submitting = false,
  submitError,
}: ReviewOverlayDialogProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open) {
      setRatings({});
      setComment("");
    }
  }, [open]);

  const canSubmit = useMemo(
    () =>
      items.length > 0 &&
      items.every((item) => {
        const rating = ratings[item.id] ?? 0;
        const orderItemId = item.orderItemId ?? Number(item.id);
        return rating > 0 && Number.isFinite(orderItemId) && orderItemId > 0;
      }),
    [items, ratings]
  );

  const handleSubmit = () => {
    const payloadItems = items.map((item) => {
      const orderItemId = item.orderItemId ?? Number(item.id);
      return {
        order_item_id: Number(orderItemId),
        rating: ratings[item.id] ?? 0,
        comment: comment.trim() || undefined,
      };
    });

    void onSubmit({
      items: payloadItems,
      overallComment: comment.trim() || undefined,
      ratings,
    });
  };

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
            Berikan rating untuk produk yang Anda terima. Ulasan membantu
            penjual menjaga kualitas layanan.
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

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}
        </div>

        <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Nanti Saja
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {submitting ? "Mengirim..." : "Konfirmasi & Selesai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
