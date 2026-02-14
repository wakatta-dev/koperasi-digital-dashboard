/** @format */

"use client";

import { useMemo, useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { showToastSuccess } from "@/lib/toast";
import type { MarketplaceOrderStatus } from "@/types/api/marketplace";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";
import { StatusDetailFeature } from "./components/shipping/status-detail-feature";
import { TrackingFormFeature } from "./components/shipping/tracking-form-feature";

type TrackingView = "track" | "not-found" | "verification" | "delivery";

const DEMO_ORDER_NUMBER = "INV-20231024-0001";
const DEMO_CONTACT = "budi@email.com";

export function MarketplaceShippingPage() {
  const { data: cart } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;

  const [view, setView] = useState<TrackingView>("track");
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [reviewOpen, setReviewOpen] = useState(false);

  const shippingStatus: MarketplaceOrderStatus =
    view === "delivery" ? "IN_DELIVERY" : "PAYMENT_VERIFICATION";

  const detail = useMemo(
    () => ({
      orderNumber: `#${DEMO_ORDER_NUMBER}`,
      status: shippingStatus,
      shippingMethod: "JNE Regular",
      trackingNumber: view === "delivery" ? "JNE1234567890" : undefined,
      customerName: "Budi Santoso",
      customerAddress: "Jl. Melati No. 12, Sukamaju",
      totalLabel: "Rp 260.000",
    }),
    [shippingStatus, view],
  );

  const handleTrack = () => {
    const orderValid = orderNumber.trim().toUpperCase() === DEMO_ORDER_NUMBER;
    const contactValid =
      contact.trim().toLowerCase() === DEMO_CONTACT ||
      contact.trim().includes("0812");

    if (orderValid && contactValid) {
      setErrorMessage(undefined);
      setView("verification");
      return;
    }

    setView("not-found");
    setErrorMessage(
      "Maaf, kami tidak dapat menemukan pesanan dengan kombinasi kode dan data tersebut. Silakan periksa kembali input Anda.",
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={cartCount} />

      <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {view === "track" ? (
          <TrackingFormFeature
            title="Lacak Pesanan Anda"
            description="Masukkan Kode Pesanan dan data verifikasi Anda untuk melihat status pengiriman terkini tanpa perlu login."
            orderNumber={orderNumber}
            contact={contact}
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
          />
        ) : null}

        {view === "not-found" ? (
          <TrackingFormFeature
            title="Pesanan Tidak Ditemukan"
            description="Maaf, kami tidak dapat menemukan pesanan dengan kombinasi kode dan data tersebut. Silakan periksa kembali input Anda."
            orderNumber={orderNumber || DEMO_ORDER_NUMBER}
            contact={contact || DEMO_CONTACT}
            notFound
            errorMessage={errorMessage}
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
          />
        ) : null}

        {view === "verification" || view === "delivery" ? (
          <StatusDetailFeature
            detail={detail}
            onChangeVariant={(next) =>
              setView(next === "delivery" ? "delivery" : "verification")
            }
            onOpenReview={() => setReviewOpen(true)}
          />
        ) : null}
      </main>

      <ReviewOverlayDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        items={[
          { id: "p1", name: "Kopi Arabika Premium" },
          { id: "p2", name: "Madu Hutan Sukamaju" },
        ]}
        onSubmit={() => {
          setReviewOpen(false);
          showToastSuccess("Terima kasih", "Ulasan pesanan berhasil dikirim.");
        }}
      />

      <LandingFooter />
    </div>
  );
}
