/** @format */
"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { PaymentBreadcrumbs } from "./components/payment-breadcrumbs";
import { PaymentSteps } from "./components/payment-steps";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import {
  useCheckoutStore,
  isPaymentValid,
  isShippingValid,
} from "./state/checkout-store";
import { showToastError } from "@/lib/toast";
import { formatCurrency } from "@/lib/format";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar
          activeLabel="Marketplace"
          showCart
          cartCount={cartCount}
        />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentBreadcrumbs />
            <PaymentSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
              Metode Pembayaran
            </h1>

            {isError ? (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-red-500">
                Gagal memuat keranjang. Silakan kembali ke keranjang.
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-4">
                      Pilih Metode Pembayaran
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Simulasi pembayaran (tidak memproses pembayaran nyata).
                    </p>
                    <div className="space-y-3">
                      {["VA_BRI", "VA_MANDIRI", "COD"].map((method) => (
                        <label
                          key={method}
                          className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-[#4338ca] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={checkout.paymentMethod === method}
                            onChange={() => setField("paymentMethod", method)}
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {method === "VA_BRI"
                              ? "Virtual Account BRI (simulasi)"
                              : method === "VA_MANDIRI"
                              ? "Virtual Account Mandiri (simulasi)"
                              : "Bayar di Tempat (simulasi)"}
                          </span>
                        </label>
                      ))}
                    </div>
                    {touched && !paymentValid ? (
                      <div className="text-sm text-red-500 mt-2">
                        Pilih satu metode pembayaran.
                      </div>
                    ) : null}
                  </div>

                  <Link
                    href="/marketplace/pengiriman"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium hover:text-[#4338ca] dark:hover:text-[#4338ca] transition group"
                  >
                    <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    Kembali ke Pengiriman
                  </Link>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Ringkasan
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {cart?.items?.map?.((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.product_name} x {item.quantity}
                          </span>
                          <span>{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(cart?.total ?? 0)}</span>
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={!paymentValid}
                      className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg py-3 font-bold disabled:opacity-50"
                    >
                      Lanjut ke Ulasan
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
