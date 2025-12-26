/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { ConfirmationBreadcrumb } from "./components/confirmation-breadcrumb";
import { ConfirmationCard } from "./components/confirmation-card";
import { useReservation } from "../hooks";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetConfirmationPageProps = {
  reservationId?: string;
};

export function AssetConfirmationPage({ reservationId }: AssetConfirmationPageProps) {
  const { data: reservation, isLoading, error } = useReservation(reservationId);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const paymentHref = reservationId
    ? `/penyewaan-aset/payment?reservationId=${encodeURIComponent(reservationId)}`
    : undefined;

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <ConfirmationBreadcrumb paymentHref={paymentHref} />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {isLoading ? (
              <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e293b] p-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                Memuat data reservasi...
              </div>
            ) : reservation ? (
              <ConfirmationCard reservation={reservation} />
            ) : (
              <div className="rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-8 text-sm text-amber-700 dark:text-amber-200 text-center">
                Data reservasi tidak tersedia.
              </div>
            )}
            {errorMessage ? (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                {errorMessage}
              </div>
            ) : null}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8 max-w-lg mx-auto">
              Jika Anda memiliki pertanyaan mengenai reservasi ini, silakan hubungi tim dukungan
              BUMDes Sukamaju melalui halaman kontak.
            </p>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
