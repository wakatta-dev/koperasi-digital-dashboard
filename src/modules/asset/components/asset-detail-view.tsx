/** @format */

import Link from "next/link";
import { CheckCircle, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssetItem } from "../types";

type AssetDetailViewProps = {
  asset: AssetItem;
  onBack?: () => void;
};

const facilityItems = [
  "Ruang Utama Full AC (Central)",
  "Sound System Professional 5000W",
  "Panggung Modular (Max 8x4m)",
  "Kursi Futura + Cover (200 unit)",
  "Ruang VIP / Ruang Tunggu",
  "Area Parkir Luas (50 Mobil)",
  "Toilet Bersih & Terawat",
  "Musholla Kapasitas 20 Orang",
];

export function AssetDetailView({ asset }: AssetDetailViewProps) {
  return (
    <div className="bg-[#f8f9fc] dark:bg-[#0f1115] rounded-3xl">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Manajemen Aset
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Detail Aset
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              Aktif
            </Badge>
            <span>Terakhir diperbarui: 12 Jan 2025</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold leading-snug text-slate-900 dark:text-slate-100">
                    {asset.title}
                  </h2>
                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <MapPin className="mr-2 h-5 w-5 text-indigo-600" />
                    <span className="text-base">
                      Jl. Persaudaraan no. 2 RT 004/002
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Halaman ini hanya untuk melihat detail aset dan menjaga
                    kelengkapan data. Permintaan reservasi diproses di halaman
                    jadwal/approval.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-indigo-600">
                    {asset.price}
                    <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">
                      {asset.unit}
                    </span>
                  </div>
                  <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 shadow-none dark:bg-green-900/20">
                    Dapat disewakan
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
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
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    Tidak ada foto
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="mb-3 border-b border-slate-200 pb-2 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                  Deskripsi
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>
                    Gedung Serbaguna Kartika Runa Wijaya merupakan fasilitas
                    premium yang dirancang untuk memenuhi kebutuhan berbagai
                    jenis acara. Dengan desain arsitektur modern yang memadukan
                    estetika dan fungsionalitas, gedung ini menawarkan ruang
                    yang luas, nyaman, dan fleksibel.
                  </p>
                  <p>
                    Cocok digunakan untuk resepsi pernikahan, seminar,
                    lokakarya, pertemuan korporat, hingga pameran. Lokasinya
                    yang strategis di pusat area dengan akses mudah
                    menjadikannya pilihan utama bagi penyelenggara acara yang
                    mengutamakan kenyamanan tamu.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                  Fasilitas Aset
                </h3>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                  {facilityItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start text-slate-900 dark:text-slate-100"
                    >
                      <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Catatan Pengelolaan
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
                  className="h-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  <Link href="/bumdes/asset/jadwal">Kelola jadwal & approval</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto rounded-lg px-4 py-2 text-sm font-semibold"
                >
                  <Link href="/bumdes/asset/manajemen">Kembali ke daftar aset</Link>
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Ringkasan Aset
                </h3>
                <Badge
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 dark:border-indigo-900 dark:text-indigo-300"
                >
                  Manajemen
                </Badge>
              </div>
              <dl className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Harga Sewa
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100">
                    {asset.price}
                    <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                      {asset.unit}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Status Operasional
                  </dt>
                  <dd className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Aktif
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Kode</dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100">
                    {asset.id}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Jadwal & approval
                  </dt>
                  <dd>
                    <Link
                      href="/bumdes/asset/jadwal"
                      className="text-indigo-600 underline-offset-2 hover:underline"
                    >
                      Buka halaman jadwal
                    </Link>
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 shadow-none dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                  Proses reservasi tidak tersedia di halaman ini. Semua permintaan
                  baru harus masuk melalui kanal klien dan diproses pada halaman
                  jadwal/approval.
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
