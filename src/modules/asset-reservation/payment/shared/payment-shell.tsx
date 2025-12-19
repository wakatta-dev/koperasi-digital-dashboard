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
}: PaymentShellProps) {
  const isSettlement = mode === "settlement";
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          {breadcrumb}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {header}
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
