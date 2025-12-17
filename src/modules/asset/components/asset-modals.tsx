/** @format */

"use client";

import React from "react";
import { Plus, Upload } from "lucide-react";

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
import type { AssetItem } from "../types";
import { cn } from "@/lib/utils";

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
  "rounded-lg border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 h-11";

export function AddAssetDialog({ open, onOpenChange }: AddAssetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Tambah Aset Sewa
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Nama Aset
              </Label>
              <Input
                placeholder="Masukkan nama aset"
                className={commonFieldClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                ID Aset
              </Label>
              <Input
                placeholder="Masukkan id aset"
                className={commonFieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Foto Aset
            </Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-500/30 bg-indigo-50/60 p-8 text-center transition-colors hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20">
              <div className="space-y-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Unggah Foto Aset
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG atau JPEG
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  (Ukuran maksimal 2mb)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Deskripsi Aset
            </Label>
            <Textarea
              placeholder="Deskripsikan aset secara lengkap"
              rows={3}
              className={cn("min-h-[120px]", commonFieldClass)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Fasilitas
            </Label>
            <Textarea
              placeholder="Deskripsikan aset secara lengkap"
              rows={3}
              className={cn("min-h-[120px]", commonFieldClass)}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Biaya Sewa
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Jumlah Harga
                </Label>
                <Input
                  placeholder="Masukkan jumlah harga sewa"
                  className={commonFieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Periode sewa
                </Label>
                <Select>
                  <SelectTrigger className={cn(commonFieldClass, "h-11 w-full")}>
                    <SelectValue placeholder="Pilih periode sewa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">Harian</SelectItem>
                    <SelectItem value="mingguan">Mingguan</SelectItem>
                    <SelectItem value="bulanan">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-auto px-0 text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Plus className="h-4 w-4" />
              Tambah Skema Sewa
            </Button>
          </div>

          <div className="pt-2">
            <Button className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
              Tambah Aset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditAssetDialog({
  open,
  onOpenChange,
  asset,
}: EditAssetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Edit Aset Sewa
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Nama Aset
              </Label>
              <Input
                defaultValue={asset?.title ?? "Gedung Serbaguna Kartika Runa Wijaya"}
                className={commonFieldClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                ID Aset
              </Label>
              <Input
                defaultValue="AST-001-KRW"
                className={commonFieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Unggah Foto Aset
            </Label>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="group relative h-32 w-full flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700 sm:w-40">
                <img
                  src={
                    asset?.image ??
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjJp-Ml8FollDe2RTR3f7ISgwrNFKgf3NIlqefTgwjhjTsuJvAZV-TMzCizXfR76b3PCRzyKycFihBkD-8g0IZed67pgqtYqRdSOh3gI7aJPdGttxfZOmyJQvIw6zlzQQ6iTTEKOLDc02r9QQwmra_TnDGVL8_Tfgv1Aox9-cgTnYi4v2v4-7o_3vHaVvqHauFhzEVRcqH5c8dp9Lt7WoceDTmAAEYKhGXEz4pcN-9mgJTSoniLYXJlu4le2xf9znNXxN49tp0bfE"
                  }
                  alt={asset?.alt ?? "Current Asset Photo"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex h-32 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-500/30 bg-indigo-50/60 p-4 text-center transition-colors hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20">
                <Upload className="mb-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Klik untuk mengganti foto
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG atau JPEG (Max 2MB)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Deskripsi Aset
            </Label>
            <Textarea
              defaultValue="Gedung serbaguna yang luas dan nyaman, cocok untuk berbagai acara seperti pernikahan, seminar, dan pertemuan formal lainnya. Dilengkapi dengan pencahayaan alami yang baik."
              rows={3}
              className={cn("min-h-[120px]", commonFieldClass)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Fasilitas
            </Label>
            <Textarea
              defaultValue="AC Central, Sound System 5000W, Projector HD, Panggung 8x4m, 200 Kursi Futura, Toilet Pria/Wanita, Ruang Rias, Parkir Luas (50 Mobil)."
              rows={3}
              className={cn("min-h-[120px]", commonFieldClass)}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Biaya Sewa
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Jumlah Harga
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-slate-500 dark:text-slate-400">
                    Rp
                  </span>
                  <Input
                    defaultValue="3.500.000"
                    className={cn(commonFieldClass, "pl-9")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Periode sewa
                </Label>
                <Select defaultValue="bulanan">
                  <SelectTrigger className={cn(commonFieldClass, "h-11 w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">Harian</SelectItem>
                    <SelectItem value="mingguan">Mingguan</SelectItem>
                    <SelectItem value="bulanan">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-auto px-0 text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Plus className="h-4 w-4" />
              Tambah Skema Sewa
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              className="h-auto rounded-lg border-slate-300 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button className="h-auto rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
