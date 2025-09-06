/** @format */

'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LandingClient() {
  // TODO integrate API: load/save public landing content
  const [heroTitle, setHeroTitle] = useState("Solusi Digital untuk Koperasi Anda");
  const [heroSubtitle, setHeroSubtitle] = useState("Kelola anggota, simpanan, pinjaman, dan laporan secara terpadu.");
  const [services, setServices] = useState<string>("Keanggotaan\nSimpanan\nPinjaman\nLaporan");
  const [testimonials, setTestimonials] = useState<string>("Bagus sekali! - Ketua Koperasi");
  const [contact, setContact] = useState<string>("Jl. Contoh No. 123\n(021) 123-456\ninfo@koperasi.id");

  function save() {
    // TODO: persist content
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
        <Button onClick={save}>Simpan</Button>
      </div>
    </div>
  );
}

