/** @format */

"use client";

import React from "react";
import { CalendarDays, CheckCircle2, Copy, Home } from "lucide-react";
import { useRouter } from "next/navigation";

type ReservationConfirmationViewProps = {
  onBackToHome?: () => void;
};

export function ReservationConfirmationView({
  onBackToHome,
}: ReservationConfirmationViewProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9fc] px-4 py-8 dark:bg-[#0f1115] md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center px-8 pb-10 pt-8 text-center md:px-10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#10b981] dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
              Reservasi Aset Berhasil Dikonfirmasi!
            </h1>
            <p className="mb-8 max-w-lg text-sm text-slate-500 dark:text-slate-400">
              Permintaan reservasi Anda telah kami terima dan sedang diproses.
              Detail konfirmasi telah dikirimkan ke email Anda.
            </p>

            <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kode Booking
                </span>
                <span className="block font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                  #RES-2023-8821
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-blue-50 hover:text-indigo-700 dark:hover:bg-blue-900/20"
                title="Salin Kode"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>

            <div className="my-2 w-full border-t border-dashed border-gray-300 dark:border-gray-700" />

            <div className="w-full py-6 text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ringkasan Reservasi
              </h3>
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Aset Yang Disewa
                    </p>
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjJp-Ml8FollDe2RTR3f7ISgwrNFKgf3NIlqefTgwjhjTsuJvAZV-TMzCizXfR76b3PCRzyKycFihBkD-8g0IZed67pgqtYqRdSOh3gI7aJPdGttxfZOmyJQvIw6zlzQQ6iTTEKOLDc02r9QQwmra_TnDGVL8_Tfgv1Aox9-cgTnYi4v2v4-7o_3vHaVvqHauFhzEVRcqH5c8dp9Lt7WoceDTmAAEYKhGXEz4pcN-9mgJTSoniLYXJlu4le2xf9znNXxN49tp0bfE"
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          Gedung Serbaguna Kartika Runa Wijaya
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Jl. Persaudaraan no. 2 RT 004/002
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Penyewa
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Ahmad Zubair
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      087623420972
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Check-in
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      12/02/2026
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Check-out
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      14/02/2026
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Durasi
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      2 Hari
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Total Biaya
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      Rp700.000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col items-center justify-center space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <button
                type="button"
                className="w-full flex items-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-gray-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-800 md:w-auto"
                onClick={() => (onBackToHome ? onBackToHome() : router.push("/bumdes/asset"))}
              >
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-700 md:w-auto"
                onClick={() => router.push("/bumdes/asset")}
              >
                <CalendarDays className="h-5 w-5" />
                <span>Lihat Jadwal Saya</span>
              </button>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Butuh bantuan?{" "}
          <a className="text-indigo-600 hover:underline" href="#">
            Hubungi Layanan Pelanggan
          </a>
        </p>
      </div>
    </div>
  );
}
