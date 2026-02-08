/** @format */

"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import type { ReservationState } from "./constants";
import { SecureInfoBar } from "./components/secure-info-bar";
import { ConfirmationBreadcrumb } from "./components/confirmation-breadcrumb";
import { ReservationSummaryCard } from "./components/reservation-summary-card";
import { DownloadProofModal } from "./components/download-proof-modal";
import { useReservation } from "../hooks";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type StatusReservationPageProps = {
  state: ReservationState;
  hasSignature: boolean;
  reservationId?: number;
};

export function StatusReservationPage({
  state: _state,
  hasSignature,
  reservationId,
}: StatusReservationPageProps) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const { data: reservation, isLoading, error } = useReservation(
    hasSignature ? reservationId : undefined
  );
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  return (
    <div className={plusJakarta.className}>
      <div className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <SecureInfoBar />
          <ConfirmationBreadcrumb />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            {hasSignature ? (
              <>
                {isLoading ? (
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-surface-card-dark p-8 text-sm text-gray-500 dark:text-gray-400">
                    Memuat data reservasi...
                  </div>
                ) : (
                  <ReservationSummaryCard
                    hasSignature={hasSignature}
                    reservationId={reservationId}
                    reservation={reservation ?? null}
                    proofAvailable={false}
                    onDownload={() => setDownloadOpen(true)}
                  />
                )}
                {errorMessage ? (
                  <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    {errorMessage}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="bg-white dark:bg-surface-card-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-md text-center">
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
