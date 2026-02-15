/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  checkoutMarketplace,
  classifyMarketplaceApiError,
  ensureMarketplaceSuccess,
} from "@/services/api";
import type {
  MarketplaceCartResponse,
  MarketplaceOrderResponse,
} from "@/types/api/marketplace";
import { QK } from "@/hooks/queries/queryKeys";
import {
  saveBuyerOrderContext,
  type BuyerCheckoutSnapshot,
} from "../../state/buyer-checkout-context";
import {
  DEFAULT_PAYMENT_METHOD,
  DEFAULT_SHIPPING_OPTION,
  getCheckoutCostBreakdown,
  type CheckoutCostBreakdown,
} from "../../config/checkoutPricing.config";
import { FeatureSectionCard } from "../shared/feature-section-card";
import { FieldRow } from "../shared/field-row";
import { OptionTile } from "../shared/option-tile";

type Props = {
  cart: MarketplaceCartResponse;
  onSuccess: (order: MarketplaceOrderResponse) => void;
  onCostChange?: (cost: CheckoutCostBreakdown) => void;
};

export function CheckoutForm({ cart, onSuccess, onCostChange }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingOption, setShippingOption] = useState(DEFAULT_SHIPPING_OPTION);
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [bankOption, setBankOption] = useState("BCA");
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const submittingRef = useRef(false);
  const qc = useQueryClient();

  const checkoutSnapshot = useMemo<BuyerCheckoutSnapshot>(
    () => ({
      customerName: recipientName.trim(),
      customerPhone: recipientPhone.trim(),
      customerEmail: email.trim(),
      customerAddress:
        `${address.trim()}, ${district.trim()}, ${city.trim()}, ${province.trim()}, ${postalCode.trim()}`.trim(),
      shippingOption,
      paymentMethod,
      bankOption: paymentMethod === "TRANSFER_BANK" ? bankOption : undefined,
      submittedAt: Date.now(),
    }),
    [
      address,
      bankOption,
      city,
      district,
      email,
      paymentMethod,
      postalCode,
      province,
      recipientName,
      recipientPhone,
      shippingOption,
    ],
  );

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!email.trim() || !email.includes("@")) {
      errors.push("Email valid wajib diisi.");
    }
    if (!phone.trim()) {
      errors.push("Nomor WhatsApp wajib diisi.");
    }
    if (!recipientName.trim()) {
      errors.push("Nama penerima wajib diisi.");
    }
    if (!recipientPhone.trim()) {
      errors.push("Nomor telepon penerima wajib diisi.");
    }
    if (!address.trim()) {
      errors.push("Alamat lengkap wajib diisi.");
    }
    if (!province.trim()) {
      errors.push("Provinsi wajib diisi.");
    }
    if (!city.trim()) {
      errors.push("Kota/Kabupaten wajib diisi.");
    }
    if (!district.trim()) {
      errors.push("Kecamatan wajib diisi.");
    }
    if (!postalCode.trim()) {
      errors.push("Kode pos wajib diisi.");
    }
    if (!shippingOption.trim()) {
      errors.push("Metode pengiriman wajib dipilih.");
    }
    if (!paymentMethod.trim()) {
      errors.push("Metode pembayaran wajib dipilih.");
    }
    if (paymentMethod === "TRANSFER_BANK" && !bankOption.trim()) {
      errors.push("Bank transfer wajib dipilih.");
    }
    if (!cart.items.length) {
      errors.push("Keranjang belanja kosong.");
    }

    return errors;
  }, [
    address,
    bankOption,
    cart.items.length,
    city,
    district,
    email,
    paymentMethod,
    phone,
    postalCode,
    province,
    recipientName,
    recipientPhone,
    shippingOption,
  ]);

  const isValid = validationErrors.length === 0;

  useEffect(() => {
    onCostChange?.(
      getCheckoutCostBreakdown({
        shippingOption,
        paymentMethod,
      })
    );
  }, [onCostChange, paymentMethod, shippingOption]);

  const handleSubmit = async () => {
    if (submittingRef.current || submitting) {
      return;
    }

    setShowValidation(true);
    if (!isValid) {
      showToastError("Data checkout belum lengkap", validationErrors.join(" "));
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const order = ensureMarketplaceSuccess(
        await checkoutMarketplace({
          fulfillment_method: "DELIVERY",
          customer_name: checkoutSnapshot.customerName,
          customer_phone: checkoutSnapshot.customerPhone,
          customer_email: checkoutSnapshot.customerEmail,
          customer_address: checkoutSnapshot.customerAddress,
          notes: `shipping=${shippingOption}; payment=${paymentMethod}; bank=${bankOption}`,
        }),
      );

      saveBuyerOrderContext({
        order,
        checkout: checkoutSnapshot,
      });
      showToastSuccess("Checkout berhasil", "Pesanan Anda telah dibuat");
      onSuccess(order);
      await qc.invalidateQueries({ queryKey: QK.marketplace.cart() });
    } catch (err: any) {
      const classified = classifyMarketplaceApiError(err);
      if (classified.kind === "deny") {
        showToastError(
          "Akses checkout ditolak",
          "Permintaan checkout ditolak kebijakan marketplace. Periksa akun atau coba ulang dari sesi yang valid."
        );
      } else if (classified.kind === "conflict") {
        showToastError("Checkout bentrok", err);
      } else if (classified.kind === "service_unavailable") {
        showToastError(
          "Layanan checkout sedang terganggu",
          "Silakan coba beberapa saat lagi."
        );
      } else {
        const msg = (classified.message ?? "").toLowerCase();
        if (msg.includes("insufficient stock")) {
          showToastError("Stok tidak cukup", err);
        } else if (msg.includes("not available")) {
          showToastError("Produk tidak tersedia", err);
        } else {
          showToastError("Gagal checkout", err);
        }
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FeatureSectionCard
        title="Informasi Kontak"
        description="Data ini digunakan untuk update pesanan"
        icon={<span className="material-icons-outlined">contact_mail</span>}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldRow
            label="Email"
            hint="Struk digital akan dikirim ke email ini."
          >
            <Input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={
                showValidation && (!email.trim() || !email.includes("@"))
              }
            />
          </FieldRow>

          <FieldRow label="Nomor WhatsApp">
            <Input
              type="tel"
              placeholder="812-3456-7890"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              aria-invalid={showValidation && !phone.trim()}
            />
          </FieldRow>
        </div>
      </FeatureSectionCard>

      <FeatureSectionCard
        title="Alamat Pengiriman"
        description="Pastikan alamat tujuan benar"
        icon={<span className="material-icons-outlined">location_on</span>}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Nama Penerima">
              <Input
                placeholder="Nama Lengkap Penerima"
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                aria-invalid={showValidation && !recipientName.trim()}
              />
            </FieldRow>
            <FieldRow label="Nomor Telepon Penerima">
              <Input
                placeholder="0812xxxx"
                value={recipientPhone}
                onChange={(event) => setRecipientPhone(event.target.value)}
                aria-invalid={showValidation && !recipientPhone.trim()}
              />
            </FieldRow>
          </div>

          <FieldRow label="Alamat Lengkap">
            <Textarea
              className="h-24 resize-none"
              placeholder="Nama Jalan, No. Rumah, RT/RW, Patokan (Cth: Seberang Masjid Al-Ikhlas)"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              aria-invalid={showValidation && !address.trim()}
            />
          </FieldRow>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Provinsi">
              <Input
                placeholder="Pilih Provinsi"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                aria-invalid={showValidation && !province.trim()}
              />
            </FieldRow>
            <FieldRow label="Kota / Kabupaten">
              <Input
                placeholder="Pilih Kota/Kabupaten"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                aria-invalid={showValidation && !city.trim()}
              />
            </FieldRow>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Kecamatan">
              <Input
                placeholder="Pilih Kecamatan"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                aria-invalid={showValidation && !district.trim()}
              />
            </FieldRow>
            <FieldRow label="Kode Pos">
              <Input
                placeholder="Contoh: 16750"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                aria-invalid={showValidation && !postalCode.trim()}
              />
            </FieldRow>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-foreground">
              Pilih Pengiriman
            </p>
            <div className="space-y-2">
              <OptionTile
                title="Reguler (JNE)"
                subtitle="Estimasi 2-3 Hari"
                value="JNE_REGULER"
                selected={shippingOption === "JNE_REGULER"}
                onSelect={setShippingOption}
                rightSlot={
                  <span className="text-sm font-bold text-indigo-600">
                    Rp 9.000
                  </span>
                }
              />
              <OptionTile
                title="Same Day (Gojek)"
                subtitle="Estimasi 6-8 Jam"
                value="GOJEK_SAME_DAY"
                selected={shippingOption === "GOJEK_SAME_DAY"}
                onSelect={setShippingOption}
                rightSlot={
                  <span className="text-sm font-bold text-indigo-600">
                    Rp 25.000
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </FeatureSectionCard>

      <FeatureSectionCard
        title="Metode Pembayaran"
        description="Transaksi aman & terverifikasi otomatis"
        icon={<span className="material-icons-outlined">payments</span>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <OptionTile
              title="QRIS"
              subtitle="Gopay, OVO, Dana"
              value="QRIS"
              selected={paymentMethod === "QRIS"}
              onSelect={setPaymentMethod}
            />
            <OptionTile
              title="Transfer Bank"
              subtitle="BCA, Mandiri, BRI"
              value="TRANSFER_BANK"
              selected={paymentMethod === "TRANSFER_BANK"}
              onSelect={setPaymentMethod}
            />
            <OptionTile
              title="E-Wallet"
              subtitle="LinkAja, ShopeePay"
              value="EWALLET"
              selected={paymentMethod === "EWALLET"}
              onSelect={setPaymentMethod}
            />
          </div>

          {paymentMethod === "TRANSFER_BANK" ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="mb-3 text-sm font-bold text-foreground">
                Pilih Bank
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(["BCA", "Mandiri", "BNI", "BRI"] as const).map((bank) => (
                  <Button
                    key={bank}
                    type="button"
                    variant="outline"
                    onClick={() => setBankOption(bank)}
                    className={`h-11 rounded-lg border text-sm font-bold transition ${
                      bankOption === bank
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-border bg-card text-foreground hover:border-indigo-300"
                    }`}
                    aria-pressed={bankOption === bank}
                  >
                    {bank}
                  </Button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Pembayaran akan diverifikasi secara otomatis, pastikan transfer
                sesuai nominal hingga 3 digit terakhir.
              </p>
            </div>
          ) : null}
        </div>
      </FeatureSectionCard>

      {showValidation && validationErrors.length > 0 ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <p className="font-semibold">Periksa data checkout Anda:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        type="button"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-center font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
        disabled={!isValid || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Memproses..." : "Bayar Sekarang"}
        <span
          aria-hidden="true"
          className="material-icons-outlined text-lg transition-transform group-hover:translate-x-1"
        >
          arrow_forward
        </span>
      </Button>
    </div>
  );
}
