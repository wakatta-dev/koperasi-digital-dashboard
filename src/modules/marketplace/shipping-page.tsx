/** @format */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { ShippingBreadcrumbs } from "./components/shipping-breadcrumbs";
import { ShippingSteps } from "./components/shipping-steps";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCheckoutStore, isShippingValid } from "./state/checkout-store";
import { showToastError } from "@/lib/toast";

export function MarketplaceShippingPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;
  const checkout = useCheckoutStore();
  const setField = useCheckoutStore((s) => s.setField);
  const shippingValid = useMemo(() => isShippingValid(checkout), [checkout]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isLoading && !cart?.items?.length) {
      router.replace("/marketplace/keranjang");
    }
  }, [cart?.items?.length, isLoading, router]);

  const handleNext = () => {
    setTouched(true);
    if (!shippingValid) {
      showToastError(
        "Lengkapi data pengiriman",
        "Nama, telepon, email wajib diisi. Alamat wajib untuk delivery."
      );
      return;
    }
    router.push("/marketplace/pembayaran");
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
          <ShippingBreadcrumbs />
          <ShippingSteps />

          <h1 className="text-3xl font-extrabold text-foreground mb-8">
            Informasi Pengiriman
          </h1>

          {isError ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive">
              Gagal memuat keranjang. Silakan kembali ke keranjang.
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                      <h2 className="font-bold text-xl text-foreground">
                        Alamat & Kontak
                      </h2>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={checkout.fulfillment === "PICKUP"}
                              onChange={() => setField("fulfillment", "PICKUP")}
                            />
                            Pickup
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={checkout.fulfillment === "DELIVERY"}
                              onChange={() =>
                                setField("fulfillment", "DELIVERY")
                              }
                            />
                            Delivery
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Nama lengkap"
                            value={checkout.name}
                            onChange={(e) => setField("name", e.target.value)}
                          />
                          <Input
                            placeholder="No. HP"
                            value={checkout.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={checkout.email}
                            onChange={(e) => setField("email", e.target.value)}
                          />
                        </div>

                        {checkout.fulfillment === "DELIVERY" ? (
                          <Textarea
                            placeholder="Alamat lengkap"
                            value={checkout.address}
                            onChange={(e) =>
                              setField("address", e.target.value)
                            }
                          />
                        ) : null}

                        <Textarea
                          placeholder="Catatan (opsional)"
                          value={checkout.notes}
                          onChange={(e) => setField("notes", e.target.value)}
                        />

                      {touched && !shippingValid ? (
                        <div className="text-sm text-destructive">
                          Lengkapi nama, telepon, email, dan alamat (untuk
                          delivery).
                        </div>
                      ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href="/marketplace/keranjang"
                      className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition group"
                    >
                      <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                      Kembali ke Keranjang
                    </Link>
                    <button
                      onClick={handleNext}
                      disabled={!cart?.items?.length}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Lanjut ke Pembayaran
                    </button>
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
