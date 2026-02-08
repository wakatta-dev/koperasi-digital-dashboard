/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AssetItem } from "../types";
import { AssetCreateFormFeature } from "./stitch/AssetCreateFormFeature";
import { AssetEditFormFeature } from "./stitch/AssetEditFormFeature";

type AddAssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditAssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: AssetItem;
};

export function AddAssetDialog({ open, onOpenChange }: AddAssetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-slate-50 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Tambah Aset</DialogTitle>
          <DialogDescription className="sr-only">
            Form untuk menambah data aset baru.
          </DialogDescription>
        </DialogHeader>
        <AssetCreateFormFeature
          onCancel={() => onOpenChange(false)}
          onSubmit={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditAssetDialog({ open, onOpenChange }: EditAssetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-slate-50 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Aset</DialogTitle>
          <DialogDescription className="sr-only">
            Form untuk mengubah data aset yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <AssetEditFormFeature
          onCancel={() => onOpenChange(false)}
          onSubmit={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
