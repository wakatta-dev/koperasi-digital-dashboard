/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { CartBreadcrumbs } from "./components/cart-breadcrumbs";
import { CheckoutSteps } from "./components/checkout-steps";
import { CartItemsSection } from "./components/cart-items-section";
import { OrderSummaryCard } from "./components/order-summary-card";
import { CartRecommendations } from "./components/cart-recommendations";
import { CART_BADGE } from "./constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceCartPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CartBreadcrumbs />
            <CheckoutSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
              Keranjang Belanja Anda
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <CartItemsSection />
              <div className="lg:col-span-4">
                <OrderSummaryCard />
              </div>
            </div>

            <CartRecommendations />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
