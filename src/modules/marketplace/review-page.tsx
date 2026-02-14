/** @format */

"use client";

import { useEffect, useRef, useState } from "react";

import { showToastSuccess } from "@/lib/toast";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";

export function MarketplaceReviewPage() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <div className="relative min-h-screen bg-black/40">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <button
          ref={triggerRef}
          type="button"
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          onClick={() => setOpen(true)}
        >
          Buka Konfirmasi Pesanan
        </button>
      </div>

      <ReviewOverlayDialog
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: "p1", name: "Kopi Arabika Premium" },
          { id: "p2", name: "Madu Hutan Sukamaju" },
        ]}
        onSubmit={() => {
          setOpen(false);
          showToastSuccess("Konfirmasi diterima", "Pesanan ditandai selesai.");
        }}
      />
    </div>
  );
}
