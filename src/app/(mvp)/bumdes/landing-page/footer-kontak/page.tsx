/** @format */

"use client";

import { useEffect, useState } from "react";

import { getLandingPageAdmin, updateFooter } from "@/services/landing-page";
import {
  createEmptyLandingConfig,
  type FooterColumn,
  type FooterLink,
  type FooterSection,
  type SocialLink,
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
import { DEFAULT_LANDING_CONTENT } from "@/modules/landing/constants";
import { LandingLivePreview } from "@/modules/landing/components/live-preview";
import { LandingFooter } from "@/modules/landing/components/footer";

const emptyFooter = createEmptyLandingConfig().footer ?? {
  contact_email: "",
  contact_whatsapp: "",
  address: "",
  hours: "",
  maps_url: "",
  social_links: [],
  columns: [],
  copyright_text: "",
  privacy_url: "",
  terms_url: "",
};

const socialPlatforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
];
const MAX_FOOTER_COLUMNS = 4;

export default function FooterKontakPage() {
  const [footer, setFooter] = useState<FooterSection>(emptyFooter);
  const [initial, setInitial] = useState<FooterSection>(emptyFooter);
  const [brandName, setBrandName] = useState(
    DEFAULT_LANDING_CONTENT.navigation.brand_name
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const res = await getLandingPageAdmin();
      if (!active) return;
      const data = res.data?.footer ?? emptyFooter;
      setFooter(data);
      setInitial(data);
      setBrandName(
        res.data?.navigation?.brand_name || DEFAULT_LANDING_CONTENT.navigation.brand_name
      );
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof FooterSection, value: string) => {
    setFooter((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    setFooter((prev) => {
      const social_links = [...(prev.social_links ?? [])];
      social_links[index] = { ...social_links[index], [field]: value } as SocialLink;
      return { ...prev, social_links };
    });
  };

  const addSocial = () => {
    setFooter((prev) => ({
      ...prev,
      social_links: [
        ...(prev.social_links ?? []),
        { platform: "instagram", url: "", order: (prev.social_links?.length ?? 0) + 1 },
      ],
    }));
  };

  const removeSocial = (index: number) => {
    setFooter((prev) => ({
      ...prev,
      social_links: (prev.social_links ?? []).filter((_, idx) => idx !== index),
    }));
  };

  const updateColumn = (index: number, field: keyof FooterColumn, value: string) => {
    setFooter((prev) => {
      const columns = [...(prev.columns ?? [])];
      columns[index] = { ...columns[index], [field]: value } as FooterColumn;
      return { ...prev, columns };
    });
  };

  const addColumn = () => {
    setFooter((prev) => ({
      ...prev,
      columns:
        (prev.columns ?? []).length >= MAX_FOOTER_COLUMNS
          ? prev.columns ?? []
          : [...(prev.columns ?? []), { title: "", links: [] }],
    }));
  };

  const updateColumnLink = (
    columnIndex: number,
    linkIndex: number,
    field: keyof FooterLink,
    value: string
  ) => {
    setFooter((prev) => {
      const columns = [...(prev.columns ?? [])];
      const links = [...(columns[columnIndex]?.links ?? [])];
      links[linkIndex] = { ...links[linkIndex], [field]: value } as FooterLink;
      columns[columnIndex] = { ...columns[columnIndex], links };
      return { ...prev, columns };
    });
  };

  const addColumnLink = (columnIndex: number) => {
    setFooter((prev) => {
      const columns = [...(prev.columns ?? [])];
      const links = [...(columns[columnIndex]?.links ?? [])];
      links.push({ label: "", url: "", order: links.length + 1 });
      columns[columnIndex] = { ...columns[columnIndex], links };
      return { ...prev, columns };
    });
  };

  const removeColumnLink = (columnIndex: number, linkIndex: number) => {
    setFooter((prev) => {
      const columns = [...(prev.columns ?? [])];
      const links = (columns[columnIndex]?.links ?? []).filter((_, idx) => idx !== linkIndex);
      columns[columnIndex] = { ...columns[columnIndex], links };
      return { ...prev, columns };
    });
  };

  const handleReset = () => setFooter(initial);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...footer,
      social_links: (footer.social_links ?? []).map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
      columns: (footer.columns ?? []).map((column) => ({
        ...column,
        links: (column.links ?? []).map((link, idx) => ({
          ...link,
          order: idx + 1,
        })),
      })),
    };
    const res = await updateFooter(payload);
    if (res.success && res.data?.footer) {
      setFooter(res.data.footer);
      setInitial(res.data.footer);
    }
    setSaving(false);
  };

  const previewFooter = {
    ...footer,
    social_links:
      footer.social_links && footer.social_links.length > 0
        ? footer.social_links
        : DEFAULT_LANDING_CONTENT.footer.social_links,
    columns:
      footer.columns && footer.columns.length > 0
        ? footer.columns
        : DEFAULT_LANDING_CONTENT.footer.columns,
  };
  const columnCount = footer.columns?.length ?? 0;
  const canAddColumn = columnCount < MAX_FOOTER_COLUMNS;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
            Edit Footer & Kontak
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
            Kelola informasi kontak instansi, tautan navigasi bawah, dan media sosial.
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
        <LandingFooter footer={previewFooter} brandName={brandName} />
      </LandingLivePreview>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">contact_phone</span>
                Informasi Kontak Utama
              </h2>
            </div>
            {loading ? (
              <LandingEmptyState
                title="Memuat data"
                description="Menyiapkan konfigurasi footer & kontak."
              />
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                      Email Instansi
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 text-lg">
                          mail
                        </span>
                      </div>
                      <Input
                        type="email"
                        className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                        placeholder="contoh: info@bumdes.id"
                        value={footer.contact_email ?? ""}
                        onChange={(event) =>
                          updateField("contact_email", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                      Nomor WhatsApp
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 text-lg">
                          chat
                        </span>
                      </div>
                      <Input
                        type="tel"
                        className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                        placeholder="contoh: +628..."
                        value={footer.contact_whatsapp ?? ""}
                        onChange={(event) =>
                          updateField("contact_whatsapp", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    Link Google Maps
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-lg">
                        map
                      </span>
                    </div>
                    <Input
                      type="url"
                      className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                      placeholder="https://maps.google.com/..."
                      value={footer.maps_url ?? ""}
                      onChange={(event) => updateField("maps_url", event.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                    Tautan ini akan digunakan pada tombol &quot;Petunjuk Arah&quot;.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">storefront</span>
                Alamat & Operasional
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Alamat Lengkap
                </Label>
                <Textarea
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Alamat lengkap kantor..."
                  rows={3}
                  value={footer.address ?? ""}
                  onChange={(event) => updateField("address", event.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Jam Operasional
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Contoh: Senin - Jumat, 08:00 - 16:00 WIB"
                  value={footer.hours ?? ""}
                  onChange={(event) => updateField("hours", event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">share</span>
                Media Sosial
              </h2>
            </div>
            {(footer.social_links ?? []).length === 0 ? (
              <LandingEmptyState
                title="Belum ada sosial media"
                description="Tambahkan akun sosial untuk ditampilkan di footer."
              />
            ) : (
              <div className="space-y-4">
                {(footer.social_links ?? []).map((item, index) => (
                  <div
                    key={`${item.platform}-${index}`}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-full sm:w-1/3">
                      <Select
                        value={item.platform || undefined}
                        onValueChange={(value) => updateSocial(index, "platform", value)}
                      >
                        <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary">
                          <SelectValue placeholder="Pilih platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:flex-1">
                      <Input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary"
                        placeholder="URL Profil"
                        value={item.url}
                        onChange={(event) => updateSocial(index, "url", event.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeSocial(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={addSocial}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-sm font-medium mt-2"
            >
              <span className="material-symbols-outlined text-lg mr-1">add</span>
              Tambah Media Sosial
            </Button>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">view_column</span>
                Kolom Link Footer ({footer.columns?.length ?? 0} Kolom)
              </h2>
            </div>
            {(footer.columns ?? []).length === 0 ? (
              <div className="space-y-4">
                <LandingEmptyState
                  title="Belum ada kolom footer"
                  description="Tambahkan kolom untuk mengatur tautan penting."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(footer.columns ?? []).map((column, columnIndex) => (
                  <div
                    key={`${column.title}-${columnIndex}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase text-text-muted-light dark:text-text-muted-dark tracking-wider">
                        Kolom {columnIndex + 1}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="block text-xs font-medium text-text-main-light dark:text-text-main-dark mb-1">
                          Judul Kolom
                        </Label>
                        <Input
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary"
                          value={column.title}
                          onChange={(event) =>
                            updateColumn(columnIndex, "title", event.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="block text-xs font-medium text-text-main-light dark:text-text-main-dark mb-2">
                          Daftar Link
                        </Label>
                        {(column.links ?? []).length === 0 ? (
                          <div className="text-xs text-center text-text-muted-light py-4 italic">
                            Belum ada link
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(column.links ?? []).map((link, linkIndex) => (
                              <div key={`${link.label}-${linkIndex}`} className="flex gap-2">
                                <Input
                                  className="w-1/3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-xs"
                                  placeholder="Label"
                                  value={link.label}
                                  onChange={(event) =>
                                    updateColumnLink(
                                      columnIndex,
                                      linkIndex,
                                      "label",
                                      event.target.value
                                    )
                                  }
                                />
                                <Input
                                  className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-xs"
                                  placeholder="URL"
                                  value={link.url}
                                  onChange={(event) =>
                                    updateColumnLink(
                                      columnIndex,
                                      linkIndex,
                                      "url",
                                      event.target.value
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeColumnLink(columnIndex, linkIndex)}
                                  className="text-gray-400 hover:text-red-500 h-auto p-0"
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    close
                                  </span>
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => addColumnLink(columnIndex)}
                          className="text-primary text-xs font-medium hover:underline flex items-center mt-1 h-auto p-0"
                        >
                          + Tambah Link
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={addColumn}
              disabled={!canAddColumn}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-sm font-medium mt-4 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-text-muted-light dark:disabled:hover:border-gray-600"
            >
              <span className="material-symbols-outlined text-lg mr-1">add</span>
              {canAddColumn ? "Tambah Kolom" : "Maksimal 4 Kolom"}
            </Button>
          </div>

          <div className="surface-card p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">gavel</span>
                Legal & Copyright
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                  Teks Copyright
                </Label>
                <Input
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                  placeholder="(c) 2024 BUMDes..."
                  value={footer.copyright_text ?? ""}
                  onChange={(event) => updateField("copyright_text", event.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    URL Kebijakan Privasi
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="/privacy-policy"
                    value={footer.privacy_url ?? ""}
                    onChange={(event) => updateField("privacy_url", event.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-text-main-light dark:text-text-main-dark mb-1">
                    URL Syarat & Ketentuan
                  </Label>
                  <Input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary transition-colors"
                    placeholder="/terms"
                    value={footer.terms_url ?? ""}
                    onChange={(event) => updateField("terms_url", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
