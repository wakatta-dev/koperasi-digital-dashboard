/** @format */

"use client";

import { Info } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { AssetFormModel } from "../../types/stitch";

type AssetFormOptionGroups = Readonly<{
  categories: string[];
  statuses: string[];
  locations: string[];
}>;

type AssetEditFormFeatureProps = Readonly<{
  onCancel?: () => void;
  onSubmit?: (payload: AssetFormModel) => void | Promise<void>;
  initialModel?: AssetFormModel;
  isSubmitting?: boolean;
  options?: AssetFormOptionGroups;
  isLoadingOptions?: boolean;
}>;

export function AssetEditFormFeature({
  onCancel,
  onSubmit,
  initialModel,
  isSubmitting = false,
  options,
  isLoadingOptions = false,
}: AssetEditFormFeatureProps) {
  const categories = useMemo(() => options?.categories ?? [], [options?.categories]);
  const statuses = useMemo(() => options?.statuses ?? [], [options?.statuses]);
  const locations = useMemo(() => options?.locations ?? [], [options?.locations]);

  const sourceModel: AssetFormModel =
    initialModel ??
    ({
      mode: "edit",
      name: "",
      photoUrl: "",
      imageFile: null,
      assetTag: "",
      serialNumber: "",
      category: categories[0] ?? "",
      status: statuses[0] ?? "",
      location: "",
      assignedTo: "",
      purchaseDate: "",
      vendor: "",
      rentalPriceDisplay: "",
      purchasePriceDisplay: "",
      warrantyEndDate: "",
      description: "",
    } as const);
  const [name, setName] = useState(sourceModel.name);
  const [serialNumber, setSerialNumber] = useState(sourceModel.serialNumber);
  const [category, setCategory] = useState(sourceModel.category);
  const [status, setStatus] = useState(sourceModel.status);
  const [location, setLocation] = useState(sourceModel.location);
  const [assignedTo, setAssignedTo] = useState(sourceModel.assignedTo);
  const [purchaseDate, setPurchaseDate] = useState(sourceModel.purchaseDate);
  const [vendor, setVendor] = useState(sourceModel.vendor);
  const [rentalPriceDisplay, setRentalPriceDisplay] = useState(sourceModel.rentalPriceDisplay);
  const [purchasePriceDisplay, setPurchasePriceDisplay] = useState(sourceModel.purchasePriceDisplay);
  const [warrantyEndDate, setWarrantyEndDate] = useState(sourceModel.warrantyEndDate);
  const [description, setDescription] = useState(sourceModel.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState(sourceModel.photoUrl);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const objectURLRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialModel) return;
    if (objectURLRef.current) {
      URL.revokeObjectURL(objectURLRef.current);
      objectURLRef.current = null;
    }
    setName(initialModel.name);
    setSerialNumber(initialModel.serialNumber);
    setCategory(initialModel.category);
    setStatus(initialModel.status);
    setLocation(initialModel.location);
    setAssignedTo(initialModel.assignedTo);
    setPurchaseDate(initialModel.purchaseDate);
    setVendor(initialModel.vendor);
    setRentalPriceDisplay(initialModel.rentalPriceDisplay);
    setPurchasePriceDisplay(initialModel.purchasePriceDisplay);
    setWarrantyEndDate(initialModel.warrantyEndDate);
    setDescription(initialModel.description);
    setImageFile(null);
    setImagePreviewURL(initialModel.photoUrl);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [initialModel]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [category, categories]);

  useEffect(() => {
    if (!status && statuses.length > 0) {
      setStatus(statuses[0]);
    }
  }, [status, statuses]);

  useEffect(() => {
    if (!location && locations.length > 0) {
      setLocation(locations[0]);
    }
  }, [location, locations]);

  useEffect(() => {
    return () => {
      if (objectURLRef.current) {
        URL.revokeObjectURL(objectURLRef.current);
      }
    };
  }, []);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit?.({
          mode: "edit",
          name: name.trim(),
          photoUrl: imagePreviewURL,
          imageFile,
          assetTag: sourceModel.assetTag,
          serialNumber: serialNumber.trim(),
          category,
          status,
          location: location.trim(),
          assignedTo: assignedTo.trim(),
          purchaseDate,
          vendor: vendor.trim(),
          rentalPriceDisplay: rentalPriceDisplay.trim(),
          purchasePriceDisplay: purchasePriceDisplay.trim(),
          warrantyEndDate,
          description: description.trim(),
        });
      }}
    >
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
          <Info className="h-4 w-4 text-indigo-600" />
          Informasi Dasar
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Nama Aset</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <Label className="mb-1 block">Asset Tag (Otomatis)</Label>
            <Input defaultValue={sourceModel.assetTag} disabled />
          </div>
          <div>
            <Label className="mb-1 block">Serial Number</Label>
            <Input
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger disabled={isLoadingOptions || categories.length === 0}>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger disabled={isLoadingOptions || statuses.length === 0}>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Foto Aset</Label>
            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {imagePreviewURL ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img
                    src={imagePreviewURL}
                    alt="Preview foto aset"
                    className="h-44 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                  Belum ada gambar aset
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null;
                    setImageFile(selected);

                    if (objectURLRef.current) {
                      URL.revokeObjectURL(objectURLRef.current);
                      objectURLRef.current = null;
                    }

                    if (!selected) {
                      setImagePreviewURL(sourceModel.photoUrl);
                      return;
                    }

                    const objectURL = URL.createObjectURL(selected);
                    objectURLRef.current = objectURL;
                    setImagePreviewURL(objectURL);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Ganti Gambar
                </Button>

                {(imageFile || sourceModel.photoUrl) ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900"
                    onClick={() => {
                      if (objectURLRef.current) {
                        URL.revokeObjectURL(objectURLRef.current);
                        objectURLRef.current = null;
                      }
                      if (imageInputRef.current) {
                        imageInputRef.current.value = "";
                      }
                      setImageFile(null);
                      setImagePreviewURL(sourceModel.photoUrl);
                    }}
                  >
                    Batal Ganti
                  </Button>
                ) : null}
              </div>

              <p className="text-sm text-slate-500">PNG, JPG, atau WEBP sampai 5MB.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">Lokasi &amp; Penanggung Jawab</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Lokasi Utama</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger disabled={isLoadingOptions || locations.length === 0}>
                <SelectValue placeholder="Pilih Lokasi" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-slate-500">
              Lokasi diambil dari master data. Tambahkan opsi baru melalui menu Master Data.
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Penanggung Jawab</Label>
            <Input
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Cari nama karyawan..."
            />
            <p className="mt-1 text-xs text-slate-500">Ketik untuk mencari karyawan dari database.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">Informasi Harga &amp; Pembelian</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1 block">Biaya Sewa</Label>
            <Input
              type="number"
              min={1}
              required
              value={rentalPriceDisplay}
              onChange={(event) => setRentalPriceDisplay(event.target.value)}
              placeholder="Contoh: 250000"
            />
          </div>
          <div>
            <Label className="mb-1 block">Harga Beli (Opsional)</Label>
            <Input
              type="number"
              min={0}
              value={purchasePriceDisplay}
              onChange={(event) => setPurchasePriceDisplay(event.target.value)}
              placeholder="Contoh: 15000000"
            />
          </div>
          <div>
            <Label className="mb-1 block">Tanggal Pembelian</Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block">Supplier</Label>
            <Input value={vendor} onChange={(event) => setVendor(event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Masa Garansi Berakhir</Label>
            <Input
              type="date"
              value={warrantyEndDate}
              onChange={(event) => setWarrantyEndDate(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-semibold text-slate-900">Deskripsi Aset</h4>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Tuliskan deskripsi aset, kondisi, dan catatan penting lainnya..."
          rows={5}
        />
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
