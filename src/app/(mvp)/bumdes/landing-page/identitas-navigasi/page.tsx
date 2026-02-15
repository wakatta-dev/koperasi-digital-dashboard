/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  getLandingPageAdmin,
  updateNavigation,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type NavigationConfig,
  type NavigationItem,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyNavigation = createEmptyLandingConfig().navigation ?? {
  brand_name: "",
  logo_light_url: "",
  logo_dark_url: "",
  favicon_url: "",
  cta_label: "",
  cta_url: "",
  items: [],
};

export default function IdentitasNavigasiPage() {
  const [navigation, setNavigation] = useState<NavigationConfig>(emptyNavigation);
  const [initial, setInitial] = useState<NavigationConfig>(emptyNavigation);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const nav = res.data?.navigation ?? emptyNavigation;
      setNavigation(nav);
      setInitial(nav);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof NavigationConfig, value: string) => {
    setNavigation((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof NavigationItem, value: string) => {
    setNavigation((prev) => {
      const items = [...(prev.items ?? [])];
      items[index] = { ...items[index], [field]: value } as NavigationItem;
      return { ...prev, items };
    });
  };

  const addMenuItem = () => {
    setNavigation((prev) => ({
      ...prev,
      items: [
        ...(prev.items ?? []),
        { label: "", url: "", order: (prev.items?.length ?? 0) + 1 },
      ],
    }));
  };

  const removeMenuItem = (index: number) => {
    setNavigation((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const handleUpload = async (file: File, target: "logo" | "logo-dark" | "favicon") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "navigation");
    formData.append("variant", target);
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      if (target === "logo") updateField("logo_light_url", res.data.url);
      if (target === "logo-dark") updateField("logo_dark_url", res.data.url);
      if (target === "favicon") updateField("favicon_url", res.data.url);
    }
  };

  const handleReset = () => setNavigation(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...navigation,
      items: (navigation.items ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    };
    const res = await updateNavigation(payload);
    if (res.success && res.data?.navigation) {
      setNavigation(res.data.navigation);
      setInitial(res.data.navigation);
    }
    setSaving(false);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Header & Navigasi
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola identitas website, logo, dan link navigasi utama.
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

      <LandingLivePreview
        description="Tampilan header Anda yang sekarang aktif. Perubahan pada menu dan logo akan langsung terlihat di sini setelah disimpan."
        contentClassName="p-0 bg-transparent"
      >
        <LandingNavbar
          activeLabel="Beranda"
          navigation={navigation}
          className="static"
        />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">badge</span>
                Identitas Website
              </h2>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi identitas."
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Nama BUMDes
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: BUMDes Maju Jaya"
                    value={navigation.brand_name ?? ""}
                    onChange={(event) => updateField("brand_name", event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      key: "logo_light_url",
                      label: "Logo Utama (Light)",
                      variant: "logo",
                    },
                    {
                      key: "logo_dark_url",
                      label: "Logo Alternatif (Dark)",
                      variant: "logo-dark",
                    },
                    {
                      key: "favicon_url",
                      label: "Favicon",
                      variant: "favicon",
                    },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-2">
                        {item.label}
                      </Label>
                      <Label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 transition-colors group relative overflow-hidden">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 p-4 text-center">
                          <span className="material-symbols-outlined text-gray-400 text-3xl mb-2 group-hover:text-primary transition-colors">
                            {item.key === "favicon_url" ? "favorite" : "image"}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Upload {item.key === "favicon_url" ? "Icon" : "Logo"}
                          </p>
                        </div>
                        {navigation[item.key as keyof NavigationConfig] ? (
                          <img
                            src={navigation[item.key as keyof NavigationConfig] as string}
                            alt={item.label}
                            className="absolute inset-0 h-full w-full object-contain bg-white/80 dark:bg-gray-800/80 p-4"
                          />
                        ) : null}
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              handleUpload(
                                file,
                                item.variant as "logo" | "logo-dark" | "favicon"
                              );
                            }
                          }}
                        />
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                  <span className="material-symbols-outlined mr-2 text-primary">menu</span>
                  Menu Navigasi
                </h2>
              </div>
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Drag untuk mengatur urutan
              </span>
            </div>
            {(navigation.items ?? []).length === 0 ? (
              <LandingEmptyState
                title="Belum ada menu"
                description="Tambahkan menu navigasi agar pengunjung mudah menemukan informasi."
              />
            ) : (
              <div className="space-y-4">
                {(navigation.items ?? []).map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 group hover:border-primary/50 transition-colors"
                  >
                    <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <span className="material-symbols-outlined text-xl">drag_indicator</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-text-muted-light dark:text-text-muted-dark block mb-1">
                          Label Menu
                        </Label>
                        <Input
                          className="h-auto w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm py-1.5 focus:ring-primary focus:border-primary"
                          value={item.label}
                          onChange={(event) => updateItem(index, "label", event.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-text-muted-light dark:text-text-muted-dark block mb-1">
                          URL / Tautan
                        </Label>
                        <Input
                          className="h-auto w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm py-1.5 focus:ring-primary focus:border-primary"
                          value={item.url}
                          onChange={(event) => updateItem(index, "url", event.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeMenuItem(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 h-auto"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={addMenuItem}
              className="w-full py-3 mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:text-primary hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center font-medium text-sm h-auto"
            >
              <span className="material-symbols-outlined mr-2">add</span>
              Tambah Menu
            </Button>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">touch_app</span>
                CTA Header
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Tombol aksi utama di sebelah kanan header (misal: Kontak Kami atau Login).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Label Tombol CTA
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  value={navigation.cta_label ?? ""}
                  onChange={(event) => updateField("cta_label", event.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Tautan Tombol
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://..."
                  value={navigation.cta_url ?? ""}
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
