/** @format */

"use client";

import { ConfirmActionDialog } from "@/modules/marketplace/components/shared/ConfirmActionDialog";

export type ProductDeleteModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm: () => void;
}>;

export function ProductDeleteModal({
  open,
  onOpenChange,
  productName,
  onConfirm,
}: ProductDeleteModalProps) {
  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Produk?"
      description={
        <>
          Apakah Anda yakin ingin menghapus{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {productName}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </>
      }
      confirmLabel="Hapus Produk"
      onConfirm={onConfirm}
      tone="destructive"
    />
  );
}
