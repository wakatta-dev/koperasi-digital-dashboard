/** @format */

"use client";

import React from "react";
import {
  CalendarDays,
  CheckCircle,
  ChevronRight,
  CircleDot,
  Clock3,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssetItem } from "../types";
import { cn } from "@/lib/utils";

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

export function AssetDetailView({ asset, onBack }: AssetDetailViewProps) {
  const router = useRouter();
  const [showReservationModal, setShowReservationModal] = React.useState(false);

  return (
    <div className="bg-[#f8f9fc] dark:bg-[#0f1115]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              Manajemen Aset
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Detail Aset
            </span>
          </div>
        </header>

        <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Detail Aset
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
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
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-indigo-600">
                    {asset.price}
                    <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">
                      {asset.unit}
                    </span>
                  </div>
                  <div className="mt-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 shadow-none dark:bg-green-900/20">
                    Tersedia
                  </div>
                </div>
              </div>

              <div className="mb-8 h-[400px] w-full overflow-hidden rounded-xl">
                <img
                  src={asset.image}
                  alt={asset.alt}
                  className="h-full w-full object-cover"
                />
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
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center space-x-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Clock3 className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Reservasi Aset
                </h3>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Mulai Sewa
                    </label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="date"
                        className={cn(
                          "h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm text-slate-900 shadow-none transition-colors focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Selesai Sewa
                    </label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="date"
                        className={cn(
                          "h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm text-slate-900 shadow-none transition-colors focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="mb-4 flex items-center text-sm font-bold text-slate-900 dark:text-slate-100">
                    <CircleDot className="mr-2 h-3 w-3 text-indigo-600" />
                    Data Penyewa
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
                        Nama Lengkap Penyewa
                      </label>
                      <Input
                        placeholder="Contoh: Budi Santoso"
                        className={cn(
                          "h-auto rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-none focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        )}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
                        Nomor Telepon Penyewa
                      </label>
                      <Input
                        type="tel"
                        placeholder="08123456789"
                        className={cn(
                          "h-auto rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-none focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        )}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
                        Alamat Penyewa
                      </label>
                      <Input
                        placeholder="Alamat lengkap..."
                        className={cn(
                          "h-auto rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-none focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        )}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
                        Keperluan Sewa
                      </label>
                      <Textarea
                        rows={3}
                        placeholder="Deskripsikan keperluan acara..."
                        className={cn(
                          "min-h-[100px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-none focus:border-indigo-600 focus:ring-indigo-600",
                          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                    Biaya Reservasi
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Harga Sewa (1 Hari)</span>
                      <span>Rp350.000</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Biaya Administrasi</span>
                      <span>Rp10.000</span>
                    </div>
                    <div className="my-2 flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                      <span>Total Estimasi</span>
                      <span className="text-indigo-600">Rp360.000</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30"
                  onClick={() => setShowReservationModal(true)}
                >
                  <CheckCircle className="h-5 w-5" />
                  Proses Reservasi
                </Button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {showReservationModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32">
                <div
                  className="absolute right-0 top-0 text-blue-400 opacity-80"
                  style={{ transform: "rotate(15deg) translate(10px, -10px)" }}
                >
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                </div>
                <div className="absolute bottom-4 left-0 text-blue-300 opacity-80">
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                    <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                      <span className="material-symbols-outlined text-5xl font-bold">
                        check
                      </span>
                    </div>
                    <div className="absolute -right-4 top-2 -z-0 flex h-20 w-16 rotate-12 flex-col items-center justify-center rounded bg-white p-1 shadow-sm">
                      <div className="mb-1 h-1 w-8 rounded bg-blue-100" />
                      <div className="mb-1 h-1 w-10 rounded bg-gray-100" />
                      <div className="h-1 w-6 rounded bg-gray-100" />
                      <div className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                        <span className="material-symbols-outlined text-[10px] text-blue-500">
                          check
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
              Reservasi Diproses
            </h2>
            <p className="mb-8 px-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Reservasi Anda untuk{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {asset.title}
              </span>{" "}
              telah berhasil dikirim. Pengurus akan segera menghubungi Anda melalui
              WhatsApp untuk memberikan informasi lebih lanjut terkait reservasi yang
              diminta.
            </p>
            <Button
              type="button"
              className="h-auto w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 active:scale-[0.98]"
              onClick={() => {
                setShowReservationModal(false);
                router.push("/bumdes/asset/reservation/confirmation");
              }}
            >
              Beranda
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
