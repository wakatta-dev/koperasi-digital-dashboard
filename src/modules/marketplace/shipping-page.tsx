/** @format */
"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar
          activeLabel="Marketplace"
          showCart
          cartCount={cartCount}
        />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ShippingBreadcrumbs />
            <ShippingSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
              Informasi Pengiriman
            </h1>

            {isError ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-red-500">
                Gagal memuat keranjang. Silakan kembali ke keranjang.
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-bold text-xl text-gray-900 dark:text-white">
                          Alamat & Kontak
                        </h2>
                        <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
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
                          <div className="text-sm text-red-500">
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
                      className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium hover:text-[#4338ca] dark:hover:text-[#4338ca] transition group"
                    >
                      <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                      Kembali ke Keranjang
                    </Link>
                    <button
                      onClick={handleNext}
                      disabled={!cart?.items?.length}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] transition disabled:opacity-50"
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
    </div>
  );
}
