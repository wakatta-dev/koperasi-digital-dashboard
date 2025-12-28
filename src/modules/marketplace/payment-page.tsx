/** @format */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { PaymentBreadcrumbs } from "./components/payment-breadcrumbs";
import { PaymentSteps } from "./components/payment-steps";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCheckoutStore,
  isPaymentValid,
  isShippingValid,
} from "./state/checkout-store";
import { showToastError } from "@/lib/toast";
import { formatCurrency } from "@/lib/format";

export function MarketplacePaymentPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;
  const checkout = useCheckoutStore();
  const setField = useCheckoutStore((s) => s.setField);
  const paymentValid = isPaymentValid(checkout);
  const shippingValid = isShippingValid(checkout);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!shippingValid || (!isLoading && !cart?.items?.length)) {
      router.replace("/marketplace/pengiriman");
    }
  }, [cart?.items?.length, isLoading, router, shippingValid]);

  const handleNext = () => {
    setTouched(true);
    if (!paymentValid) {
      showToastError(
        "Pilih metode pembayaran",
        "Silakan pilih metode pembayaran simulasi"
      );
      return;
    }
    router.push("/marketplace/ulasan");
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar
        activeLabel="Marketplace"
        showCart
        cartCount={cartCount}
      />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentBreadcrumbs />
          <PaymentSteps />

          <h1 className="text-3xl font-extrabold text-foreground mb-8">
            Metode Pembayaran
          </h1>

          {isError ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive">
              Gagal memuat keranjang. Silakan kembali ke keranjang.
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <h2 className="font-bold text-xl text-foreground mb-4">
                    Pilih Metode Pembayaran
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulasi pembayaran (tidak memproses pembayaran nyata).
                  </p>
                  <RadioGroup
                    className="space-y-3"
                    value={checkout.paymentMethod ?? ""}
                    onValueChange={(value) => setField("paymentMethod", value)}
                  >
                    {["VA_BRI", "VA_MANDIRI", "COD"].map((method) => (
                      <Label
                        key={method}
                        htmlFor={`payment-${method}`}
                        className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 hover:border-indigo-500 cursor-pointer"
                      >
                        <RadioGroupItem value={method} id={`payment-${method}`} />
                        <span className="text-sm text-foreground cursor-pointer">
                          {method === "VA_BRI"
                            ? "Virtual Account BRI (simulasi)"
                            : method === "VA_MANDIRI"
                              ? "Virtual Account Mandiri (simulasi)"
                              : "Bayar di Tempat (simulasi)"}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                  {touched && !paymentValid ? (
                    <div className="text-sm text-destructive mt-2">
                      Pilih satu metode pembayaran.
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/marketplace/pengiriman"
                  className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition group"
                >
                  <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Kembali ke Pengiriman
                </Link>
              </div>

              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-3">
                  <h3 className="font-bold text-lg text-foreground">
                    Ringkasan
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {cart?.items?.map?.((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.product_name} x {item.quantity}
                        </span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(cart?.total ?? 0)}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!paymentValid}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-bold disabled:opacity-50"
                  >
                    Lanjut ke Ulasan
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
