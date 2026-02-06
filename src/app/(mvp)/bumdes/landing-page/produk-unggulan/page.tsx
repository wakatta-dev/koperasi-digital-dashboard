/** @format */

"use client";

import { useEffect, useState } from "react";

import {
  getLandingPageAdmin,
  updateFeaturedProduct,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type FeaturedProductSection,
} from "@/types/landing-page";
import { LandingEmptyState } from "@/modules/landing/components/landing-empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { ProductHighlight } from "@/modules/landing/components/product-highlight";

const emptyFeatured = createEmptyLandingConfig().featured_product ?? {
  title: "",
  description: "",
  product_id: "",
  display_title: "",
  display_price: "",
  display_description: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
};

const productOptions = [
  { value: "1", label: "Kopi Robusta Premium (Stok: 50)" },
  { value: "2", label: "Keripik Singkong Balado (Stok: 120)" },
  { value: "3", label: "Kain Tenun Desa (Stok: 15)" },
  { value: "4", label: "Madu Hutan Murni (Stok: 30)" },
];

export default function ProdukUnggulanPage() {
  const [featured, setFeatured] = useState<FeaturedProductSection>(emptyFeatured);
  const [initial, setInitial] = useState<FeaturedProductSection>(emptyFeatured);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.featured_product ?? emptyFeatured;
      setFeatured(data);
      setInitial(data);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof FeaturedProductSection, value: string) => {
    setFeatured((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "featured_product");
    formData.append("variant", "image");
    const res = await uploadLandingMedia(formData);
    if (res.success && res.data?.url) {
      updateField("image_url", res.data.url);
    }
  };

  const handleReset = () => setFeatured(initial);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateFeaturedProduct(featured);
    if (res.success && res.data?.featured_product) {
      setFeatured(res.data.featured_product);
      setInitial(res.data.featured_product);
    }
    setSaving(false);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Spotlight Produk Unggulan
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola produk utama yang akan ditampilkan sebagai highlight di halaman depan.
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

      <div className="space-y-4">
        <LandingLivePreview contentClassName="p-0 bg-transparent">
          <ProductHighlight featuredProduct={featured} />
        </LandingLivePreview>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-4 flex items-start">
          <span className="material-symbols-outlined text-blue-500 mr-3 text-xl">info</span>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            Perubahan pada form di samping akan di-update secara otomatis ke Landing Page setelah
            Anda menekan tombol <strong>Simpan Perubahan</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">view_quilt</span>
                Pengaturan Section
              </h2>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi produk unggulan."
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Section
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Produk Unggulan Desa"
                    value={featured.title ?? ""}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Subjudul / Deskripsi Pengantar
                  </Label>
                  <Textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Kami mempersembahkan produk terbaik..."
                    rows={3}
                    value={featured.description ?? ""}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">inventory_2</span>
                Pilih Produk Utama
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Cari Produk dari Katalog
                </Label>
                <Select
                  value={featured.product_id ? String(featured.product_id) : undefined}
                  onValueChange={(value) => updateField("product_id", value)}
                >
                  <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder="Pilih produk..." />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">
                  Memilih produk akan secara otomatis menarik data dasar produk tersebut. Anda
                  dapat mengubah detail tampilan khusus landing page di bawah ini.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">edit_note</span>
                Override Detail Produk (Opsional)
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Data yang diisi di sini akan menimpa data asli produk khusus untuk tampilan
                spotlight ini.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Judul Produk (Tampilan)
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Gunakan judul asli jika kosong"
                    value={featured.display_title ?? ""}
                    onChange={(event) => updateField("display_title", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Harga (Tampilan)
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Contoh: Rp 75.000"
                    value={featured.display_price ?? ""}
                    onChange={(event) => updateField("display_price", event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Deskripsi Produk (Tampilan)
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
                    value={featured.display_description ?? ""}
                    onChange={(event) => updateField("display_description", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">image</span>
                Gambar Spotlight
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Upload foto produk resolusi tinggi untuk ditampilkan besar pada spotlight (Rasio
                disarankan 1:1 atau 4:3).
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="spotlight-image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 transition-colors group relative overflow-hidden"
              >
                {featured.image_url ? (
                  <img
                    alt="Spotlight preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    src={featured.image_url}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG (Maks. 5MB)</p>
                </div>
              </Label>
              <Input
                id="spotlight-image-upload"
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
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">touch_app</span>
                Konfigurasi Tombol CTA
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Tombol ajakan bertindak yang mengarah ke pembelian atau detail produk.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Label Tombol
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Contoh: Beli Sekarang"
                  value={featured.cta_label ?? ""}
                  onChange={(event) => updateField("cta_label", event.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Tautan Tujuan
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Link ke Marketplace / WA"
                  value={featured.cta_url ?? ""}
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
