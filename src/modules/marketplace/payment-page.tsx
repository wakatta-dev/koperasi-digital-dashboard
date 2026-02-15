/** @format */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { PaymentBreadcrumbs } from "./components/payment/payment-breadcrumbs";
import { PaymentSteps } from "./components/payment/payment-steps";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import {
  attachBuyerManualPayment,
  getBuyerOrderContext,
} from "./state/buyer-checkout-context";
import { Button } from "@/components/ui/button";
import { useMarketplaceOrder } from "@/hooks/queries/marketplace-orders";
import { ensureSuccess } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { submitMarketplaceManualPayment } from "@/services/api";

const BANK_ACCOUNT = "1234 5678 9012 3456";
const BANK_NAME = "Bank BRI";
const BANK_HOLDER = "BUMDes Sukamaju";
const MAX_PROOF_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_PROOF_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

function validateProofFile(file: File): string | null {
  if (!ALLOWED_PROOF_TYPES.has(file.type.toLowerCase())) {
    return "Format file harus JPG/JPEG/PNG.";
  }
  if (file.size > MAX_PROOF_SIZE_BYTES) {
    return "Ukuran file maksimal 2MB.";
  }
  return null;
}

export function MarketplacePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order_id") ?? "");

  const { data: cart } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;

  const {
    data: orderDetail,
    isLoading: orderLoading,
    isError: orderError,
    refetch: refetchOrder,
  } = useMarketplaceOrder(orderId, { enabled: Number.isFinite(orderId) && orderId > 0 });

  const [storedContext, setStoredContext] = useState<
    ReturnType<typeof getBuyerOrderContext>
  >(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofTouched, setProofTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return;
    }
    setStoredContext(getBuyerOrderContext(orderId));
  }, [orderId]);

  const orderItems = orderDetail?.items ?? storedContext?.order.items ?? [];
  const totalPayment = orderDetail?.total ?? storedContext?.order.total ?? 0;
  const orderLabel = useMemo(() => {
    if (orderDetail?.order_number) {
      return `#${orderDetail.order_number}`;
    }
    if (storedContext?.order.id) {
      return `#ORD-${storedContext.order.id}`;
    }
    return "-";
  }, [orderDetail?.order_number, storedContext?.order.id]);
  const customerEmail =
    orderDetail?.customer_email ?? storedContext?.checkout.customerEmail ?? "";

  const hasOrderContext = Boolean(orderId > 0 && (orderDetail || storedContext));

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard?.writeText(value);
      showToastSuccess("Tersalin", `${label} berhasil disalin.`);
    } catch {
      showToastError("Gagal menyalin", "Silakan salin secara manual.");
    }
  };

  const handleProofChange = (file: File | null) => {
    if (!file) {
      setProofFile(null);
      return;
    }

    const validationError = validateProofFile(file);
    if (validationError) {
      setProofFile(null);
      setProofTouched(true);
      setUploadError(validationError);
      showToastError("File bukti transfer tidak valid", validationError);
      return;
    }

    setUploadError(null);
    setProofFile(file);
    setProofTouched(true);
  };

  const handleNext = async () => {
    if (uploading) {
      return;
    }

    setProofTouched(true);
    if (!proofFile) {
      showToastError(
        "Bukti transfer diperlukan",
        "Unggah bukti transfer sebelum melanjutkan."
      );
      return;
    }

    if (!Number.isFinite(orderId) || orderId <= 0) {
      showToastError("ID pesanan tidak valid", "Kembali ke keranjang untuk checkout ulang.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const payment = ensureSuccess(
        await submitMarketplaceManualPayment(orderId, {
          file: proofFile,
          note: "Upload dari halaman pembayaran buyer marketplace",
          bank_name: BANK_NAME,
          account_name: BANK_HOLDER,
          transfer_amount: totalPayment > 0 ? totalPayment : undefined,
          transfer_date: new Date().toISOString().slice(0, 10),
        })
      );

      attachBuyerManualPayment(orderId, payment);
      showToastSuccess("Bukti pembayaran terkirim", "Lanjutkan ke halaman konfirmasi.");
      router.push(`/marketplace/konfirmasi?order_id=${orderId}`);
    } catch (err: any) {
      const message =
        (err as Error)?.message ||
        "Gagal mengunggah bukti pembayaran. Silakan periksa file dan coba lagi.";
      setUploadError(message);
      showToastError("Gagal mengunggah bukti", message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={cartCount} />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentBreadcrumbs />
          <PaymentSteps />

          {hasOrderContext ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              <h2 className="text-xl font-bold">Checkout berhasil</h2>
              <p className="mt-1 text-sm">
                Order ID: {orderLabel}
              </p>
            </div>
          ) : null}

          <h1 className="text-3xl font-extrabold text-foreground mb-8">
            Pembayaran Transfer Bank Manual
          </h1>

          {hasOrderContext ? (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                onClick={() => router.push("/marketplace/keranjang")}
              >
                Bayar Sekarang
              </Button>
            </div>
          ) : null}

          {!Number.isFinite(orderId) || orderId <= 0 ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <p className="text-destructive font-medium">ID pesanan tidak ditemukan.</p>
              <p className="text-sm text-muted-foreground">
                Mulai checkout dari keranjang agar konteks pesanan tersimpan dengan benar.
              </p>
              <Link
                href="/marketplace/keranjang"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Kembali ke Keranjang
              </Link>
            </div>
          ) : null}

          {orderLoading && !storedContext ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-muted-foreground">
              Memuat detail pesanan...
            </div>
          ) : null}

          {orderError && !storedContext ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive space-y-3">
              <p>Gagal memuat detail pesanan. Silakan coba lagi.</p>
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                onClick={() => refetchOrder()}
              >
                Muat Ulang
              </Button>
            </div>
          ) : null}

          {hasOrderContext ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 flex items-start gap-4">
                  <span className="material-icons-outlined text-orange-600 dark:text-orange-400 mt-0.5">
                    timer
                  </span>
                  <div>
                    <h3 className="font-bold text-orange-900 dark:text-orange-200">
                      Selesaikan Pembayaran
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-300 mt-1">
                      Harap selesaikan pembayaran dalam <strong>1x24 jam</strong>.
                      Pesanan otomatis dibatalkan jika melewati batas waktu.
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <h2 className="font-bold text-xl text-foreground mb-6">
                      Instruksi Transfer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Bank Tujuan
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              BRI
                            </div>
                            <div>
                              <p className="font-bold text-lg text-foreground leading-none">
                                {BANK_NAME}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {BANK_HOLDER}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Nomor Rekening
                          </p>
                          <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-lg border border-border">
                            <span className="font-mono text-xl font-bold text-foreground tracking-wide">
                              {BANK_ACCOUNT}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-8 w-8 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              title="Salin"
                              onClick={() => handleCopy(BANK_ACCOUNT, "Nomor rekening")}
                            >
                              <span className="material-icons-outlined text-lg">
                                content_copy
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Total Transfer
                          </p>
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(totalPayment)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-auto p-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-transparent hover:text-indigo-700 dark:hover:text-indigo-300"
                                onClick={() =>
                                  handleCopy(String(totalPayment), "Total transfer")
                                }
                              >
                                Salin
                              </Button>
                            </div>
                            <div className="text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-1.5">
                              <span className="material-icons-outlined text-sm mt-0.5">
                                info
                              </span>
                              <span>
                                Pastikan nominal transfer sesuai hingga 3 digit
                                terakhir.
                              </span>
                            </div>
                          </div>
                        </div>
                        {customerEmail ? (
                          <div className="text-xs text-muted-foreground">
                            Notifikasi akan dikirim ke: <strong>{customerEmail}</strong>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          ?
                        </span>
                        Cara Pembayaran
                      </h3>
                      <ol className="space-y-4 list-decimal list-inside text-sm text-muted-foreground">
                        <li className="pl-2">
                          <span className="ml-1">
                            Buka aplikasi Mobile Banking BRI atau datang ke ATM
                            BRI terdekat.
                          </span>
                        </li>
                        <li className="pl-2">
                          <span className="ml-1">
                            Pilih menu <strong>Transfer &gt; Sesama BRI</strong>.
                          </span>
                        </li>
                        <li className="pl-2">
                          <span className="ml-1">
                            Masukkan nomor rekening tujuan <strong>{BANK_ACCOUNT}</strong>.
                          </span>
                        </li>
                        <li className="pl-2">
                          <span className="ml-1">
                            Masukkan nominal transfer sebesar <strong>{formatCurrency(totalPayment)}</strong>.
                          </span>
                        </li>
                        <li className="pl-2">
                          <span className="ml-1">
                            Simpan bukti transfer/struk transaksi Anda.
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <h2 className="font-bold text-xl text-foreground mb-2">
                      Unggah Bukti Transfer
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Untuk mempercepat proses verifikasi, mohon unggah foto
                      bukti transfer Anda di sini.
                    </p>
                    <div className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 hover:border-indigo-500 transition-all cursor-pointer group">
                      <input
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          handleProofChange(file);
                        }}
                      />
                      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <span className="material-icons-outlined text-3xl">
                          cloud_upload
                        </span>
                      </div>
                      <p className="font-bold text-foreground mb-1">
                        Klik untuk unggah atau seret gambar ke sini
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Format: JPG, PNG, JPEG (Maks. 2MB)
                      </p>
                      <div className="mt-6 px-5 py-2.5 bg-card border border-border text-muted-foreground rounded-lg text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm group-hover:shadow-md">
                        Pilih File
                      </div>
                    </div>
                    {proofFile ? (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Bukti diunggah: <strong>{proofFile.name}</strong>
                      </p>
                    ) : null}
                    {proofTouched && !proofFile ? (
                      <p className="mt-3 text-xs text-destructive">
                        Bukti transfer wajib diunggah.
                      </p>
                    ) : null}
                    {uploadError ? (
                      <p className="mt-2 text-xs text-destructive">{uploadError}</p>
                    ) : null}
                  </div>
                </div>

                <Link
                  href="/marketplace/keranjang"
                  className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition group"
                >
                  <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Kembali ke Keranjang
                </Link>
              </div>

              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      ID Pesanan
                    </span>
                    <span className="font-mono font-bold text-foreground tracking-tight">
                      {orderLabel}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Ringkasan Pesanan</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {orderItems.map((item) => (
                      <div key={`${item.order_item_id ?? item.product_id}`} className="flex justify-between gap-4">
                        <span>
                          {item.product_name} x {item.quantity}
                        </span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total Tagihan</span>
                    <span>{formatCurrency(totalPayment)}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!proofFile || uploading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-bold disabled:opacity-50"
                  >
                    {uploading ? "Mengirim bukti..." : "Konfirmasi Pembayaran Saya"}
                  </Button>
                  <div className="flex items-start gap-3 text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl border border-border">
                    <span className="material-icons-outlined text-base text-muted-foreground mt-0.5">
                      lock
                    </span>
                    <p>
                      Data pembayaran Anda dienkripsi dan diproses dengan aman
                      oleh sistem BUMDes.
                    </p>
                  </div>
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
