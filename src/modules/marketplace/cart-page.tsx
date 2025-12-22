/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { CartBreadcrumbs } from "./components/cart-breadcrumbs";
import { CheckoutSteps } from "./components/checkout-steps";
import { CartItemsSection } from "./components/cart-items-section";
import { OrderSummaryCard } from "./components/order-summary-card";
import { CartRecommendations } from "./components/cart-recommendations";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import Link from "next/link";
import { CheckoutForm } from "./components/checkout-form";
import { useState } from "react";
import type { MarketplaceOrderResponse } from "@/types/api/marketplace";
import { formatCurrency } from "@/lib/format";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceCartPage() {
  const { data, isError, refetch } = useMarketplaceCart();
  const cartCount = data?.item_count ?? 0;
  const isEmpty = !data || data?.items?.length === 0;
  const [orderResult, setOrderResult] =
    useState<MarketplaceOrderResponse | null>(null);

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar
          activeLabel="Marketplace"
          showCart
          cartCount={cartCount}
        />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CartBreadcrumbs />
            <CheckoutSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
              Keranjang Belanja Anda
            </h1>

            {isError ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-red-500">
                Gagal memuat keranjang. Silakan coba lagi.
              </div>
            ) : null}

            {orderResult ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Checkout berhasil
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Order ID: #{orderResult.id}
                </p>
                <div className="space-y-2">
                  {orderResult.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Total: {formatCurrency(orderResult.total)}
                </div>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] transition"
                  >
                    Kembali ke Marketplace
                  </Link>
                  <button
                    onClick={() => {
                      setOrderResult(null);
                      refetch();
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                  >
                    Lihat Keranjang
                  </button>
                </div>
              </div>
            ) : null}

            {isEmpty && !isError && !orderResult ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center space-y-4">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keranjang kosong
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Ayo temukan produk di marketplace.
                </p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] transition"
                >
                  Kembali ke Marketplace
                </Link>
              </div>
            ) : null}

            {!isEmpty && !isError && !orderResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <CartItemsSection cart={data} />
                  <CheckoutForm
                    cart={data}
                    onSuccess={(order) => setOrderResult(order)}
                  />
                </div>
                <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-6">
                  <OrderSummaryCard
                    subtotal={data?.total}
                    total={data?.total}
                    itemCount={data?.item_count}
                  />
                </div>
              </div>
            ) : null}

            <CartRecommendations />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
