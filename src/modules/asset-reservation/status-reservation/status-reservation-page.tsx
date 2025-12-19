/** @format */

"use client";

import { useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import type { ReservationState } from "./constants";
import { SecureInfoBar } from "./components/secure-info-bar";
import { ConfirmationBreadcrumb } from "../confirmation/components/confirmation-breadcrumb";
import { ReservationSummaryCard } from "./components/reservation-summary-card";
import { DownloadProofModal } from "./components/download-proof-modal";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type StatusReservationPageProps = {
  state: ReservationState;
  hasSignature: boolean;
};

export function StatusReservationPage({ state, hasSignature }: StatusReservationPageProps) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const selectedState = useMemo<ReservationState>(
    () => (state === "done" ? "done" : "dp"),
    [state]
  );

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <SecureInfoBar />
          <ConfirmationBreadcrumb />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            {hasSignature ? (
              <>
                <ReservationSummaryCard
                  state={selectedState}
                  hasSignature={hasSignature}
                  onDownload={() => setDownloadOpen(true)}
                />
              </>
            ) : (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                  <span className="material-icons-outlined text-amber-600 dark:text-amber-400 text-3xl">
                    lock
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tautan tidak valid
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tautan ini memerlukan signature yang sah. Silakan gunakan tautan resmi yang
                  dikirim setelah pembayaran DP.
                </p>
              </div>
            )}
          </div>
        </main>
        <AssetReservationFooter />
        <DownloadProofModal open={downloadOpen} onOpenChange={setDownloadOpen} />
      </div>
    </div>
  );
}
