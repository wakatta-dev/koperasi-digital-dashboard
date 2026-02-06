/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../../components/reservation-footer";
import type { PaymentMode } from "../../types";

type PaymentShellProps = {
  mode: PaymentMode;
  breadcrumb: ReactNode;
  header: ReactNode;
  summary: ReactNode;
  methods: ReactNode;
  sidebar: ReactNode;
  loading?: boolean;
  error?: string | null;
  info?: ReactNode;
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function PaymentShell({
  mode,
  breadcrumb,
  header,
  summary,
  methods,
  sidebar,
  loading,
  error,
  info,
}: PaymentShellProps) {
  const isSettlement = mode === "settlement";
  return (
    <div className={plusJakarta.className}>
      <div className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          {breadcrumb}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {header}
            {info}
            {error ? (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {error}
              </div>
            ) : null}
            {loading ? (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                <div className={isSettlement ? "lg:col-span-2 space-y-4" : "lg:col-span-2 space-y-4"}>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
                <div className={isSettlement ? "lg:col-span-1 space-y-4" : "lg:col-span-1 space-y-4"}>
                  <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>
            ) : null}
            <div
              className={
                isSettlement
                  ? "lg:grid lg:grid-cols-12 lg:gap-10 items-start"
                  : "grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12"
              }
            >
              <div className={isSettlement ? "lg:col-span-8 space-y-8" : "lg:col-span-2 space-y-8"}>
                {summary}
                {methods}
              </div>
              <div className={isSettlement ? "lg:col-span-4 mt-8 lg:mt-0" : "lg:col-span-1"}>
                {sidebar}
              </div>
            </div>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
