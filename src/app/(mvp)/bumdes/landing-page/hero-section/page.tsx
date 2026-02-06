/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  getLandingPageAdmin,
  updateHero,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type HeroSection,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { LandingHero } from "@/modules/landing/components/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const emptyHero = createEmptyLandingConfig().hero ?? {
  headline: "",
  subheadline: "",
  cta_label: "",
  cta_url: "",
  background_image_url: "",
  illustration_left_url: "",
  illustration_right_url: "",
  is_active: true,
};

export default function HeroSectionPage() {
  const [hero, setHero] = useState<HeroSection>(emptyHero);
  const [initial, setInitial] = useState<HeroSection>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.hero ?? emptyHero;
      setHero(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof HeroSection, value: string | boolean) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (
    file: File,
    variant: "background" | "left" | "right"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "hero");
    formData.append("variant", variant);
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      if (variant === "background")
        updateField("background_image_url", res.data.url);
      if (variant === "left")
        updateField("illustration_left_url", res.data.url);
      if (variant === "right")
        updateField("illustration_right_url", res.data.url);
    }
  };

  const handleReset = () => setHero(initial);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateHero(hero);
    if (res.success && res.data?.hero) {
      setHero(res.data.hero);
      setInitial(res.data.hero);
    }
    setSaving(false);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Hero Section
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola banner utama yang tampil di bagian paling atas halaman depan.
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
        <LandingHero hero={hero} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">
                  text_fields
                </span>
                Konten Teks
              </h3>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi hero."
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Utama (Headline)
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Membangun Desa Mandiri"
                    value={hero.headline ?? ""}
                    onChange={(event) =>
                      updateField("headline", event.target.value)
                    }
                  />
                  <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                    Judul besar yang menarik perhatian pengunjung.
                  </p>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Sub-headline / Deskripsi Singkat
                  </Label>
                  <Textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Deskripsi singkat tentang layanan..."
                    rows={3}
                    value={hero.subheadline ?? ""}
                    onChange={(event) =>
                      updateField("subheadline", event.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">
                  touch_app
                </span>
                Tombol Aksi (CTA)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Label Tombol
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Contoh: Hubungi Kami"
                  value={hero.cta_label ?? ""}
                  onChange={(event) =>
                    updateField("cta_label", event.target.value)
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Tautan Tujuan (URL)
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://..."
                  value={hero.cta_url ?? ""}
                  onChange={(event) =>
                    updateField("cta_url", event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">
                  add_photo_alternate
                </span>
                Media Visual
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-2">
                  Gambar Latar (Background)
                </Label>
                <label className="relative w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center text-text-muted-light dark:text-text-muted-dark overflow-hidden">
                  {hero.background_image_url ? (
                    <img
                      alt="Background preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      src={hero.background_image_url}
                    />
                  ) : null}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-1">
                      cloud_upload
                    </span>
                    <span className="text-xs">
                      Klik untuk ganti gambar latar
                    </span>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleUpload(file, "background");
                      }
                    }}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Gambar Ilustrasi 1 (Kiri)",
                    value: hero.illustration_left_url || "",
                    variant: "left",
                  },
                  {
                    label: "Gambar Ilustrasi 2 (Kanan)",
                    value: hero.illustration_right_url || "",
                    variant: "right",
                  },
                ].map((item) => {
                  const inputId = `hero-illustration-${item.variant}`;
                  return (
                    <div key={item.variant} className="space-y-2">
                      <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-2">
                        {item.label}
                      </Label>
                      <label
                        htmlFor={inputId}
                        className="group relative flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer overflow-hidden"
                      >
                        {item.value ? (
                          <img
                            alt="Illustration preview"
                            className="absolute inset-0 h-full w-full object-contain p-4"
                            src={item.value}
                          />
                        ) : null}
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2 px-4 text-text-muted-light dark:text-text-muted-dark">
                          {!item.value ? (
                            <>
                              <span className="material-symbols-outlined text-3xl">
                                cloud_upload
                              </span>
                              <span className="text-xs">
                                Klik untuk ganti ilustrasi
                              </span>
                            </>
                          ) : null}
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="material-symbols-outlined text-white text-2xl">
                            edit
                          </span>
                        </div>
                      </label>
                      <Input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            handleUpload(
                              file,
                              item.variant as "left" | "right"
                            );
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-lg text-primary mr-4">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark">
                  Status Tampilkan di Website
                </Label>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Aktifkan untuk menampilkan bagian Hero ini kepada pengunjung.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(hero.is_active)}
              onCheckedChange={(checked) =>
                updateField("is_active", Boolean(checked))
              }
              className="w-11 h-6 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700 data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
