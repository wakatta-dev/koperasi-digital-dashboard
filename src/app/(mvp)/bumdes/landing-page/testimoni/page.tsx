/** @format */

"use client";

import { useEffect, useState } from "react";

import {
  getLandingPageAdmin,
  updateTestimonials,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type TestimonialItem,
  type TestimonialSection as TestimonialSectionData,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { TestimonialSection } from "@/modules/landing/components/testimonial";

const emptyTestimonials = createEmptyLandingConfig().testimonials ?? {
  title: "",
  description: "",
  items: [],
};

export default function TestimoniPage() {
  const [testimonials, setTestimonials] =
    useState<TestimonialSectionData>(emptyTestimonials);
  const [initial, setInitial] = useState<TestimonialSectionData>(emptyTestimonials);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.testimonials ?? emptyTestimonials;
      setTestimonials(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof TestimonialSectionData, value: string) => {
    setTestimonials((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof TestimonialItem, value: string | number) => {
    setTestimonials((prev) => {
      const items = [...(prev.items ?? [])];
      items[index] = { ...items[index], [field]: value } as TestimonialItem;
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setTestimonials((prev) => ({
      ...prev,
      items: [
        ...(prev.items ?? []),
        {
          name: "",
          role: "",
          rating: 5,
          quote: "",
          photo_url: "",
          order: (prev.items?.length ?? 0) + 1,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setTestimonials((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const handleUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "testimonials");
    formData.append("variant", `photo-${index}`);
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      updateItem(index, "photo_url", res.data.url);
    }
  };

  const handleReset = () => setTestimonials(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...testimonials,
      items: (testimonials.items ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    };
    const res = await updateTestimonials(payload);
    if (res.success && res.data?.testimonials) {
      setTestimonials(res.data.testimonials);
      setInitial(res.data.testimonials);
    }
    setSaving(false);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Suara Warga
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola testimoni dan ulasan dari warga desa untuk ditampilkan di halaman depan.
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
        <TestimonialSection testimonials={testimonials} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">
                  settings_suggest
                </span>
                Pengaturan Bagian
              </h2>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi testimoni."
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Bagian
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Suara Warga"
                    value={testimonials.title ?? ""}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Deskripsi Pendukung
                  </Label>
                  <Textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Deskripsi singkat tentang bagian ini..."
                    rows={3}
                    value={testimonials.description ?? ""}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">forum</span>
                Daftar Testimoni
              </h2>
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Drag untuk mengatur urutan
              </span>
            </div>
            {(testimonials.items ?? []).length === 0 ? (
              <LandingEmptyState
                title="Belum ada testimoni"
                description="Tambahkan testimoni warga atau mitra."
              />
            ) : (
              <div className="space-y-4">
                {(testimonials.items ?? []).map((item, index) => {
                  const photoId = `testimonial-photo-${index}`;
                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative group transition-colors hover:border-primary/40"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1 bg-white dark:bg-gray-700 rounded-md shadow-sm opacity-0 group-hover:opacity-100 h-auto"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </Button>
                      <div className="flex items-start gap-4">
                        <div className="mt-2 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
                          <span className="material-symbols-outlined text-xl">drag_indicator</span>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex flex-col md:flex-row gap-5">
                            <div className="w-full md:w-auto flex-shrink-0 flex flex-col items-center md:items-start">
                              <Label className="block text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-1.5 uppercase tracking-wide">
                                Foto Profil
                              </Label>
                              <div className="relative">
                                <Label
                                  htmlFor={photoId}
                                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white dark:hover:bg-gray-700 transition-colors relative overflow-hidden bg-gray-100 dark:bg-gray-800"
                                >
                                  {item.photo_url ? (
                                    <img
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                      src={item.photo_url}
                                    />
                                  ) : (
                                    <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                      Upload
                                    </span>
                                  )}
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">edit</span>
                                  </div>
                                </Label>
                                <Input
                                  id={photoId}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                      handleUpload(file, index);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                              <div className="col-span-1">
                                <Label className="block text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-1.5">
                                  Nama Warga
                                </Label>
                                <Input
                                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm py-2 focus:ring-primary focus:border-primary transition-colors"
                                  value={item.name}
                                  onChange={(event) =>
                                    updateItem(index, "name", event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-span-1">
                                <Label className="block text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-1.5">
                                  Jabatan / Peran
                                </Label>
                                <Input
                                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm py-2 focus:ring-primary focus:border-primary transition-colors"
                                  value={item.role}
                                  onChange={(event) =>
                                    updateItem(index, "role", event.target.value)
                                  }
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <Label className="block text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-1.5">
                                  Rating
                                </Label>
                                <div className="flex items-center space-x-1 text-amber-400">
                                  {Array.from({ length: 5 }).map((_, starIndex) => {
                                    const active = starIndex < (item.rating ?? 0);
                                    return (
                                      <Button
                                        key={`rating-${index}-${starIndex}`}
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                          updateItem(index, "rating", starIndex + 1)
                                        }
                                        className={`h-auto p-0 ${
                                          active
                                            ? "text-amber-400"
                                            : "text-gray-300 dark:text-gray-600"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-xl">
                                          star
                                        </span>
                                      </Button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Label className="block text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-1.5">
                              Isi Testimoni
                            </Label>
                            <Textarea
                              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors resize-y"
                              rows={3}
                              value={item.quote}
                              onChange={(event) =>
                                updateItem(index, "quote", event.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={addItem}
              className="w-full py-4 mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:text-primary hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center font-medium text-sm group"
            >
              <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">
                add_circle
              </span>
              Tambah Testimoni Baru
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
