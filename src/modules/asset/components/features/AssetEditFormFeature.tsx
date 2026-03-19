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
  const [formState, setFormState] = useState(() => ({
    name: sourceModel.name,
    serialNumber: sourceModel.serialNumber,
    category: sourceModel.category,
    status: sourceModel.status,
    location: sourceModel.location,
    assignedTo: sourceModel.assignedTo,
    purchaseDate: sourceModel.purchaseDate,
    vendor: sourceModel.vendor,
    rentalPriceDisplay: sourceModel.rentalPriceDisplay,
    purchasePriceDisplay: sourceModel.purchasePriceDisplay,
    warrantyEndDate: sourceModel.warrantyEndDate,
    description: sourceModel.description,
  }));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState(sourceModel.photoUrl);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const objectURLRef = useRef<string | null>(null);
  const {
    name,
    serialNumber,
    category,
    status,
    location,
    assignedTo,
    purchaseDate,
    vendor,
    rentalPriceDisplay,
    purchasePriceDisplay,
    warrantyEndDate,
    description,
  } = formState;

  const patchFormState = (
    updates:
      | Partial<typeof formState>
      | ((current: typeof formState) => typeof formState),
  ) => {
    setFormState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  const hydrateFromInitialModel = (nextModel: AssetFormModel) => {
    patchFormState({
      name: nextModel.name,
      serialNumber: nextModel.serialNumber,
      category: nextModel.category,
      status: nextModel.status,
      location: nextModel.location,
      assignedTo: nextModel.assignedTo,
      purchaseDate: nextModel.purchaseDate,
      vendor: nextModel.vendor,
      rentalPriceDisplay: nextModel.rentalPriceDisplay,
      purchasePriceDisplay: nextModel.purchasePriceDisplay,
      warrantyEndDate: nextModel.warrantyEndDate,
      description: nextModel.description,
    });
    setImageFile(null);
    setImagePreviewURL(nextModel.photoUrl);
  };

  useEffect(() => {
    if (!initialModel) return;
    if (objectURLRef.current) {
      URL.revokeObjectURL(objectURLRef.current);
      objectURLRef.current = null;
    }
    hydrateFromInitialModel(initialModel);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [initialModel]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      patchFormState({ category: categories[0] });
    }
  }, [category, categories]);

  useEffect(() => {
    if (!status && statuses.length > 0) {
      patchFormState({ status: statuses[0] });
    }
  }, [status, statuses]);

  useEffect(() => {
    if (!location && locations.length > 0) {
      patchFormState({ location: locations[0] });
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
    <div
      className="space-y-6"
      data-testid="asset-admin-edit-form"
    >
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
          <Info className="h-4 w-4 text-indigo-600" />
          Informasi Dasar
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Nama Aset</Label>
            <Input
              value={name}
              onChange={(event) => patchFormState({ name: event.target.value })}
              required
              data-testid="asset-admin-edit-name-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Asset Tag (Otomatis)</Label>
            <Input defaultValue={sourceModel.assetTag} disabled data-testid="asset-admin-edit-asset-tag-input" />
          </div>
          <div>
            <Label className="mb-1 block">Serial Number</Label>
            <Input
              value={serialNumber}
              onChange={(event) =>
                patchFormState({ serialNumber: event.target.value })
              }
              data-testid="asset-admin-edit-serial-number-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Kategori</Label>
            <Select
              value={category}
              onValueChange={(value) => patchFormState({ category: value })}
            >
              <SelectTrigger
                disabled={isLoadingOptions || categories.length === 0}
                data-testid="asset-admin-edit-category-trigger"
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
            <Label className="mb-1 block">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => patchFormState({ status: value })}
            >
              <SelectTrigger
                disabled={isLoadingOptions || statuses.length === 0}
                data-testid="asset-admin-edit-status-trigger"
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
              Saat status diubah ke penggunaan publik, sistem akan mengecek kesiapan data aset
              secara otomatis.
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
                  data-testid="asset-admin-edit-file-input"
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
                  data-testid="asset-admin-edit-file-select-button"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Ganti Gambar
                </Button>

                {(imageFile || sourceModel.photoUrl) ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900"
                    data-testid="asset-admin-edit-file-clear-button"
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
            <Select
              value={location}
              onValueChange={(value) => patchFormState({ location: value })}
            >
              <SelectTrigger
                disabled={isLoadingOptions || locations.length === 0}
                data-testid="asset-admin-edit-location-trigger"
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
            <Label className="mb-1 block">Penanggung Jawab</Label>
            <Input
              value={assignedTo}
              onChange={(event) =>
                patchFormState({ assignedTo: event.target.value })
              }
              placeholder="Cari nama karyawan..."
              data-testid="asset-admin-edit-assigned-to-input"
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
              onChange={(event) =>
                patchFormState({ rentalPriceDisplay: event.target.value })
              }
              placeholder="Contoh: 250000"
              data-testid="asset-admin-edit-rental-price-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Harga Beli (Opsional)</Label>
            <Input
              type="number"
              min={0}
              value={purchasePriceDisplay}
              onChange={(event) =>
                patchFormState({ purchasePriceDisplay: event.target.value })
              }
              placeholder="Contoh: 15000000"
              data-testid="asset-admin-edit-purchase-price-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Tanggal Pembelian</Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(event) =>
                patchFormState({ purchaseDate: event.target.value })
              }
              data-testid="asset-admin-edit-purchase-date-input"
            />
          </div>
          <div>
            <Label className="mb-1 block">Supplier</Label>
            <Input
              value={vendor}
              onChange={(event) => patchFormState({ vendor: event.target.value })}
              data-testid="asset-admin-edit-vendor-input"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Masa Garansi Berakhir</Label>
            <Input
              type="date"
              value={warrantyEndDate}
              onChange={(event) =>
                patchFormState({ warrantyEndDate: event.target.value })
              }
              data-testid="asset-admin-edit-warranty-end-date-input"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-semibold text-slate-900">Deskripsi Aset</h4>
        <Textarea
          value={description}
          onChange={(event) =>
            patchFormState({ description: event.target.value })
          }
          placeholder="Tuliskan deskripsi aset, kondisi, dan catatan penting lainnya..."
          rows={5}
          data-testid="asset-admin-edit-description-textarea"
        />
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          data-testid="asset-admin-edit-cancel-button"
        >
          Batal
        </Button>
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={isSubmitting}
          data-testid="asset-admin-edit-submit-button"
          onClick={async () => {
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
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
