/** @format */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { CartBreadcrumbs } from "./components/cart/cart-breadcrumbs";
import { CheckoutSteps } from "./components/checkout/checkout-steps";
import { CartItemsSection } from "./components/cart/cart-items-section";
import { OrderSummaryCard } from "./components/order/order-summary-card";
import { CartRecommendations } from "./components/cart/cart-recommendations";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { CheckoutForm } from "./components/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_PAYMENT_METHOD,
  DEFAULT_SHIPPING_OPTION,
  getCheckoutCostBreakdown,
  type CheckoutCostBreakdown,
} from "./config/checkoutPricing.config";

export function MarketplaceCartPage() {
  const router = useRouter();
  const { data, isError, isLoading, refetch } = useMarketplaceCart();
  const [emptySyncRetries, setEmptySyncRetries] = useState(0);
  const [isSyncingEmptyCart, setIsSyncingEmptyCart] = useState(false);
  const [checkoutCost, setCheckoutCost] = useState<CheckoutCostBreakdown>(() =>
    getCheckoutCostBreakdown({
      shippingOption: DEFAULT_SHIPPING_OPTION,
      paymentMethod: DEFAULT_PAYMENT_METHOD,
    })
  );
  const cartCount = data?.item_count ?? 0;
  const subtotal = useMemo(
    () => data?.items.reduce((sum, item) => sum + item.subtotal, 0) ?? 0,
    [data]
  );
  const total =
    subtotal +
    checkoutCost.shippingCost +
    checkoutCost.serviceFee -
    checkoutCost.itemDiscount;
  const hasItems = Boolean(data && data.items.length > 0);
  const canShowEmptyState =
    !isLoading && !isSyncingEmptyCart && emptySyncRetries >= 2;
  const isEmpty = canShowEmptyState && !hasItems;

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }

    if (hasItems) {
      if (emptySyncRetries !== 0) {
        setEmptySyncRetries(0);
      }
      if (isSyncingEmptyCart) {
        setIsSyncingEmptyCart(false);
      }
      return;
    }

    if (emptySyncRetries >= 2 || isSyncingEmptyCart) {
      return;
    }

    setIsSyncingEmptyCart(true);
    const timer = window.setTimeout(() => {
      setEmptySyncRetries((count) => count + 1);
      void refetch().finally(() => {
        setIsSyncingEmptyCart(false);
      });
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    emptySyncRetries,
    hasItems,
    isError,
    isLoading,
    isSyncingEmptyCart,
    refetch,
  ]);

  const syncHint = useMemo(() => {
    if (!isSyncingEmptyCart || hasItems) {
      return null;
    }
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Menyinkronkan keranjang...
      </div>
    );
  }, [hasItems, isSyncingEmptyCart]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={cartCount} />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartBreadcrumbs />
          <CheckoutSteps />

          <h1 className="text-3xl font-extrabold text-foreground mb-8">
            Keranjang Belanja Anda
          </h1>

          {isError ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive space-y-3">
              <p>Gagal memuat keranjang. Silakan coba lagi.</p>
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                onClick={() => refetch()}
              >
                Muat Ulang Keranjang
              </Button>
            </div>
          ) : null}

          {syncHint}

          {isEmpty && !isError ? (
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

          {!isEmpty && !isError && data ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <CartItemsSection cart={data} />
                <CheckoutForm
                  cart={data}
                  onCostChange={setCheckoutCost}
                  onSuccess={(order) => {
                    router.push(`/marketplace/pembayaran?order_id=${order.id}`);
                  }}
                />
              </div>
              <div className="mt-4 lg:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-6">
                <OrderSummaryCard
                  subtotal={subtotal}
                  total={total}
                  shippingCost={checkoutCost.shippingCost}
                  itemDiscount={checkoutCost.itemDiscount}
                  serviceFee={checkoutCost.serviceFee}
                  itemCount={data.item_count}
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
