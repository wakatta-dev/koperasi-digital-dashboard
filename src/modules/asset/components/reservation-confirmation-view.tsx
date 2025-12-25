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
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex flex-col items-center px-8 pb-10 pt-8 text-center md:px-10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Reservasi Aset Berhasil Dikonfirmasi!
            </h1>
            <p className="mb-8 max-w-lg text-sm text-muted-foreground">
              Permintaan reservasi Anda telah kami terima dan sedang diproses.
              Detail konfirmasi telah dikirimkan ke email Anda.
            </p>

            <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Kode Booking
                </span>
                <span className="block font-mono text-lg font-bold text-foreground">
                  #RES-2023-8821
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-primary transition-colors hover:bg-muted/40 hover:text-primary"
                title="Salin Kode"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>

            <div className="my-2 w-full border-t border-dashed border-border" />

            <div className="w-full py-6 text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Ringkasan Reservasi
              </h3>
              <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Aset Yang Disewa
                    </p>
                    <div className="flex items-start space-x-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] text-muted-foreground">
                        Foto
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          Gedung Serbaguna Kartika Runa Wijaya
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Jl. Persaudaraan no. 2 RT 004/002
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Penyewa
                    </p>
                    <p className="font-medium text-foreground">
                      Ahmad Zubair
                    </p>
                    <p className="text-xs text-muted-foreground">
                      087623420972
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-border" />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Check-in
                    </p>
                    <p className="font-medium text-foreground">
                      12/02/2026
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Check-out
                    </p>
                    <p className="font-medium text-foreground">
                      14/02/2026
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Durasi
                    </p>
                    <p className="font-medium text-foreground">
                      2 Hari
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Total Biaya
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Rp700.000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col items-center justify-center space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <button
                type="button"
                className="w-full flex items-center rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 md:w-auto"
                onClick={() => (onBackToHome ? onBackToHome() : router.push("/bumdes/asset"))}
              >
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 md:w-auto"
                onClick={() => router.push("/bumdes/asset")}
              >
                <CalendarDays className="h-5 w-5" />
                <span>Lihat Jadwal Saya</span>
              </button>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Butuh bantuan?{" "}
          <a className="text-primary hover:underline" href="#">
            Hubungi Layanan Pelanggan
          </a>
        </p>
      </div>
    </div>
  );
}
