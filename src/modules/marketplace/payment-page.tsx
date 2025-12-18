/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { CART_BADGE } from "./constants";
import { PaymentBreadcrumbs } from "./components/payment-breadcrumbs";
import { PaymentSteps } from "./components/payment-steps";
import { PaymentVaSection } from "./components/payment-va-section";
import { PaymentOtherSection } from "./components/payment-other-section";
import { PaymentSummaryCard } from "./components/payment-summary-card";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplacePaymentPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentBreadcrumbs />
            <PaymentSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Metode Pembayaran</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <PaymentVaSection />
                <PaymentOtherSection />
                <Link
                  href="/marketplace/pengiriman"
                  className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium hover:text-[#4338ca] dark:hover:text-[#4338ca] transition group mt-4"
                >
                  <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Kembali ke Pengiriman
                </Link>
              </div>

              <div className="lg:col-span-4">
                <PaymentSummaryCard />
              </div>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
