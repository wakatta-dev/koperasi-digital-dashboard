/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { ConfirmationHero } from "./components/confirmation/confirmation-hero";
import { ConfirmationSummary } from "./components/confirmation/confirmation-summary";
import { ConfirmationActions } from "./components/confirmation/confirmation-actions";
import { ConfirmationFooterLink } from "./components/confirmation/confirmation-footer-link";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceConfirmationPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={0} />
        <main className="flex-grow pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
          <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <ConfirmationHero />
            <ConfirmationSummary />
            <ConfirmationActions />
            <ConfirmationFooterLink />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
