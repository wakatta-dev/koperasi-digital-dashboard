/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { getBuyerOrderContext } from "./state/buyer-checkout-context";
import { Button } from "@/components/ui/button";
import { useMarketplaceOrder } from "@/hooks/queries/marketplace-orders";
import { formatCurrency } from "@/lib/format";
import { getMarketplaceCanonicalStatusLabel } from "@/modules/marketplace/utils/status";

export function MarketplaceConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order_id") ?? "");

  const {
    data: orderDetail,
    isLoading,
    isError,
    refetch,
  } = useMarketplaceOrder(orderId, {
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  const [storedContext, setStoredContext] = useState<
    ReturnType<typeof getBuyerOrderContext>
  >(null);

  useEffect(() => {
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return;
    }
    setStoredContext(getBuyerOrderContext(orderId));
  }, [orderId]);

  const hasOrderContext = Boolean(orderId > 0 && (orderDetail || storedContext));
  const orderItems = orderDetail?.items ?? storedContext?.order.items ?? [];
  const total = orderDetail?.total ?? storedContext?.order.total ?? 0;
  const customerName =
    orderDetail?.customer_name ?? storedContext?.checkout.customerName ?? "Pembeli";
  const customerAddress =
    orderDetail?.customer_address ?? storedContext?.checkout.customerAddress ?? "-";
  const orderLabel = useMemo(() => {
    if (orderDetail?.order_number) {
      return `#${orderDetail.order_number}`;
    }
    if (storedContext?.order.id) {
      return `#ORD-${storedContext.order.id}`;
    }
    return "-";
  }, [orderDetail?.order_number, storedContext?.order.id]);

  const statusLabel = getMarketplaceCanonicalStatusLabel(
    orderDetail?.status ?? storedContext?.order.status
  );
  const proofStatus =
    orderDetail?.manual_payment?.status ?? storedContext?.manualPayment?.status;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={0} />
      <main className="flex-1 pt-28 pb-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {!Number.isFinite(orderId) || orderId <= 0 ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground">Pesanan tidak ditemukan</h1>
              <p className="text-sm text-muted-foreground">
                Halaman konfirmasi membutuhkan ID pesanan yang valid.
              </p>
              <Link
                href="/marketplace/keranjang"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Kembali ke Keranjang
              </Link>
            </div>
          ) : null}

          {isLoading && !storedContext ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center text-muted-foreground">
              Memuat konfirmasi pesanan...
            </div>
          ) : null}

          {isError && !storedContext ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-4 text-center">
              <h1 className="text-2xl font-bold text-destructive">Gagal memuat data pesanan</h1>
              <p className="text-sm text-muted-foreground">
                Coba muat ulang, atau kembali ke pelacakan pesanan.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                  onClick={() => refetch()}
                >
                  Muat Ulang
                </Button>
                <Link
                  href="/marketplace/pengiriman"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Ke Pelacakan
                </Link>
              </div>
            </div>
          ) : null}

          {hasOrderContext ? (
            <>
              <section className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <span className="material-icons-outlined text-4xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-extrabold text-foreground">Pesanan Berhasil Dibuat</h1>
                <p className="mt-2 text-muted-foreground">
                  Pesanan Anda telah tercatat dan siap diproses.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground">
                  <span>Nomor Pesanan</span>
                  <span className="text-indigo-600">{orderLabel}</span>
                </div>
              </section>

              <section className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground">Ringkasan Konfirmasi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Penerima</p>
                    <p className="font-semibold text-foreground">{customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground">{statusLabel}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-muted-foreground">Alamat</p>
                    <p className="font-semibold text-foreground">{customerAddress}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total Pembayaran</p>
                    <p className="font-semibold text-foreground">{formatCurrency(total)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Bukti Pembayaran</p>
                    <p className="font-semibold text-foreground">
                      {proofStatus ? getMarketplaceCanonicalStatusLabel(proofStatus) : "Menunggu upload"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  {orderItems.map((item) => (
                    <div
                      key={`${item.order_item_id ?? item.product_id}`}
                      className="flex items-center justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/marketplace/pengiriman"
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Lacak Pesanan
                </Link>
                <Link
                  href="/marketplace"
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:bg-muted"
                >
                  Lanjutkan Belanja
                </Link>
              </section>
            </>
          ) : null}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
