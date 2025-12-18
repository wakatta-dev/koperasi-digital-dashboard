/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { RepaymentBreadcrumb } from "./components/repayment-breadcrumb";
import { RepaymentHeader } from "./components/repayment-header";
import { RepaymentSummaryCard } from "./components/repayment-summary-card";
import { RepaymentMethods } from "./components/repayment-methods";
import { RepaymentSidebar } from "./components/repayment-sidebar";
import { REPAYMENT_BREADCRUMB } from "./constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function AssetRepaymentPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <RepaymentBreadcrumb />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <RepaymentHeader backHref={REPAYMENT_BREADCRUMB.backHref} />
            <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
              <div className="lg:col-span-8 space-y-8">
                <RepaymentSummaryCard />
                <RepaymentMethods />
              </div>
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <RepaymentSidebar />
              </div>
            </div>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
