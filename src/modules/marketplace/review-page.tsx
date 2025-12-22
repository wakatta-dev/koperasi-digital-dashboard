/** @format */
"use client";

import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { ReviewBreadcrumbs } from "./components/review-breadcrumbs";
import { ReviewSteps } from "./components/review-steps";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { formatCurrency } from "@/lib/format";
import { checkoutMarketplace } from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  useCheckoutStore,
  isPaymentValid,
  isShippingValid,
} from "./state/checkout-store";
import type { MarketplaceOrderResponse } from "@/types/api/marketplace";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceReviewPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError, refetch } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;
  const checkout = useCheckoutStore();
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const shippingValid = isShippingValid(checkout);
  const paymentValid = isPaymentValid(checkout);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] =
    useState<MarketplaceOrderResponse | null>(null);

  useEffect(() => {
    if (
      !shippingValid ||
      !paymentValid ||
      (!isLoading && !cart?.items?.length)
    ) {
      router.replace("/marketplace/pembayaran");
    }
  }, [cart?.items?.length, isLoading, paymentValid, router, shippingValid]);

  const subtotal = useMemo(
    () => cart?.items?.reduce((acc, i) => acc + i.subtotal, 0) ?? 0,
    [cart?.items]
  );

  const handleSubmit = async () => {
    if (!shippingValid || !paymentValid || !cart?.items?.length) {
      showToastError(
        "Data belum lengkap",
        "Lengkapi pengiriman dan pembayaran"
      );
      return;
    }
    setSubmitting(true);
    try {
      const order = ensureSuccess(
        await checkoutMarketplace({
          fulfillment_method: checkout.fulfillment,
          customer_name: checkout.name,
          customer_phone: checkout.phone,
          customer_email: checkout.email,
          customer_address:
            checkout.fulfillment === "DELIVERY" ? checkout.address : "",
          notes: checkout.notes,
        })
      );
      setOrderResult(order);
      resetCheckout();
      await refetch();
      showToastSuccess("Pesanan dibuat", "Checkout berhasil");
    } catch (err: any) {
      const msg = (err as Error)?.message?.toLowerCase() ?? "";
      if (msg.includes("insufficient stock")) {
        showToastError("Stok tidak cukup", err);
        router.replace("/marketplace/keranjang");
      } else {
        showToastError("Checkout gagal", err);
      }
    } finally {
      setSubmitting(false);
    }
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
            <ReviewBreadcrumbs />
            <ReviewSteps />

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
              Ulasan Pesanan &amp; Konfirmasi
            </h1>

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
                      router.replace("/marketplace/keranjang");
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                  >
                    Lihat Keranjang
                  </button>
                </div>
              </div>
            ) : null}

            {!orderResult && !isError ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Alamat & Kontak
                    </h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <div>{checkout.name}</div>
                      <div>{checkout.phone}</div>
                      <div>{checkout.email}</div>
                      {checkout.fulfillment === "DELIVERY" ? (
                        <div>{checkout.address}</div>
                      ) : (
                        <div>Pickup di lokasi</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Metode Pembayaran
                    </h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {checkout.paymentMethod || "Belum dipilih"}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Ringkasan Barang
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
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                  </div>
                  <Link
                    href="/marketplace/pembayaran"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium hover:text-[#4338ca] dark:hover:text-[#4338ca] transition group"
                  >
                    <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    Kembali ke Pembayaran
                  </Link>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                  <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Total Pembayaran
                    </h3>
                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(cart?.total ?? subtotal)}</span>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg py-3 font-bold disabled:opacity-50"
                    >
                      {submitting ? "Memproses..." : "Konfirmasi & Bayar"}
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
