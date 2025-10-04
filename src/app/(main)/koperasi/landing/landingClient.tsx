/** @format */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLandingContent, updateLandingContent } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import { toast } from "sonner";

type LandingSectionDto = {
  id: string;
  title: string;
  type: string;
  content: string;
};

type LandingFormState = {
  heroTitle: string;
  heroSubtitle: string;
  services: string;
  testimonials: string;
  contact: string;
};

const DEFAULT_FORM: LandingFormState = {
  heroTitle: "Solusi Digital untuk Koperasi Anda",
  heroSubtitle: "Kelola anggota, simpanan, pinjaman, dan laporan secara terpadu.",
  services: "Keanggotaan\nSimpanan\nPinjaman\nLaporan",
  testimonials: "Bagus sekali! - Ketua Koperasi",
  contact: "Jl. Contoh No. 123\n(021) 123-456\ninfo@koperasi.id",
};

export default function LandingClient() {
  const [form, setForm] = useState<LandingFormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const existingSectionsRef = useRef<Set<string>>(new Set());

  const setField = useCallback(<K extends keyof LandingFormState>(key: K) => {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res: ApiResponse<any> | null = await getLandingContent().catch(
          () => null
        );
        if (!res || !res.success || !res.data || ignore) {
          if (!res?.success && res?.message) {
            toast.error(res.message);
          }
          return;
        }

        const sections = Array.isArray(res.data.landing_sections)
          ? res.data.landing_sections
          : [];

        existingSectionsRef.current = new Set(
          sections.map((section: any) => sanitizeId(section?.id)).filter(Boolean)
        );

        setForm((prev) => ({
          heroTitle:
            findTextValue(sections, "hero", "title") ||
            sanitizeText(res.data.hero_title) ||
            prev.heroTitle,
          heroSubtitle:
            findTextValue(sections, "hero", "content") ||
            sanitizeText(res.data.hero_subtitle) ||
            prev.heroSubtitle,
          services:
            findServicesText(sections, res.data.services) || prev.services,
          testimonials:
            findTextValue(sections, "testimonials", "content") ||
            sanitizeText(res.data.testimonials) ||
            prev.testimonials,
          contact:
            findTextValue(sections, "contact", "content") ||
            sanitizeText(res.data.contact) ||
            prev.contact,
        }));
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat konten landing"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const serviceItems = useMemo(() =>
    form.services
      .split("\n")
      .map((item) => sanitizeText(item))
      .filter(Boolean),
  [form.services]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const sections = buildSections({
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
        services: serviceItems,
        testimonials: form.testimonials,
        contact: form.contact,
      });

      const existing = existingSectionsRef.current;
      const add: Array<Omit<LandingSectionDto, "id"> & { position: number }> = [];
      const update: LandingSectionDto[] = [];

      sections.forEach((section, index) => {
        if (existing.has(section.id)) {
          update.push(section);
        } else {
          const { id: _id, ...rest } = section;
          add.push({ ...rest, position: index });
        }
      });

      const payload: Record<string, unknown> = {};
      if (add.length || update.length) {
        payload.landing_sections = {
          ...(add.length ? { add } : {}),
          ...(update.length ? { update } : {}),
        };
      }

      if (!payload.landing_sections) {
        toast.message("Tidak ada perubahan untuk disimpan");
        return;
      }

      const res: ApiResponse<any> = await updateLandingContent(payload);
      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan konten");
      }

      existingSectionsRef.current = new Set(
        sections.map((section) => section.id)
      );
      toast.success("Konten landing tersimpan");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan konten"
      );
    } finally {
      setSaving(false);
    }
  }, [form.contact, form.heroSubtitle, form.heroTitle, form.testimonials, serviceItems]);

  const disableActions = loading || saving;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Landing Page</h2>
        <p className="text-muted-foreground">Editor konten publik</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Judul dan subjudul utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              placeholder="Judul"
              value={form.heroTitle}
              onChange={(event) => setField("heroTitle")(event.target.value)}
              disabled={disableActions}
            />
            <Input
              placeholder="Subjudul"
              value={form.heroSubtitle}
              onChange={(event) => setField("heroSubtitle")(event.target.value)}
              disabled={disableActions}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Layanan</CardTitle>
            <CardDescription>Daftar layanan (satu per baris)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              value={form.services}
              onChange={(event) => setField("services")(event.target.value)}
              disabled={disableActions}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Testimoni</CardTitle>
            <CardDescription>Isi testimoni</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              value={form.testimonials}
              onChange={(event) => setField("testimonials")(event.target.value)}
              disabled={disableActions}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kontak</CardTitle>
            <CardDescription>Alamat, telepon, email</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              value={form.contact}
              onChange={(event) => setField("contact")(event.target.value)}
              disabled={disableActions}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Button onClick={handleSave} disabled={disableActions}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

function sanitizeText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeId(value?: string | null): string {
  return sanitizeText(value);
}

function buildSections(form: {
  heroTitle: string;
  heroSubtitle: string;
  services: string[];
  testimonials: string;
  contact: string;
}): LandingSectionDto[] {
  return [
    {
      id: "hero",
      title: sanitizeText(form.heroTitle) || DEFAULT_FORM.heroTitle,
      type: "hero",
      content: sanitizeText(form.heroSubtitle) || DEFAULT_FORM.heroSubtitle,
    },
    {
      id: "services",
      title: "Layanan",
      type: "list",
      content: JSON.stringify(form.services),
    },
    {
      id: "testimonials",
      title: "Testimoni",
      type: "text",
      content:
        sanitizeText(form.testimonials) || DEFAULT_FORM.testimonials,
    },
    {
      id: "contact",
      title: "Kontak",
      type: "text",
      content: sanitizeText(form.contact) || DEFAULT_FORM.contact,
    },
  ];
}

function findTextValue(
  sections: any[],
  id: string,
  field: "title" | "content"
): string {
  const entry = sections.find((section) => sanitizeId(section?.id) === id);
  return sanitizeText(entry?.[field]);
}

function findServicesText(sections: any[], fallback?: unknown): string {
  const content = findTextValue(sections, "services", "content");
  if (content) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => sanitizeText(item))
          .filter(Boolean)
          .join("\n");
      }
    } catch {
      return content;
    }
  }
  if (Array.isArray(fallback)) {
    return fallback
      .map((item) => sanitizeText(item))
      .filter(Boolean)
      .join("\n");
  }
  return DEFAULT_FORM.services;
}
