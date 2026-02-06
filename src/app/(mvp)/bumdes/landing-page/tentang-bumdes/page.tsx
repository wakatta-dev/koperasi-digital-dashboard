/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  getLandingPageAdmin,
  updateAbout,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type AboutSection,
  type AboutValue,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { LandingAbout } from "@/modules/landing/components/about";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyAbout = createEmptyLandingConfig().about ?? {
  title: "",
  body: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  values: [],
};

export default function TentangBumdesPage() {
  const [about, setAbout] = useState<AboutSection>(emptyAbout);
  const [initial, setInitial] = useState<AboutSection>(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.about ?? emptyAbout;
      setAbout(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof AboutSection, value: string) => {
    setAbout((prev) => ({ ...prev, [field]: value }));
  };

  const updateValue = (
    index: number,
    field: keyof AboutValue,
    value: string | number
  ) => {
    setAbout((prev) => {
      const values = [...(prev.values ?? [])];
      const nextValue = field === "order" ? Number(value) || 0 : value;
      values[index] = { ...values[index], [field]: nextValue } as AboutValue;
      return { ...prev, values };
    });
  };

  const addValue = () => {
    setAbout((prev) => ({
      ...prev,
      values: [
        ...(prev.values ?? []),
        { icon: "star", title: "", description: "", order: (prev.values?.length ?? 0) + 1 },
      ],
    }));
  };

  const removeValue = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      values: (prev.values ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "about");
    formData.append("variant", "main");
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      updateField("image_url", res.data.url);
    }
  };

  const handleReset = () => setAbout(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...about,
      values: (about.values ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    };
    const res = await updateAbout(payload);
    if (res.success && res.data?.about) {
      setAbout(res.data.about);
      setInitial(res.data.about);
    }
    setSaving(false);
  };

  const handleIconPick = (index: number) => {
    const current = about.values?.[index]?.icon ?? "";
    const next = window.prompt("Icon", current);
    if (next !== null) {
      updateValue(index, "icon", next);
    }
  };

  const valueCount = about.values?.length ?? 0;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Bagian Tentang BUMDes
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola konten section &quot;Tentang Kami&quot;, deskripsi, dan nilai inti BUMDes.
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
        <LandingAbout about={about} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">title</span>
                Informasi Utama
              </h3>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi tentang BUMDes."
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Section
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Tentang BUMDes Kami"
                    value={about.title ?? ""}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Deskripsi Utama
                  </Label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <div className="flex items-center space-x-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-lg">format_bold</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-lg">format_italic</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-lg">
                          format_underlined
                        </span>
                      </Button>
                      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-lg">
                          format_list_bulleted
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <span className="material-symbols-outlined text-lg">
                          format_list_numbered
                        </span>
                      </Button>
                    </div>
                    <Textarea
                      className="w-full p-3 text-sm focus:outline-none dark:bg-gray-800 border-none resize-y shadow-none focus-visible:ring-0"
                      rows={5}
                      value={about.body ?? ""}
                      onChange={(event) => updateField("body", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">image</span>
                Gambar Ilustrasi
              </h3>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Gambar utama yang merepresentasikan BUMDes (Misal: Foto pot tanaman atau aktivitas
                warga).
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 transition-colors group relative overflow-hidden">
                {about.image_url ? (
                  <img
                    src={about.image_url}
                    alt="Gambar tentang BUMDes"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
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
                    JPG, PNG (Maks. 2MB)
                  </p>
                </div>
                <Input
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
              </label>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">stars</span>
                Nilai / Pilar BUMDes
              </h3>
              <Badge className="text-xs bg-blue-100 text-primary px-2 py-1 rounded font-medium">
                {valueCount} Item Aktif
              </Badge>
            </div>
            {(about.values ?? []).length === 0 ? (
              <LandingEmptyState
                title="Belum ada nilai"
                description="Tambahkan nilai utama yang ingin ditampilkan."
              />
            ) : (
              <div className="space-y-6">
                {(about.values ?? []).map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 relative group"
                  >
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeValue(index)}
                        className="h-auto p-1 hover:text-red-500 text-gray-400"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto p-1 hover:text-blue-500 text-gray-400"
                      >
                        <span className="material-symbols-outlined text-lg">drag_handle</span>
                      </Button>
                    </div>
                    <h4 className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">
                      Pilar #{index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                        <Label className="block text-xs font-medium mb-1">
                          Icon
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleIconPick(index)}
                          className="w-full aspect-square border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 flex flex-col items-center justify-center hover:border-primary transition-colors text-gray-500 hover:text-primary h-auto"
                        >
                          <span className="material-symbols-outlined text-2xl">
                            {item.icon || "stars"}
                          </span>
                          <span className="text-[10px] mt-1">Ganti</span>
                        </Button>
                      </div>
                      <div className="md:col-span-10 space-y-3">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <Label className="block text-xs font-medium mb-1">
                              Judul Nilai
                            </Label>
                            <Input
                              className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary"
                              value={item.title}
                              onChange={(event) =>
                                updateValue(index, "title", event.target.value)
                              }
                            />
                          </div>
                          <div className="w-20">
                            <Label className="block text-xs font-medium mb-1">
                              Urutan
                            </Label>
                            <Input
                              type="number"
                              readOnly
                              className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary"
                              value={item.order || index + 1}
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
                              updateValue(index, "description", event.target.value)
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
              onClick={addValue}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center text-sm font-medium h-auto"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Tambah Nilai / Pilar Baru
            </Button>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">touch_app</span>
                Call to Action (CTA)
              </h3>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Tombol yang muncul di akhir deskripsi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Label Tombol
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Contoh: Baca Selengkapnya"
                  value={about.cta_label ?? ""}
                  onChange={(event) => updateField("cta_label", event.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Tautan Tombol
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Contoh: /kontak"
                  value={about.cta_url ?? ""}
                  onChange={(event) => updateField("cta_url", event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
