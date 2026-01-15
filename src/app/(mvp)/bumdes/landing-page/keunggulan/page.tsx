/** @format */

"use client";

import { useEffect, useState } from "react";

import {
  getLandingPageAdmin,
  updateAdvantages,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type AdvantageItem,
  type AdvantagesSection as AdvantagesSectionData,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/components/landing-page/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { AdvantagesSection } from "@/modules/landing/components/advantages";

const emptyAdvantages = createEmptyLandingConfig().advantages ?? {
  title: "",
  description: "",
  image_url: "",
  items: [],
};

export default function KeunggulanPage() {
  const [advantages, setAdvantages] = useState<AdvantagesSectionData>(emptyAdvantages);
  const [initial, setInitial] = useState<AdvantagesSectionData>(emptyAdvantages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.advantages ?? emptyAdvantages;
      setAdvantages(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof AdvantagesSectionData, value: string) => {
    setAdvantages((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof AdvantageItem, value: string) => {
    setAdvantages((prev) => {
      const items = [...(prev.items ?? [])];
      items[index] = { ...items[index], [field]: value } as AdvantageItem;
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setAdvantages((prev) => ({
      ...prev,
      items: [
        ...(prev.items ?? []),
        { icon: "star", title: "", description: "", order: (prev.items?.length ?? 0) + 1 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setAdvantages((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "advantages");
    formData.append("variant", "image");
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      updateField("image_url", res.data.url);
    }
  };

  const handleReset = () => setAdvantages(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...advantages,
      items: (advantages.items ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    };
    const res = await updateAdvantages(payload);
    if (res.success && res.data?.advantages) {
      setAdvantages(res.data.advantages);
      setInitial(res.data.advantages);
    }
    setSaving(false);
  };

  const handleIconPick = (index: number) => {
    const current = advantages.items?.[index]?.icon ?? "";
    const next = window.prompt("Masukkan nama icon Material Symbols", current);
    if (next !== null) {
      updateItem(index, "icon", next.trim());
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Bagian Keunggulan
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola konten section &quot;Value Proposition&quot; pada halaman depan.
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
        <AdvantagesSection advantages={advantages} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">title</span>
                Informasi Utama
              </h2>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi keunggulan."
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Section
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Mengapa Memilih BUMDes Kami"
                    value={advantages.title ?? ""}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Subjudul / Deskripsi Pengantar
                  </Label>
                  <Textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Deskripsi singkat yang muncul di bawah judul..."
                    rows={3}
                    value={advantages.description ?? ""}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">image</span>
                Komponen Visual Utama
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Gambar ini akan tampil di tengah-tengah poin keunggulan.
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="advantages-image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 transition-colors group relative overflow-hidden"
              >
                {advantages.image_url ? (
                  <img
                    alt="Preview keunggulan"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    src={advantages.image_url}
                  />
                ) : null}
                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                  <div className="mb-3 p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      add_photo_alternate
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-primary">Klik upload</span> atau drag and
                    drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG (Maks. 2MB)
                  </p>
                </div>
              </Label>
              <Input
                id="advantages-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleUpload(file);
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">list_alt</span>
                Daftar Keunggulan
              </h2>
              <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded font-medium">
                {advantages.items?.length ?? 0} Item Aktif
              </span>
            </div>
            {(advantages.items ?? []).length === 0 ? (
              <LandingEmptyState
                title="Belum ada keunggulan"
                description="Tambahkan keunggulan yang ingin ditonjolkan."
              />
            ) : (
              <div className="space-y-6">
                {(advantages.items ?? []).map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 relative group"
                  >
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="h-auto p-1 text-gray-400 hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 text-gray-400 hover:text-blue-500"
                      >
                        <span className="material-symbols-outlined text-lg">drag_handle</span>
                      </Button>
                    </div>
                    <h3 className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">
                      Kartu Keunggulan #{index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                        <Label className="block text-xs font-medium mb-1">Icon</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleIconPick(index)}
                          className="w-full aspect-square border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 flex flex-col items-center justify-center hover:border-primary transition-colors text-gray-500 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-2xl">
                            {item.icon || "star"}
                          </span>
                          <span className="text-[10px] mt-1">Ganti</span>
                        </Button>
                      </div>
                      <div className="md:col-span-10 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                          <div className="flex-1">
                            <Label className="block text-xs font-medium mb-1">
                              Judul Keunggulan
                            </Label>
                            <Input
                              className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary"
                              value={item.title}
                              onChange={(event) =>
                                updateItem(index, "title", event.target.value)
                              }
                            />
                          </div>
                          <div className="w-20">
                            <Label className="block text-xs font-medium mb-1">Urutan</Label>
                            <Input
                              className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary"
                              type="number"
                              value={index + 1}
                              readOnly
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="block text-xs font-medium mb-1">
                            Deskripsi Singkat
                          </Label>
                          <Textarea
                            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary"
                            rows={2}
                            value={item.description}
                            onChange={(event) =>
                              updateItem(index, "description", event.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center text-sm font-medium"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Tambah Keunggulan Baru
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
