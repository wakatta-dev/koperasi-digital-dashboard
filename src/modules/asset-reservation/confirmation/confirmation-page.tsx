/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { ConfirmationBreadcrumb } from "./components/confirmation-breadcrumb";
import { ConfirmationCard } from "./components/confirmation-card";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function AssetConfirmationPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <ConfirmationBreadcrumb />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <ConfirmationCard />
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
