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

import { STITCH_FORM_TEXT } from "../../constants/stitch-form-text";
import type { AssetFormModel } from "../../types/stitch";

type AssetFormOptionGroups = Readonly<{
  categories: string[];
  statuses: string[];
  locations: string[];
}>;

const DRAFT_INTERNAL_STATUS = "Draft Internal";

export function resolveCreateAssetStatusOption(statuses: string[]): string {
  return (
    statuses.find(
      (option) => option.toLowerCase() === DRAFT_INTERNAL_STATUS.toLowerCase()
    ) ?? ""
  );
}

type AssetCreateFormFeatureProps = Readonly<{
  onCancel?: () => void;
  onSubmit?: (payload: AssetFormModel) => void | Promise<void>;
  isSubmitting?: boolean;
  options?: AssetFormOptionGroups;
  isLoadingOptions?: boolean;
}>;

export function AssetCreateFormFeature({
  onCancel,
  onSubmit,
  isSubmitting = false,
  options,
  isLoadingOptions = false,
}: AssetCreateFormFeatureProps) {
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [rentalPriceDisplay, setRentalPriceDisplay] = useState("");
  const [purchasePriceDisplay, setPurchasePriceDisplay] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const objectURLRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectURLRef.current) {
        URL.revokeObjectURL(objectURLRef.current);
      }
    };
  }, []);

  const categories = useMemo(() => options?.categories ?? [], [options?.categories]);
  const statuses = useMemo(() => options?.statuses ?? [], [options?.statuses]);
  const locations = useMemo(() => options?.locations ?? [], [options?.locations]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [category, categories]);

  useEffect(() => {
    if (!status && statuses.length > 0) {
      const nextStatus = resolveCreateAssetStatusOption(statuses);
      if (nextStatus) {
        setStatus(nextStatus);
      }
    }
  }, [status, statuses]);

  useEffect(() => {
    if (!location && locations.length > 0) {
      setLocation(locations[0]);
    }
  }, [location, locations]);

  return (
    <div
      className="space-y-6"
      data-testid="asset-admin-create-form"
    >
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
          <Info className="h-4 w-4 text-indigo-600" />
          Informasi Dasar
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.name}</Label>
            <Input
              placeholder="Contoh: MacBook Pro M2"
              value={name}
              onChange={(event) => setName(event.target.value)}
              data-testid="asset-admin-create-name-input"
              required
            />
          </div>
          <div>
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.assetTag} (Otomatis)</Label>
            <Input placeholder="Akan digenerate otomatis" disabled />
          </div>
          <div>
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.serialNumber}</Label>
            <Input
              placeholder="Contoh: SN-12345"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
              data-testid="asset-admin-create-serial-number-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.category}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                disabled={isLoadingOptions || categories.length === 0}
                data-testid="asset-admin-create-category-trigger"
              >
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
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.status}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                disabled={isLoadingOptions || statuses.length === 0}
                data-testid="asset-admin-create-status-trigger"
              >
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
            <p className="mt-2 text-xs text-slate-500">
              Aset baru sebaiknya tetap berada pada lifecycle internal dulu. Aktivasi ke status
              publik hanya akan berhasil jika data minimum aset sudah lengkap.
            </p>
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
                  data-testid="asset-admin-create-file-input"
                  onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null;
                    setImageFile(selected);

                    if (objectURLRef.current) {
                      URL.revokeObjectURL(objectURLRef.current);
                      objectURLRef.current = null;
                    }

                    if (!selected) {
                      setImagePreviewURL("");
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
                  data-testid="asset-admin-create-file-select-button"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Pilih Gambar
                </Button>

                {imageFile ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900"
                    data-testid="asset-admin-create-file-clear-button"
                    onClick={() => {
                      if (objectURLRef.current) {
                        URL.revokeObjectURL(objectURLRef.current);
                        objectURLRef.current = null;
                      }
                      if (imageInputRef.current) {
                        imageInputRef.current.value = "";
                      }
                      setImageFile(null);
                      setImagePreviewURL("");
                    }}
                  >
                    Hapus Gambar
                  </Button>
                ) : null}
              </div>

              <p className="text-sm text-slate-500">PNG, JPG, atau WEBP sampai 5MB.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
          Lokasi &amp; Penanggung Jawab
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Lokasi Utama</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger
                disabled={isLoadingOptions || locations.length === 0}
                data-testid="asset-admin-create-location-trigger"
              >
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
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.assignedTo}</Label>
            <Input
              placeholder="Cari nama karyawan..."
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              data-testid="asset-admin-create-assigned-to-input"
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
              data-testid="asset-admin-create-rental-price-input"
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
              data-testid="asset-admin-create-purchase-price-input"
              placeholder="Contoh: 15000000"
            />
          </div>
          <div>
            <Label className="mb-1 block">Tanggal Pembelian</Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              data-testid="asset-admin-create-purchase-date-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Supplier</Label>
            <Input
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              data-testid="asset-admin-create-vendor-input"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Masa Garansi Berakhir</Label>
            <Input
              type="date"
              value={warrantyEndDate}
              onChange={(event) => setWarrantyEndDate(event.target.value)}
              data-testid="asset-admin-create-warranty-end-date-input"
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
          data-testid="asset-admin-create-description-textarea"
        />
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          data-testid="asset-admin-create-cancel-button"
        >
          Batal
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={isSubmitting}
          data-testid="asset-admin-create-submit-button"
          onClick={async () => {
            await onSubmit?.({
              mode: "create",
              name: name.trim(),
              photoUrl: imagePreviewURL,
              imageFile,
              assetTag: "",
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
          {isSubmitting ? "Menyimpan..." : "Simpan Aset"}
        </Button>
      </div>
    </div>
  );
}
