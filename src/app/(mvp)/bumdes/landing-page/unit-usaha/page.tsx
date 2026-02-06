/** @format */

"use client";

import { useEffect, useState } from "react";

import {
  getLandingPageAdmin,
  updateBusinessUnits,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type BusinessUnitConfig,
  type BusinessUnitSelection,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUSINESS_UNITS } from "@/modules/landing/constants";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { BusinessUnits } from "@/modules/landing/components/business-units";

const emptyUnits = createEmptyLandingConfig().business_units ?? { items: [] };

const badgeClasses = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
];

export default function UnitUsahaPage() {
  const [units, setUnits] = useState<BusinessUnitConfig>(emptyUnits);
  const [initial, setInitial] = useState<BusinessUnitConfig>(emptyUnits);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.business_units ?? emptyUnits;
      setUnits(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateItem = (
    index: number,
    field: keyof BusinessUnitSelection,
    value: string
  ) => {
    setUnits((prev) => {
      const items = [...(prev.items ?? [])];
      items[index] = { ...items[index], [field]: value } as BusinessUnitSelection;
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setUnits((prev) => ({
      ...prev,
      items: [
        ...(prev.items ?? []),
        { unit_id: "", order: (prev.items?.length ?? 0) + 1, label_override: "" },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setUnits((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const handleUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "business_units");
    formData.append("variant", `unit-${index}`);
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      updateItem(index, "image_url", res.data.url);
    }
  };

  const handleReset = () => setUnits(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...units,
      items: (units.items ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    };
    const res = await updateBusinessUnits(payload);
    if (res.success && res.data?.business_units) {
      setUnits(res.data.business_units);
      setInitial(res.data.business_units);
    }
    setSaving(false);
  };

  const activeItems = units.items ?? [];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Konfigurasi Unit Usaha Landing Page
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Pilih dan urutkan hingga 4 unit usaha untuk ditampilkan di grid halaman utama.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="h-auto px-4 py-2 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main-light dark:text-text-main-dark transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSave}
            disabled={saving}
            className="h-auto px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <span className="material-symbols-outlined text-sm mr-2">save</span>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      <LandingLivePreview contentClassName="p-0 bg-transparent">
        <BusinessUnits businessUnits={units} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="surface-table">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">view_list</span>
                Daftar Unit Aktif ({activeItems.length})
              </h2>
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                Drag untuk mengubah urutan
              </span>
            </div>
            {loading ? (
              <div className="p-6">
                <LandingEmptyState
                  title="Memuat data"
                  description="Menyiapkan konfigurasi unit usaha."
                />
              </div>
            ) : activeItems.length === 0 ? (
              <div className="p-6">
                <LandingEmptyState
                  title="Belum ada unit usaha"
                  description="Tambahkan unit usaha untuk ditampilkan di landing page."
                />
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {activeItems.map((item, index) => {
                  const fallbackUnit = BUSINESS_UNITS[index] ?? BUSINESS_UNITS[0];
                  const label = item.label_override || fallbackUnit?.label || "Unit Usaha";
                  const title = fallbackUnit?.title || "Unit usaha unggulan";
                  const image = item.image_url || fallbackUnit?.image || "";
                  const uploadId = `business-unit-upload-${index}`;
                  return (
                    <li
                      key={`${item.unit_id}-${index}`}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab mr-3">
                          <span className="material-symbols-outlined">drag_indicator</span>
                        </div>
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600 bg-gray-100">
                          <Label
                            htmlFor={uploadId}
                            className="block h-full w-full cursor-pointer"
                          >
                            {image ? (
                              <img
                                alt={`Thumbnail ${title}`}
                                className="h-full w-full object-cover"
                                src={image}
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
                            )}
                          </Label>
                          <Input
                            id={uploadId}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                handleUpload(file, index);
                              }
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
                                {title}
                              </h4>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge
                                  className={`rounded text-[10px] font-medium ${
                                    badgeClasses[index % badgeClasses.length]
                                  }`}
                                >
                                  {label.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                  Urutan: {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeItem(index)}
                                className="h-auto p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Hapus dari Landing Page"
                              >
                                <span className="material-symbols-outlined text-lg">close</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                type="button"
                variant="ghost"
                onClick={addItem}
                className="w-full flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary hover:border-primary dark:hover:text-primary dark:hover:border-primary hover:bg-white dark:hover:bg-surface-dark transition-all duration-200 group"
              >
                <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">
                  add_circle
                </span>
                Tambah Pilih dari Daftar Unit Usaha
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
