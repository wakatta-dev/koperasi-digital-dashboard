/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLandingContent, updateLandingContent } from "@/services/api";
import { toast } from "sonner";

export default function LandingClient() {
  const [heroTitle, setHeroTitle] = useState("Solusi Digital untuk Koperasi Anda");
  const [heroSubtitle, setHeroSubtitle] = useState("Kelola anggota, simpanan, pinjaman, dan laporan secara terpadu.");
  const [services, setServices] = useState<string>("Keanggotaan\nSimpanan\nPinjaman\nLaporan");
  const [testimonials, setTestimonials] = useState<string>("Bagus sekali! - Ketua Koperasi");
  const [contact, setContact] = useState<string>("Jl. Contoh No. 123\n(021) 123-456\ninfo@koperasi.id");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getLandingContent().catch(() => null);
      if (res && res.success && res.data) {
        const sections = Array.isArray(res.data.landing_sections)
          ? res.data.landing_sections
          : [];
        const hero = sections.find((s: any) => s.id === "hero");
        const servicesSection = sections.find((s: any) => s.id === "services");
        const testimonialsSection = sections.find(
          (s: any) => s.id === "testimonials"
        );
        const contactSection = sections.find((s: any) => s.id === "contact");

        if (hero) {
          if (hero.title) setHeroTitle(hero.title);
          if (hero.content) setHeroSubtitle(hero.content);
        } else {
          if (res.data.hero_title) setHeroTitle(res.data.hero_title);
          if (res.data.hero_subtitle) setHeroSubtitle(res.data.hero_subtitle);
        }

        if (servicesSection?.content) {
          try {
            const parsed = JSON.parse(servicesSection.content);
            if (Array.isArray(parsed)) setServices(parsed.join("\n"));
          } catch {
            setServices(servicesSection.content);
          }
        } else if (Array.isArray(res.data.services)) {
          setServices(res.data.services.join("\n"));
        }

        if (testimonialsSection?.content) {
          setTestimonials(testimonialsSection.content);
        } else if (res.data.testimonials) {
          setTestimonials(res.data.testimonials);
        }

        if (contactSection?.content) {
          setContact(contactSection.content);
        } else if (res.data.contact) {
          setContact(res.data.contact);
        }
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const serviceList = services
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      await updateLandingContent({
        landing_sections: [
          {
            id: "hero",
            title: heroTitle,
            type: "hero",
            content: heroSubtitle,
          },
          {
            id: "services",
            title: "Layanan",
            type: "list",
            content: JSON.stringify(serviceList),
          },
          {
            id: "testimonials",
            title: "Testimoni",
            type: "text",
            content: testimonials,
          },
          {
            id: "contact",
            title: "Kontak",
            type: "text",
            content: contact,
          },
        ],
      });
      toast.success("Konten landing tersimpan");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menyimpan konten");
    } finally {
      setSaving(false);
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Judul" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
            <Input placeholder="Subjudul" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Layanan</CardTitle>
            <CardDescription>Daftar layanan (satu per baris)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea rows={8} value={services} onChange={(e) => setServices(e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Testimoni</CardTitle>
            <CardDescription>Isi testimoni</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea rows={8} value={testimonials} onChange={(e) => setTestimonials(e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kontak</CardTitle>
            <CardDescription>Alamat, telepon, email</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea rows={8} value={contact} onChange={(e) => setContact(e.target.value)} />
          </CardContent>
        </Card>
      </div>

      <div>
        <Button onClick={save} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
      </div>
    </div>
  );
}
