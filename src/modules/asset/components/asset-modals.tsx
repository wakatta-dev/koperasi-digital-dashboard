/** @format */

"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { ensureSuccess } from "@/lib/api";
import { createAsset, updateAsset, uploadAssetImage } from "@/services/api/assets";
import type { AssetItem } from "../types";
import { QK } from "@/hooks/queries/queryKeys";

type AddAssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditAssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: AssetItem;
};

const commonFieldClass =
  "h-11 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50";
const maxImageSizeBytes = 5 * 1024 * 1024;

export function AddAssetDialog({ open, onOpenChange }: AddAssetDialogProps) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [rateType, setRateType] = React.useState<string | undefined>();
  const [rateAmount, setRateAmount] = React.useState<string>("");
  const [description, setDescription] = React.useState("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const created = ensureSuccess(
        await createAsset({
          name,
          rate_type: rateType || "",
          rate_amount: Number(rateAmount) || 0,
          description: description || undefined,
        })
      );
      if (imageFile) {
        await ensureSuccess(await uploadAssetImage(created.id, imageFile));
      }
      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.assetRental.list() });
      showToastSuccess("Aset dibuat", "Data aset berhasil disimpan");
      resetForm();
      onOpenChange(false);
    },
    onError: (err) => {
      showToastError("Gagal menambahkan aset", err);
    },
  });

  const resetForm = () => {
    setName("");
    setRateType(undefined);
    setRateAmount("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rateType || Number(rateAmount) <= 0) {
      showToastError(
        "Validasi gagal",
        "Nama aset, tipe tarif, dan nominal tarif wajib diisi"
      );
      return;
    }
    createMutation.mutate();
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  React.useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }
    if (file.size > maxImageSizeBytes) {
      showToastError(
        "Ukuran foto terlalu besar",
        "Maksimal ukuran gambar 5MB."
      );
      event.target.value = "";
      return;
    }
    setImageFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 shadow-2xl flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-foreground">
              Tambah Aset Sewa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Field sudah disesuaikan dengan payload backend: name, rate_type (daily/hourly),
            rate_amount, dan description (opsional). Foto aset diunggah terpisah via MinIO.
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Nama Aset (name)
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mis. Gedung Serbaguna"
                  className={commonFieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Tipe Tarif (rate_type)
                </Label>
                <Select value={rateType} onValueChange={setRateType}>
                  <SelectTrigger className={cn(commonFieldClass, "h-11 w-full")}>
                    <SelectValue placeholder="Pilih tipe tarif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Per Hari (DAILY)</SelectItem>
                    <SelectItem value="HOURLY">Per Jam (HOURLY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Nominal Tarif (rate_amount)
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1000}
                    value={rateAmount}
                    onChange={(e) => setRateAmount(e.target.value)}
                    placeholder="3500000"
                    className={cn(commonFieldClass, "pl-9")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Foto Aset
                </Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className={commonFieldClass}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, atau WebP. Maksimal 5MB.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Deskripsi Aset (description)
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsikan aset sesuai data backend"
                rows={3}
                className={cn("min-h-[120px]", commonFieldClass)}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {createMutation.isPending ? "Menyimpan..." : "Tambah Aset"}
            </Button>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview Foto Aset"
                className="h-28 w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                Belum ada foto
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditAssetDialog({
  open,
  onOpenChange,
  asset,
}: EditAssetDialogProps) {
  const qc = useQueryClient();
  const [name, setName] = React.useState(asset?.title ?? "");
  const [rateType, setRateType] = React.useState<string | undefined>(
    asset?.rateType?.toUpperCase()
  );
  const [rateAmount, setRateAmount] = React.useState<string>(
    asset?.rateAmount != null ? String(asset.rateAmount) : ""
  );
  const [description, setDescription] = React.useState(asset?.description ?? "");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  React.useEffect(() => {
    setName(asset?.title ?? "");
    setRateType(asset?.rateType?.toUpperCase());
    setRateAmount(asset?.rateAmount != null ? String(asset.rateAmount) : "");
    setDescription(asset?.description ?? "");
    setImageFile(null);
    setImagePreview("");
  }, [asset, open]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const updated = ensureSuccess(
        await updateAsset(asset?.id ?? "", {
          name,
          rate_type: rateType,
          rate_amount: rateAmount ? Number(rateAmount) : undefined,
          description: description || undefined,
        })
      );
      if (imageFile && asset?.id) {
        await ensureSuccess(await uploadAssetImage(asset.id, imageFile));
      }
      return updated;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.assetRental.list() });
      qc.invalidateQueries({ queryKey: QK.assetRental.detail(asset?.id ?? "") });
      showToastSuccess("Perubahan disimpan", "Data aset berhasil diperbarui");
      onOpenChange(false);
    },
    onError: (err) => {
      showToastError("Gagal memperbarui aset", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset?.id) {
      showToastError("Data aset tidak valid", "Tidak ada ID aset yang dipilih");
      return;
    }
    if (!name.trim() || !rateType || Number(rateAmount) <= 0) {
      showToastError(
        "Validasi gagal",
        "Nama aset, tipe tarif, dan nominal tarif wajib diisi"
      );
      return;
    }
    updateMutation.mutate();
  };

  React.useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }
    if (file.size > maxImageSizeBytes) {
      showToastError(
        "Ukuran foto terlalu besar",
        "Maksimal ukuran gambar 5MB."
      );
      event.target.value = "";
      return;
    }
    setImageFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 shadow-2xl flex flex-col"
      >
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-foreground">
              Edit Aset Sewa
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                ID Aset
              </Label>
              <Input
                defaultValue={asset?.id ?? ""}
                readOnly
                className={cn(commonFieldClass, "bg-muted/40")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Nama Aset (name)
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={commonFieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Nominal Tarif (rate_amount)
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  value={rateAmount}
                  onChange={(e) => setRateAmount(e.target.value)}
                  className={cn(commonFieldClass, "pl-9")}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Tipe Tarif (rate_type)
              </Label>
              <Select value={rateType} onValueChange={setRateType}>
                <SelectTrigger className={cn(commonFieldClass, "h-11 w-full")}>
                  <SelectValue placeholder="Pilih tipe tarif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Per Hari (DAILY)</SelectItem>
                  <SelectItem value="HOURLY">Per Jam (HOURLY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Foto Aset
              </Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className={commonFieldClass}
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, atau WebP. Maksimal 5MB.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-border bg-muted/40 p-2 shadow-sm">
              {imagePreview || asset?.image ? (
                <img
                  src={imagePreview || asset?.image}
                  alt={asset?.alt ?? "Preview Foto Aset"}
                  className="h-28 w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                  Belum ada foto
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Deskripsi Aset (description)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn("min-h-[120px]", commonFieldClass)}
            />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-auto rounded-lg border-border py-3 text-sm font-medium text-foreground hover:bg-muted/40"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-auto rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
