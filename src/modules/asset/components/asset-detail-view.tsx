/** @format */

import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssetItem } from "../types";

type AssetDetailViewProps = {
  asset: AssetItem;
  onBack?: () => void;
};

export function AssetDetailView({ asset }: AssetDetailViewProps) {
  const descriptionLines = asset.description?.split("\n").filter(Boolean) ?? [];
  const statusLabel = (() => {
    const raw = (asset.status || "").toString().toUpperCase();
    if (raw === "ACTIVE") return "Aktif";
    if (raw === "ARCHIVED") return "Nonaktif";
    if (!raw) return "Tidak tersedia";
    return raw;
  })();

  return (
    <div className="rounded-3xl bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Manajemen Aset</p>
            <h1 className="text-2xl font-bold text-foreground">Detail Aset</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{statusLabel}</Badge>
            <span>Terakhir diperbarui: Tidak tersedia</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold leading-snug text-foreground">
                    {asset.title}
                  </h2>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    <span className="text-base">
                      Lokasi belum diatur
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Halaman ini hanya untuk melihat detail aset dan menjaga
                    kelengkapan data. Permintaan reservasi diproses di halaman
                    jadwal/approval.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-primary">
                    {asset.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {asset.unit}
                    </span>
                  </div>
                  <Badge variant="secondary">{statusLabel}</Badge>
                  <span className="text-xs text-muted-foreground">
                    ID Aset: {asset.id}
                  </span>
                </div>
              </div>

              <div className="mb-8 h-[400px] w-full overflow-hidden rounded-xl">
                {asset.image ? (
                  <img
                    src={asset.image}
                    alt={asset.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="mb-3 border-b border-border pb-2 text-lg font-bold text-foreground">
                  Deskripsi
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {descriptionLines.length > 0 ? (
                    descriptionLines.map((line, idx) => <p key={idx}>{line}</p>)
                  ) : (
                    <p>Deskripsi belum tersedia.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b border-border pb-2 text-lg font-bold text-foreground">
                  Fasilitas Aset
                </h3>
                <div className="text-sm text-muted-foreground">
                  Fasilitas belum tersedia.
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-foreground">
                Catatan Pengelolaan
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Proses penambahan reservasi dilakukan oleh penyewa melalui
                  kanal klien. Tim pengelola hanya melakukan validasi dan
                  approval di halaman jadwal.
                </li>
                <li>
                  Pastikan data aset (harga, foto, kapasitas) selalu mutakhir
                  sebelum menerima permintaan sewa baru.
                </li>
                <li>
                  Gunakan halaman jadwal untuk memblokir tanggal yang tidak
                  tersedia agar tidak terjadi bentrokan reservasi.
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-auto rounded-lg  px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors"
                >
                  <Link href="/bumdes/asset/jadwal">
                    Kelola jadwal & approval
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto rounded-lg px-4 py-2 text-sm font-semibold"
                >
                  <Link href="/bumdes/asset/manajemen">
                    Kembali ke daftar aset
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Ringkasan Aset
                </h3>
                <Badge variant="outline">Manajemen</Badge>
              </div>
              <dl className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <dt>Harga Sewa</dt>
                  <dd className="font-semibold text-foreground">
                    {asset.price}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {asset.unit}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Status Operasional</dt>
                  <dd>
                    <Badge variant="secondary">{statusLabel}</Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Kode</dt>
                  <dd className="font-semibold text-foreground">{asset.id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Jadwal & approval</dt>
                  <dd>
                    <Link
                      href="/bumdes/asset/jadwal"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Buka halaman jadwal
                    </Link>
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground shadow-none">
                  Proses reservasi tidak tersedia di halaman ini. Semua
                  permintaan baru harus masuk melalui kanal klien dan diproses
                  pada halaman jadwal/approval.
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
