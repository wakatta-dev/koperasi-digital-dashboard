/** @format */

"use client";

import { Info, Plus, Trash2 } from "lucide-react";
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

import { STITCH_FORM_TEXT } from "../../constants/stitch-form-text";
import { useAssetAttributeRows } from "../../hooks/use-asset-attribute-rows";
import type { AssetFormModel } from "../../types/stitch";

type AssetFormOptionGroups = Readonly<{
  categories: string[];
  statuses: string[];
  locations: string[];
}>;

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
  const [priceDisplay, setPriceDisplay] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
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

  const { rows, addRow, removeRow, updateRow } = useAssetAttributeRows([
    { id: "attr-1", label: "", value: "" },
  ]);

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
      setStatus(statuses[0]);
    }
  }, [status, statuses]);

  useEffect(() => {
    if (!location && locations.length > 0) {
      setLocation(locations[0]);
    }
  }, [location, locations]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

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
          priceDisplay: priceDisplay.trim(),
          warrantyEndDate,
          attributes: rows.map((row) => ({
            id: row.id,
            label: row.label,
            value: row.value,
          })),
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
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.name}</Label>
            <Input
              placeholder="Contoh: MacBook Pro M2"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
            />
          </div>
          <div>
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.category}</Label>
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
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.status}</Label>
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
                  onClick={() => imageInputRef.current?.click()}
                >
                  Pilih Gambar
                </Button>

                {imageFile ? (
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
                      setImagePreviewURL("");
                    }}
                  >
                    Hapus Gambar
                  </Button>
                ) : null}
              </div>

              <p className="text-sm text-slate-500">
                PNG, JPG, atau WEBP sampai 5MB.
              </p>
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
            <Label className="mb-1 block">{STITCH_FORM_TEXT.fields.assignedTo}</Label>
            <Input
              placeholder="Cari nama karyawan..."
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">Ketik untuk mencari karyawan dari database.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">Informasi Pembelian</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <div>
            <Label className="mb-1 block">Harga Beli</Label>
            <Input
              value={priceDisplay}
              onChange={(event) => setPriceDisplay(event.target.value)}
              placeholder="Contoh: 15000000"
            />
          </div>
          <div>
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
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-base font-semibold text-slate-900">Detail Spesifikasi</h4>
          <Button type="button" variant="ghost" className="gap-1 px-0 text-indigo-600" onClick={addRow}>
            <Plus className="h-4 w-4" />
            <span>Tambah Atribut</span>
          </Button>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <div>
                <Label className="mb-1 block text-xs text-slate-500">
                  {index === 0 ? "Label Atribut" : <span className="sr-only">Label Atribut</span>}
                </Label>
                <Input
                  placeholder="Contoh: Processor"
                  value={row.label}
                  onChange={(event) => updateRow(row.id, "label", event.target.value)}
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-slate-500">
                  {index === 0 ? "Nilai" : <span className="sr-only">Nilai</span>}
                </Label>
                <Input
                  placeholder="Contoh: Intel Core i7"
                  value={row.value}
                  onChange={(event) => updateRow(row.id, "value", event.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={() => removeRow(row.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Hapus</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-slate-600">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
          <p>
            Anda dapat menambahkan atribut khusus untuk aset ini secara fleksibel (misal: Warna, Ukuran, Daya Listrik) sesuai kebutuhan tipe aset.
          </p>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="button" variant="outline" className="border-slate-300" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          Simpan Aset
        </Button>
      </div>
    </form>
  );
}
