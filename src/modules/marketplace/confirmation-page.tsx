/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import {
  BUYER_ORDER_CONTEXT_TTL_MS,
  readBuyerOrderContext,
  type BuyerOrderContextReadResult,
} from "./state/buyer-checkout-context";
import { Button } from "@/components/ui/button";
import { useMarketplaceOrder } from "@/hooks/queries/marketplace-orders";
import { formatCurrency } from "@/lib/format";
import { getMarketplaceCanonicalStatusLabel } from "@/modules/marketplace/utils/status";
import {
  classifyMarketplaceApiError,
  withMarketplaceDenyReasonMessage,
} from "@/services/api";

export function MarketplaceConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order_id") ?? "");

  const {
    data: orderDetail,
    isLoading,
    isError,
    error: orderQueryError,
    refetch,
  } = useMarketplaceOrder(orderId, {
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  const [contextResult, setContextResult] = useState<BuyerOrderContextReadResult>({
    context: null,
    state: "missing",
  });

  useEffect(() => {
    if (!Number.isFinite(orderId) || orderId <= 0) {
      setContextResult({ context: null, state: "missing" });
      return;
    }
    setContextResult(readBuyerOrderContext(orderId));
  }, [orderId]);

  const storedContext = contextResult.context;
  const isBackendConfirmed = Boolean(orderDetail);
  const usingLocalContext = Boolean(!orderDetail && storedContext);
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

  const orderErrorCopy = useMemo(() => {
    if (!isError) {
      return null;
    }
    const classified = classifyMarketplaceApiError(orderQueryError);
    if (classified.kind === "deny") {
      return {
        title: "Akses konfirmasi ditolak",
        message: withMarketplaceDenyReasonMessage({
          fallbackMessage:
            "Konfirmasi pesanan ini ditolak oleh kebijakan marketplace.",
          code: classified.code,
        }),
      };
    }
    if (classified.kind === "not_found") {
      return {
        title: "Pesanan tidak ditemukan",
        message:
          "Data pesanan tidak tersedia di backend. Lacak pesanan atau mulai checkout ulang.",
      };
    }
    if (classified.kind === "conflict") {
      return {
        title: "Status pesanan belum konsisten",
        message:
          "Status pesanan sedang diperbarui. Silakan muat ulang beberapa saat lagi.",
      };
    }
    if (classified.kind === "service_unavailable") {
      return {
        title: "Layanan konfirmasi tidak tersedia",
        message:
          "Layanan marketplace sedang terganggu. Coba lagi dalam beberapa menit.",
      };
    }
    return {
      title: "Gagal memuat data pesanan",
      message: "Coba muat ulang, atau kembali ke pelacakan pesanan.",
    };
  }, [isError, orderQueryError]);

  const contextStateNotice = useMemo(() => {
    if (orderDetail) {
      return null;
    }
    if (contextResult.state === "stale") {
      return `Context checkout lokal sudah kedaluwarsa (lebih dari ${Math.floor(
        BUYER_ORDER_CONTEXT_TTL_MS / (60 * 60 * 1000)
      )} jam). Muat ulang dari pelacakan pesanan untuk sinkronisasi backend.`;
    }
    if (contextResult.state === "invalid") {
      return "Context checkout lokal tidak valid dan sudah dibersihkan. Silakan buka kembali dari keranjang atau pelacakan.";
    }
    return null;
  }, [contextResult.state, orderDetail]);

  return (
    <div
      className="bg-background text-foreground min-h-screen flex flex-col"
      data-testid="marketplace-confirmation-page-root"
    >
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={0} />
      <main
        className="flex-1 pt-28 pb-20 bg-background"
        data-testid="marketplace-confirmation-page-main"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {!Number.isFinite(orderId) || orderId <= 0 ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground">Pesanan tidak ditemukan</h1>
              <p className="text-sm text-muted-foreground">
                Halaman konfirmasi membutuhkan ID pesanan yang valid.
              </p>
              <Link
                data-testid="marketplace-confirmation-invalid-back-to-cart-link"
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
              <h1 className="text-2xl font-bold text-destructive">
                {orderErrorCopy?.title ?? "Gagal memuat data pesanan"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {orderErrorCopy?.message ??
                  "Coba muat ulang, atau kembali ke pelacakan pesanan."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  data-testid="marketplace-confirmation-retry-button"
                  type="button"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                  onClick={() => refetch()}
                >
                  Muat Ulang
                </Button>
                <Link
                  data-testid="marketplace-confirmation-go-to-tracking-link"
                  href="/marketplace/pengiriman"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Ke Pelacakan
                </Link>
              </div>
            </div>
          ) : null}

          {contextStateNotice && !hasOrderContext ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
              {contextStateNotice}
            </div>
          ) : null}

          {hasOrderContext ? (
            <>
              <section className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    isBackendConfirmed
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <span className="material-icons-outlined text-4xl">
                    {isBackendConfirmed ? "check_circle" : "schedule"}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-foreground">
                  {isBackendConfirmed
                    ? "Pesanan Berhasil Dibuat"
                    : "Konfirmasi Lokal Sementara"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {isBackendConfirmed
                    ? "Pesanan Anda telah tercatat dan siap diproses."
                    : "Data ini berasal dari context lokal sementara. Konfirmasi backend belum tersedia."}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground">
                  <span>Nomor Pesanan</span>
                  <span className="text-indigo-600">{orderLabel}</span>
                </div>
                {usingLocalContext ? (
                  <p className="mt-3 text-xs text-amber-800">
                    Gunakan halaman pelacakan untuk sinkronisasi status terbaru dari backend.
                  </p>
                ) : null}
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
                      {proofStatus
                        ? getMarketplaceCanonicalStatusLabel(proofStatus)
                        : "Menunggu upload"}
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
                  data-testid="marketplace-confirmation-track-order-link"
                  href="/marketplace/pengiriman"
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Lacak Pesanan
                </Link>
                <Link
                  data-testid="marketplace-confirmation-continue-shopping-link"
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
