/** @format */

"use client";


import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { CartBreadcrumbs } from "./components/cart/cart-breadcrumbs";
import { CheckoutSteps } from "./components/checkout/checkout-steps";
import { CartItemsSection } from "./components/cart/cart-items-section";
import { OrderSummaryCard } from "./components/order/order-summary-card";
import { CartRecommendations } from "./components/cart/cart-recommendations";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import Link from "next/link";
import { CheckoutForm } from "./components/checkout/checkout-form";
import { useState } from "react";
import type { MarketplaceOrderResponse } from "@/types/api/marketplace";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function MarketplaceCartPage() {
  const { data, isError, refetch } = useMarketplaceCart();
  const cartCount = data?.item_count ?? 0;
  const isEmpty = !data || data?.items?.length === 0;
  const [orderResult, setOrderResult] =
    useState<MarketplaceOrderResponse | null>(null);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar
        activeLabel="Marketplace"
        showCart
        cartCount={cartCount}
      />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartBreadcrumbs />
          <CheckoutSteps />

          <h1 className="text-3xl font-extrabold text-foreground mb-8">
            Keranjang Belanja Anda
          </h1>

          {isError ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive">
              Gagal memuat keranjang. Silakan coba lagi.
            </div>
          ) : null}

          {orderResult ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Checkout berhasil
              </h2>
              <p className="text-muted-foreground">
                Order ID: #{orderResult.id}
              </p>
                <div className="space-y-2">
                  {orderResult.items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.variant_option_id ?? "base"}`}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="font-semibold text-foreground">
                  Total: {formatCurrency(orderResult.total)}
                </div>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Kembali ke Marketplace
                  </Link>
                  <Button
                    onClick={() => {
                      setOrderResult(null);
                      refetch();
                    }}
                    variant="outline"
                    className="rounded-lg border-border text-foreground hover:bg-muted"
                  >
                    Lihat Keranjang
                  </Button>
                </div>
            </div>
          ) : null}

          {isEmpty && !isError && !orderResult ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center space-y-4">
              <div className="text-lg font-semibold text-foreground">
                Keranjang kosong
              </div>
              <p className="text-muted-foreground">
                Ayo temukan produk di marketplace.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
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
  );
}
